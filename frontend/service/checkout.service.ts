import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../common/purchase';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaymentInfo } from '../common/payment-info';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(private httpClient : HttpClient) { }

  //private purchaseUrl = "http://localhost:8080/api/checkout/purchase";
// private purchaseUrl = environment.luv2shopApiUrl + '/checkout/purchase';
  private purchaseUrl =  "https://localhost:9898/api/checkout/purchase";

  private paymentIntentUrl = environment.luv2shopApiUrl + '/checkout/payment-intent';


  placeOrder(purchase : Purchase) : Observable<any> {

    console.log("INSIDE placeorder trying to save cart data")
    console.log("purchase api url"+this.purchaseUrl);
    return this.httpClient.post<Purchase>(this.purchaseUrl,purchase);

  }

  //rest api call strpie module for payment processing 
  createPaymentIntent(paymentInfo: PaymentInfo): Observable<any> {
    return this.httpClient.post<PaymentInfo>(this.paymentIntentUrl, paymentInfo);
  }



}
