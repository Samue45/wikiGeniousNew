import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Genius } from '../models/Genius';
import { Category } from '../models/category';
import { GeniusesCategory } from '../models/Geniuses-category';
import { Observable, of, BehaviorSubject, forkJoin } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';


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
  public loadAllGeniuses(): void {
    this.apiService.getAllGeniusesNames().pipe(
      // 1) Recibo { math, physic, informatic } con arrays de Genius (nombre + huecos)
      switchMap(({ math, physic, informatic }) => {
        // 2) Creo un array unificado con nombre y categoría
        const tasks = [
          ...math.map(g => ({ name: g.name, category: Category.Math })),
          ...physic.map(g => ({ name: g.name, category: Category.Physic })),
          ...informatic.map(g => ({ name: g.name, category: Category.Informatic })),
        ];

        // 3) Por cada uno, disparo en paralelo image + summary
        const detailCalls = tasks.map(item =>
          forkJoin({
            photoURL: this.apiService.getImage(item.name),
            summary:  this.apiService.getSummary(item.name)
          }).pipe(
            map(({ photoURL, summary }) => ({
              name: this.normalizeName(item.name),
              photoURL,
              summary,
              category: item.category
            } as Genius))
          )
        );

        // 4) Espero a que todos los detailCalls terminen
        return forkJoin(detailCalls);
      }),
      // 5) Agrupo el array resultante por categoría
      map((allGeniuses: Genius[]) => {
        const byCat: GeniusesCategory = {
          [Category.Math]: [],
          [Category.Physic]: [],
          [Category.Informatic]: []
        };
        // 1) Elimino cualquier Genius con category null
        const valid = allGeniuses.filter((g): g is Genius & { category: Category } =>
          g.category !== null
        );
        valid.forEach(g => {
          byCat[g.category].push(g);
        });
        return byCat;
      }),
      // 6) Emito efecto secundario en mi BehaviorSubject
      tap(byCat => {
        this.allGeniusesByCategory = byCat;
        this.filteredGeniuses$.next(byCat);
      }),
      // 7) Manejo de errores
      catchError(err => {
        console.error('Error al cargar genios:', err);
        const empty: GeniusesCategory = {
          [Category.Math]: [],
          [Category.Physic]: [],
          [Category.Informatic]: []
        };
        this.filteredGeniuses$.next(empty);
        return of(empty);
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
