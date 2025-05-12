import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Genius } from '../models/Genius';
import { Category } from '../models/category';
import { GeniusesCategory } from '../models/Geniuses-category';
import { Observable, of, BehaviorSubject, forkJoin } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class GeniusService {

  constructor(private apiService : ApiService) {
    this.getAllGeniuses();
  }

  // Lista para guardar todos los genios solicitados a la API de mediaWiki
  private allGeniusesByCategory: GeniusesCategory = {
    [Category.Math] : [],
    [Category.Physic] : [],
    [Category.Informatic] : []
  } 
  private filteredGeniuses$: BehaviorSubject<GeniusesCategory> = new BehaviorSubject<GeniusesCategory>({
    [Category.Math]: [],
    [Category.Physic]: [],
    [Category.Informatic]: []
  });
  
  // Se encarga de llamar automáticamente a la API si el objeto literal allGeniusesByCategory está vacío
  getAllGeniuses(): void {
    if(!this.isDataLoaded()){
      this.loadAllGeniuses();
    }
  }

  isDataLoaded() : boolean {
    // Devuelve true si en TODAS las lista de genios hay por lo menos 1
    return Object.values(this.allGeniusesByCategory).some((categoryList) => categoryList.length > 0);
  }

  // Solicitamos todos los datos de los genios y los guardamos en el objeto literal allGeniusesByCategory
  loadAllGeniuses(): void {
    // 1º Llamamos al servicio de la API para obtener los nombres de los genios
    this.apiService.getAllGeniusesNames().pipe(
      switchMap(({math, physic, informatic}) => {

        // Para cada genio, obtenemos todos sus datos
        const request = [...math, ...physic, ...informatic].map((genius) => {
          return this.apiService.getIdGenius(genius.name).pipe(
            switchMap((geniusData) => {

              // Si obtenemos datos del genio , pedimos la imagen y el resumen
              if(geniusData){
                const photo$ = this.apiService.getImage(genius.name);
                const summary$ = this.apiService.getSummary(genius.name);
               
               
                // Hacemos una petición combinada
                return forkJoin({photo : photo$, summary : summary$}).pipe(
                  map(({photo, summary}) =>  ({
                    ...geniusData,
                    name : genius.name,
                    photoURL : photo,
                    summary : summary
                  }))
                );
              }else {
                return of(null) // Si no hay datos, devolvemos null
              }
            })
          );
        });

        // Cuando todas la peticiones se completen, devolvemos los datos
        return forkJoin(request).pipe(
          map((geniuses : (Genius | null)[]) => {
          // 1) Primero, filtramos los nulls con type predicate
          const nonNull = geniuses.filter((g): g is Genius => g !== null);

          // 2) Luego, filtramos por categoría usando el name original
          const byMath       = nonNull.filter(g => math.some(m => m.name === g.name));
          const byPhysic     = nonNull.filter(g => physic.some(p => p.name === g.name));
          const byInformatic = nonNull.filter(g => informatic.some(i => i.name === g.name));

          // 3) Por último, modificamos el formato del nombre de cada genio
            this.allGeniusesByCategory[Category.Math] = byMath.filter(g => !!g && math.some(m => m.name === g!.name)).map( g => ({...g, name: this.normalizeName(g?.name)})) as Genius[];
            this.allGeniusesByCategory[Category.Physic] = byPhysic.filter(g => !!g && physic.some(p => p.name === g!.name)).map( g => ({...g, name: this.normalizeName(g?.name )})) as Genius[];
            this.allGeniusesByCategory[Category.Informatic] = byInformatic.filter(g => !!g && informatic.some(i => i.name === g!.name)).map( g => ({...g, name: this.normalizeName(g?.name )})) as Genius[];
            
            // Emitimos el nuevo estado al observable
            this.filteredGeniuses$.next(this.allGeniusesByCategory);


            return this.allGeniusesByCategory;
          })
        );
      }),
      catchError(err => {
        console.error('Error al cargar los datos de los genios:', err);
        return of(this.allGeniusesByCategory);
      })
    ).subscribe();
  }

  getFilteredGeniuses(): Observable<GeniusesCategory> {
    return this.filteredGeniuses$.asObservable();
  }

  private normalizeName(name: string): string {
    return name
      .replace("Categoría:", "")     // Quita prefijos innecesarios
      .replace(/\(científica\)\s*/i, "")  // Quita "(científica)" y los posibles espacios al final
      .trim()                        // Quita espacios al inicio y final
  }
  
}
