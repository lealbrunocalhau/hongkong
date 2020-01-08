import { Injectable } from '@angular/core';
import { Dish } from '../shared/dish';
// import { DISHES } from '../shared/dishes';
import { of, Observable } from 'rxjs';
// import { delay } from "rxjs/operators";

import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';

import { ProcessHTTPMsgService } from './process-httpmsg.service';

@Injectable({
  providedIn: 'root'
})
export class DishService {

  constructor(
    private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService) { }

  getDishes(): Observable<Dish[]> {
    return this.http.get<Dish[]>(baseURL + 'dishes')
      // adicionando tratamento para pegar o erro caso exista no HTTP GET
    .pipe(catchError(this.processHTTPMsgService.handleError));
    // return of(DISHES).pipe(delay(2000));
    //    return of(DISHES).pipe(delay(2000)).toPromise();
    // return Promise.resolve(DISHES);

    // return new Promise(resolve => {
    //   setTimeout(() => resolve(DISHES), 2000);
    // });
  }

  getDish(id: string): Observable<Dish> {
    return this.http.get<Dish>(baseURL + 'dishes/' + id)
    .pipe(catchError(this.processHTTPMsgService.handleError));
    // return of(DISHES.filter((dish) => (dish.id === id))[0]).pipe(delay(2000));
    // return of(DISHES.filter((dish) => (dish.id === id))[0]).pipe(delay(2000)).toPromise();
    // return Promise.resolve(DISHES.filter((dish) => (dish.id === id))[0]);

    // return new Promise(resolve => {
    //   setTimeout(() => resolve(DISHES.filter((dish) => (dish.id === id))[0]), 2000);
    // });
  }

  getFeatureDish(): Observable<Dish> {
     return this.http.get<Dish[]>(baseURL + 'dishes?featured=true')
    .pipe(map(dishes => dishes[0]))
    .pipe(catchError(this.processHTTPMsgService.handleError));
    // Esse map acima transforma um array de dishes em unico dish

    // return of(DISHES.filter((dish) => dish.featured)[0]).pipe(delay(2000));
    // return of(DISHES.filter((dish) => dish.featured)[0]).pipe(delay(2000)).toPromise();
    // return Promise.resolve(DISHES.filter((dish) => dish.featured)[0]);

    // return new Promise(resolve =>{
    //   setTimeout(() => resolve(DISHES.filter((dish) => dish.featured)[0]), 2000);
    // });
  }

  getDishIds(): Observable<number[] | any> {
    return this.getDishes()
    .pipe(map(dishes => dishes.map(dish => dish.id)))
    .pipe(catchError(error => error));
    // return of(DISHES.map(dish=> dish.id));
  }

  putDish(dish: Dish): Observable<Dish> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.put<Dish>(baseURL + 'dishes/' + dish.id, dish, httpOptions)
            .pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
