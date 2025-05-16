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

  constructor(private apiService: ApiService) {
    this.getAllGeniuses();
  }

  // Lista para guardar todos los genios solicitados a la API de MediaWiki
  private allGeniusesByCategory: GeniusesCategory = {
    [Category.Math]: [],
    [Category.Physic]: [],
    [Category.Informatic]: [],
    [Category.Philosophers]: [],
    [Category.Biologists]: [],
    [Category.Biochemicals]: [],
    [Category.Deaf]: []
  };

  private filteredGeniuses$: BehaviorSubject<GeniusesCategory> = new BehaviorSubject<GeniusesCategory>({
    [Category.Math]: [],
    [Category.Physic]: [],
    [Category.Informatic]: [],
    [Category.Philosophers]: [],
    [Category.Biologists]: [],
    [Category.Biochemicals]: [],
    [Category.Deaf]: []
  });
  
  // Llama automáticamente a la API si no se ha cargado nada aún
  getAllGeniuses(): void {
    if (!this.isDataLoaded()) {
      this.loadAllGeniuses();
    }
  }

  private isDataLoaded(): boolean {
    // True si al menos una lista de genios tiene elementos
    return Object.values(this.allGeniusesByCategory)
      .some(categoryList => categoryList.length > 0);
  }

  // Carga todas las categorías de genios y guarda en allGeniusesByCategory
  public loadAllGeniuses(): void {
    this.apiService.getAllGeniusesNames().pipe(
      // 1) Recibe un objeto con arrays por categoría
      switchMap(({ math, physic, informatic, philosophers, biologists, biochemicals, deaf }) => {
        // 2) Combina todos los nombres en un solo array con categoría
       const tasks = [
        ...math.map(g => ({ name: g.name, category: Category.Math })),
        ...physic.map(g => ({ name: g.name, category: Category.Physic })),
        ...informatic.map(g => ({ name: g.name, category: Category.Informatic })),
        ...philosophers.map(g => ({ name: g.name, category: Category.Philosophers })),
        ...biologists.map(g => ({ name: g.name, category: Category.Biologists })),
        ...biochemicals.map(g => ({ name: g.name, category: Category.Biochemicals })),
        ...deaf.map(g => ({ name: g.name, category: Category.Deaf })),
       ];

        // 3) Para cada genio, fetch de imagen y resumen en paralelo
        const detailCalls = tasks.map(item =>
          forkJoin({
            photoURL: this.apiService.getImage(item.name ),
            summary: this.apiService.getSummary(item.name)
          }).pipe(
            map(({ photoURL, summary }) => ({
              name: this.normalizeName(item.name),
              photoURL,
              summary,
              category: item.category
            } as Genius))
          )
        );

        // 4) Espera a todas las llamadas de detalle
        return forkJoin(detailCalls);
      }),
      // 5) Agrupa por categoría
      map((allGeniuses: Genius[]) => {
        const byCat: GeniusesCategory = {
          [Category.Math]: [],
          [Category.Physic]: [],
          [Category.Informatic]: [],
          [Category.Philosophers]: [],
          [Category.Biologists]: [],
          [Category.Biochemicals]: [],
          [Category.Deaf]: []
        };

        allGeniuses
          // filtra solo objetos con categoría válida
          .filter((g): g is Genius & { category: Category } => g.category != null)
          .forEach(g => byCat[g.category].push(g));

        return byCat;
      }),
      // 6) Actualiza subject y caché interno
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
          [Category.Informatic]: [],
          [Category.Philosophers]: [],
          [Category.Biologists]: [],
          [Category.Biochemicals]: [],
          [Category.Deaf]: []
        };
        this.filteredGeniuses$.next(empty);
        return of(empty);
      })
    ).subscribe();
  }

  // Devuelve observable con categorías filtradas
  getFilteredGeniuses(): Observable<GeniusesCategory> {
    return this.filteredGeniuses$.asObservable();
  }

  // Normaliza el nombre quitando prefijos y sufijos
  private normalizeName(name: string): string {
    return name
      .replace(/^Categoría:/i, '')
      .replace(/\(científica\)/i, '')
      .trim();
  }
}
