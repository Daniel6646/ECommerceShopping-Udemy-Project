import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})


export class Luv2ShopFormService {

  private countriesUrl  ="https://localhost:9898/api/countries";//8080 prevs port
  private statesUrl  =  "https://localhost:9898/api/states";

//old api urls
//  private countriesUrl  ="http://localhost:8080/api/countries";
 // private statesUrl  =  "http://localhost:8080/api/states";


  //inject httpclient to make rest call
  constructor(private httpClient : HttpClient) { }


  getCreditCardMonths(startMonth : number) : Observable<number[]> {

    // build an array for month drop-down list
    let data : number[] = [];

    // start at current month and iterate till the end

    for(let theMonth = startMonth; theMonth <=12 ; theMonth++) {

      data.push(theMonth);

    }

    return of(data); // The of oprtr from rxjs will wrap a object as Observeable
    //in component we subscrive to get a async data.

  }


  getCreditCarYears() : Observable<number[]> {

    // build an array  
    let data : number[] = [];

    // start at current year and loop for next 10 years


    const startYear : number = new Date().getFullYear(); // get current year
    const endYear : number = startYear + 10;

    for(let theYear = startYear; theYear <= endYear; theYear++) {

      data.push(theYear);

    }

    return of(data); 
    // of operator from rxjs will wrap the object as observable
  }


  getCountries() : Observable<Country[]> {

    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
  
    );

  // return httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
  //   map(response => response._embedded.countries)

  // );
}


getStates(theCountryCode: string): Observable<State[]> {

  // search url
  const searchStatesUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;

  return this.httpClient.get<GetResponseStates>(searchStatesUrl).pipe(
    map(response => response._embedded.states)
  );
}  


}

interface GetResponseCountries {

_embedded : {
countries : Country[];

  }
}

interface GetResponseStates {
  _embedded: {
    states: State[];
  }
}