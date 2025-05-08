import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { DatosGenio } from '../models/datos-genio';





@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // Bases de las URL
  private baseURL ='https://es.wikipedia.org/w/api.php';
  // Array con genios
  private geniusData: { name: string, category: number, photoUrl: string | null }[] = [];

  
  constructor(private http: HttpClient) { }

  // Endpoints del Servicio

  getNamesMathGenious() : Observable<{ name: string; category: number }[]>{
    // URL completa
    //https://es.wikipedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:Categorías_de_matemáticos&format=json&cmtype=subcat

    // Parámetros esenciales de la URL
    const params = new HttpParams()
    .set('action', 'query')
    .set('list', 'categorymembers')
    .set('cmtitle', 'Category:Categorías_de_matemáticos')
    .set('format', 'json')
    .set('cmtype', 'subcat')
    .set('origin', '*');

    return this.http.get<any>(this.baseURL, { params }).pipe(
      map(response => {
      // Obtener la lista de miembros de la categoría (subcategorías de matemáticos)
      const categoryMembers = response?.query?.categorymembers;

      // categoryMembers es un array de objetos literales, dentro de ellos hay una key title
      // que contiene el nombre de cada matemático

      if(Array.isArray(categoryMembers)){
        return categoryMembers.map(member => ({
          name : member.title,
          category : 0
        }));
      }else{
        return [];
      }
  
      }),
      catchError(err => {
        console.error('Error al obtener los nombres de los matemáticos:', err);
        return of([]);
      })
    );

  }

  getNamesPhysicGenious() : Observable<{ name: string; category: number }[]>{

    // URL completa
    //https://es.wikipedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:Categor%C3%ADas_de_f%C3%ADsicos&format=json&cmtype=subcat
  
    // Parámetros esenciales de la URL
    const params = new HttpParams()
    .set('action', 'query')
    .set('list', 'categorymembers')
    .set('cmtitle', 'Category:Categorías_de_físicos')
    .set('format', 'json')
    .set('cmtype', 'subcat')
    .set('origin', '*');

    return this.http.get<any>(this.baseURL, { params }).pipe(
    map(response => {
    // Obtener la lista de miembros de la categoría (subcategorías de físicos)
    const categoryMembers = response?.query?.categorymembers;

    // categoryMembers es un array de objetos literales, dentro de ellos hay una key title
    // que contiene el nombre de cada físico

    if(Array.isArray(categoryMembers)){
      return categoryMembers.map(member => ({
        name : member.title,
        category : 1
      }));
    }else{
      return [];
    }

    }),
    catchError(err => {
      console.error('Error al obtener los nombres de los físicos:', err);
      return of([]);
    })
    );
  }

  getNamesInformaticGenious() : Observable<{ name: string; category: number }[]>{

    // URL completa
    //https://es.wikipedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:Pioneras_de_la_inform%C3%A1tica&format=json


    // Parámetros esenciales de la URL
    const params = new HttpParams()
    .set('action', 'query')
    .set('list', 'categorymembers')
    .set('cmtitle', 'Category:Pioneras_de_la_informática')
    .set('format', 'json')
    .set('origin', '*');

    return this.http.get<any>(this.baseURL, { params }).pipe(
    map(response => {
    // Obtener la lista de miembros de la categoría (subcategorías de informáticas)
    const categoryMembers = response?.query?.categorymembers;

    // categoryMembers es un array de objetos literales, dentro de ellos hay una key title
    // que contiene el nombre de cada informática

    if(Array.isArray(categoryMembers)){
      return categoryMembers.map(member => ({
        name : member.title,
        category : 2
      }));
    }else{
      return [];
    }

    }),
    catchError(err => {
      console.error('Error al obtener los nombres de las informáticas:', err);
      return of([]);
    })
    );
  }


  getImageAndData(name: string) : Observable<{
      image : string | null,
      data : DatosGenio | null // DatosGenio es una interfaz que contiene todos los datos que se quieren del genio
    }> {
    //Se limpia el nombre de genios sustituyendo los espacios por _
    const title = encodeURIComponent(name);

    // Parámetros esenciales de la URL
    const params = new HttpParams()
    .set('action', 'query')
    .set('format', 'json')
    .set('origin', '*')
    .set('titles', title)
    .set('prop', 'pageimages|pageprops')
    .set('pithumbsize', '400') // tamaño de la imagen en px
    .set('origin', '*');

    //Tratamos el Observable
    return this.http.get<any>(this.baseURL,{ params }).pipe(
      switchMap(response => {
        const pages = response?.query?.pages;
        const page = pages[Object.keys(pages)[0]];
        const image = page?.thumbnail?.source || null;
        const wikidataId = page?.pageprops?.wikibase_item;
  
        if (wikidataId) {
          return this.getIdGenious(wikidataId).pipe(
            map(data => ({ image, data }))
          );
        } else {
          return of({ image, data: null });
        }
      }),
      catchError(err => {
        console.error('Error al obtener datos del genio:', err);
        return of({ image: null, data: null });
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
    //Se limpia el nombre de genios sustituyendo los espacios por _
    const title = encodeURIComponent(name);

    // Parámetros esenciales de la URL
    const params = new HttpParams()
    .set('action', 'query')
    .set('format', 'json')
    .set('origin', '*')
    .set('prop', 'extracts')
    .set('exintro', 'true')       // solo el primer párrafo
    .set('explaintext', 'true')   // sin HTML
    .set('titles', title)
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


 getIdGenious(wikidataId : string) : Observable<DatosGenio | null> {

  //Parámetros esenciales de la URL
  const params = new HttpParams()
  .set('action', 'wbgetentities')
  .set('ids', wikidataId) // ej: "Q937"
  .set('format', 'json')
  .set('languages', 'es')
  .set('props', 'claims')
  .set('origin', '*');

  //Petición HTTP
  return this.http.get<any>(this.baseURL, { params }).pipe(
    map(data => {
      return {
        works: this.obtenerValores(data, 'P106'),
        studies: this.obtenerValores(data, 'P69'),
        achievements: this.obtenerValores(data, 'P166'),
        birthday: this.obtenerValor(data, 'P569'),
        country: this.obtenerValor(data, 'P19')
      };
    }),
    catchError(err => {
      console.error('Error al obtener la información extra del genio por su ID:', err);
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
