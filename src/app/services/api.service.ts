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
  
  constructor(private http: HttpClient) { }

  // Endpoints del Servicio
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
    .set('pithumbsize', '400'); // tamaño de la imagen en px

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
  const title = encodeURIComponent(name);

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
      return page?.thumbnail?.source || null;

    }),
    catchError(err => {
      console.error('Error al obtener la imagen del genio:', err);
      return of(null);
    })
  );
}

  getAllGeniousByCategory(category : string) : Observable<string[]> {
    // Se limpia el nombre de genios sustituyendo los espacios por _
    const categoryClean = `Categoría:${encodeURIComponent(category)}`;

    // Construcción de los parámetros con HttpParams
    const params = new HttpParams()
    .set('action', 'query')
    .set('list', 'categorymembers')
    .set('cmtitle', categoryClean)
    .set('cmlimit', '50') // puedes ajustar el límite si quieres más resultados
    .set('format', 'json')
    .set('origin', '*');


    // Petición HTTP
    return this.http.get<any>(this.baseURL, { params }).pipe(
      map(response => {
        const members = response?.query?.categorymembers;
        return members?.map((item: any) => item.title) || [];
      }),
      catchError(err => {
        console.error('Error al obtener a los genios por su categoría:', err);
        return of([]); // los array vacíos son más fácil de manejar con componentes
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
    .set('titles', title);

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

 // Debería ser un método privado
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
        ocupacion: this.obtenerValores(data, 'P106'),
        educacion: this.obtenerValores(data, 'P69'),
        premios: this.obtenerValores(data, 'P166'),
        nacimiento: this.obtenerValor(data, 'P569'),
        lugarNacimiento: this.obtenerValor(data, 'P19')
      };
    }),
    catchError(err => {
      console.error('Error al obtener la información extra del genio por su ID:', err);
      return of(null); // devolvemos null para que la app no se rompa
    })
  );

  }

 // Deberian ser métodos privados
  // Métodos creados por ChatGPT
  // Se encargan de obtener los valores asociado a cada key que hay dentro de un ID
  // Ejemplo : ocupation,education,premios,nacimiento, lugarNacimiento.
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
 
}
