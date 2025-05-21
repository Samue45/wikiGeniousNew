import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Genius } from '../models/Genius';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // Bases de las URL
  private baseURL ='https://es.wikipedia.org/w/api.php';

  
  constructor(private http: HttpClient) { }

// Endpoints del Servicio

//Método genérico para obtener los nombres de los genios según categoría
  getNamesByCategory(category: string, cmtype :string): Observable<Genius[]> {
    const params = new HttpParams()
      .set('action', 'query')
      .set('list', 'categorymembers')
      .set('cmtitle', category)
      .set('format', 'json')
      .set('cmtype', cmtype)
      .set('origin', '*');
      

    return this.http.get<any>(this.baseURL, { params }).pipe(
      map(response => {
        const categoryMembers = response?.query?.categorymembers;
        return Array.isArray(categoryMembers)
          ? categoryMembers.map(member => ({
              name: member.title,
              photoURL: null,
              summary : null,
              category : null
            }))
          : [];
      }),
      catchError(err => {
        console.error(`Error al obtener los nombres de la categoría ${category}:`, err);
        return of([]);
      })
    );
  }

//Métodos específicos para cada categoría
  getNamesMathGenius(): Observable<Genius[]> {
    return this.getNamesByCategory('Category:Categorías de matemáticos', 'subcat');
  }

  getNamesPhysicGenius(): Observable<Genius[]> {
    return this.getNamesByCategory('Category:Categorías de físicos', 'subcat');
  }

  getNamesInformaticGenius(): Observable<Genius[]> {
    return this.getNamesByCategory('Category:Pioneras de la informática', 'page');
  }

  getNamesPhilosophersGenius(): Observable<Genius[]> {
    return this.getNamesByCategory('Category:Filósofas', 'page');
  }

  getNamesBiologistsGenius(): Observable<Genius[]> {
    return this.getNamesByCategory('Category:Biólogos', 'page');
  }

  getNamesBiochemicalsGenius(): Observable<Genius[]> {
    return this.getNamesByCategory('Category:Bioquímicos', 'page');
  }

  getNamesDeafScientistsGenius(): Observable<Genius[]> {
    return this.getNamesByCategory('Category:Científicos sordos', 'page');
  }

 public getAllGeniusesNames(): Observable<{
    math: Genius[];
    physic: Genius[];
    informatic: Genius[];
    philosophers: Genius[];
    biologists: Genius[];
    biochemicals: Genius[];
    deaf: Genius[];
  }> {
    return forkJoin({
      math: this.getNamesMathGenius(),
      physic: this.getNamesPhysicGenius(),
      informatic: this.getNamesInformaticGenius(),
      philosophers: this.getNamesPhilosophersGenius(),
      biologists: this.getNamesBiologistsGenius(),
      biochemicals: this.getNamesBiochemicalsGenius(),
      deaf: this.getNamesDeafScientistsGenius(),
    }).pipe(
      catchError(err => {
        console.error('Error al obtener los nombres de los genios:', err);
        return of({
          math: [],
          physic: [],
          informatic: [],
          philosophers: [],
          biologists: [],
          biochemicals: [],
          deaf: []
        });
      })
    );
  }

  getImage(name: string) : Observable<string | null> {
  //Se limpia el nombre de genios sustituyendo los espacios por _
  const title = this.normalizeName(name);

  // Parámetros esenciales de la URL
  const params = new HttpParams()
  .set('action', 'query')
  .set('format', 'json')
  .set('origin', '*')
  .set('titles', title)
  .set('prop', 'pageimages')
  .set('pithumbsize', '400'); // tamaño de la imagen en px

  //Tratamos el Observable
  return this.http.get<any>(this.baseURL,{ params }).pipe(
    map(response => {
      const pages = response?.query?.pages;
      const page = pages[Object.keys(pages)[0]];
      console.log('Página encontrada:', page); // 👈 Agregar un log
      return page?.thumbnail?.source || null;

    }),
    catchError(err => {
      console.error('Error al obtener la imagen del genio:', err);
      return of(null);
    })
  );
  }

  getSummary(name :string) : Observable<string | null> {

    // Parámetros esenciales de la URL
    const params = new HttpParams()
    .set('action', 'query')
    .set('format', 'json')
    .set('prop', 'extracts')
    .set('exintro', 'true')       // solo el primer párrafo
    .set('explaintext', 'true')   // sin HTML
    .set('titles', name)
    .set('origin', '*');

   // Petición HTTP
   return this.http.get<any>(this.baseURL, { params }).pipe(
     map(response => {
       const pages = response?.query?.pages;
       const page = pages[Object.keys(pages)[0]];
       return page?.extract || null;
     }),
     catchError(err => {
       console.error('Error al obtener el resumen del genio:', err);
       return of(null); // devolvemos null para que la app no se rompa
     })
   );
 }

// Métodos de apoyo
  obtenerValores(data: any, propiedad: string): string[] {
    const entityKey = Object.keys(data?.entities || {})[0];
    const claims = data?.entities?.[entityKey]?.claims?.[propiedad];
  
    if (!claims) return [];
  
    return claims.map((claim: any) => {
      const value = claim?.mainsnak?.datavalue?.value;
      return value?.id || value?.label || value?.name || value;
    }).filter((val: any) => typeof val === 'string');
  }

  obtenerValor(data: any, propiedad: string): string | null {
    const valores = this.obtenerValores(data, propiedad);
    return valores.length > 0 ? valores[0] : null;
  }
  normalizeName(name: string): string {
    return name
      .replace("Categoría:", "")     // Quita prefijos innecesarios
      .replace(/\(científica\)\s*/i, "")  // Quita "(científica)" y los posibles espacios al final
      .trim()                        // Quita espacios al inicio y final
      .normalize("NFD")              // Descompone letras acentuadas (é → e +  ́)
      .replace(/\s+/g, "_");         // Reemplaza todos los espacios por _
  }
 
}
