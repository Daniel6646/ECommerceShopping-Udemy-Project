import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  constructor(private httpClient : HttpClient) { }

  //private orderUrl  = "http://localhost:8080/api/orders"; //to get customers ny email, more modfctn below
  private orderUrl  = "https://localhost:9898/api/orders";
 // private purchaseUrl =  "https://localhost:9898/api/checkout/purchase";



  getOrderHistory(theEmail : string) : Observable<GetResponseOrderHistory> {

    // need to build url for customer email
   const orderHistoryUrl = `${this.orderUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${theEmail}`;
    console.log("getOrderHistory in orderhstry.service orderhistoryurl::  "+orderHistoryUrl);
   //rest api call to get a customers order by unique emails
    return this.httpClient.get<GetResponseOrderHistory>(orderHistoryUrl); 

  }



}


interface GetResponseOrderHistory {

// Unwraps the JSON fron Spring data rest _embedded entry
//_embedd because while we acess a rest api in browser using link data starts with _embedded  
  _embedded : {
    orders : OrderHistory [];
  }

}