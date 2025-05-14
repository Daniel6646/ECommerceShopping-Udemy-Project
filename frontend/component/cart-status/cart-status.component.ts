import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrl: './cart-status.component.css'
})
export class CartStatusComponent implements OnInit {
  
  totalPrice : number = 0.00;
  totalQuantity : number = 0; 
  

  constructor(private cartService : CartService) {}

  ngOnInit(): void {

    this.updateCartStatus();

  }

  updateCartStatus() {

    // subscribe to cart totalprice
    this.cartService.totalPrice.subscribe(
   // this.totalPrice.next(totalPriceValue); in cartService.ts line no71 and 72

      data =>
      this.totalPrice = data //when new events are recvd, make assingment to update UI
    );



    //  subscribe to cart totalprice
    this.cartService.totalQuantity.subscribe(
    //this.totalQuantity.next(totalQuantityValue); in cartService.ts line no71 and 72

      data =>
      this.totalQuantity = data //when new events are recvd, make assingment to update UI
    );

  }

}


