import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';
import { Session } from 'inspector';

@Injectable({
  providedIn: 'root'
})
export class CartService {
 


  cartItems : CartItem [] = [];

  totalPrice : Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity : Subject<number> = new BehaviorSubject<number>(0);
//changed from subject to behaviorusubject to get all recent changes to calculate cart total
//0 is the initial value here


  // Subject is a subclass of observables
  // we can use observables to publish event in our code
  //Event will be sent to all of subscribers
//  storage : Storage = sessionStorage;
  //reference to web browser session storage
  storage : Storage = localStorage; //data is persisted/stored/saved in local strge & survives browser refresh


  constructor() { 

    //read data from storage
    let data = JSON.parse(this.storage.getItem('cartItems')); //cartitems is the key here
    //json.parse reads json string and converts to object 
   
    if(data !=null) {
   
      this.cartItems = data;
    }
   
    this.computeCartTotal();

     }


  addToCart(theCartItem : CartItem) {


   

  //compute total based on data that is read from storage
    this.computeCartTotal();

    // check if we already have item in our cart
    let alreadyExistsInCart : boolean = false;
    let exisitngCartItem : CartItem = undefined;

    if(this.cartItems.length > 0) {
    //find item in our cart based on item id

    for( let tempCartItem of this.cartItems) {
        if(tempCartItem.id === theCartItem.id) {
          exisitngCartItem =  tempCartItem;
          break;
        }
    }

        //check if we found that item
      alreadyExistsInCart = (exisitngCartItem != undefined);
    }


    if(alreadyExistsInCart) {

      exisitngCartItem.quantity++;

    }

    else {

      this.cartItems.push(theCartItem);
    }


    //compute cart total cost and total quantity
    this.computeCartTotal();

  }

  computeCartTotal() {

    let totalPriceValue :number = 0;
    let totalQuantityValue : number = 0;

    for(let currentCartItem of this.cartItems) {

     totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue+= currentCartItem.quantity;
    }

    // publish new values... all subscribers will receive new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
//. next will publish or send event which will be received through subscribe

    console.log("totalPriceValue::"+totalPriceValue,"totalQuantityValue" +totalQuantityValue);

    this.logCartData(totalPriceValue,totalQuantityValue);


    //persist cart data, use storage and to store/save items in cart even on refresh
    this.persistCartItems();
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {

    console.log('Contents of the cart');
    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`);
    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log('----');
  }


  decrementQuantity(theCartItem: CartItem) {

    theCartItem.quantity--;

    if( theCartItem.quantity ===0 ) {

      this.remove(theCartItem);

    }  

    else{

      this.computeCartTotal();
    }

  }


  remove(theCartItem: CartItem) {

    //get index of the item in the array
     const itemIndex=  this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id );
    
     //if found remove item from the array from given index
    if(itemIndex > -1) {

      this.cartItems.splice(itemIndex,1); // to simply splice/remove one element from array
    }

    this.computeCartTotal();

  }



  persistCartItems() {

    //setitems take key and value pair, stringify converts object to json string
    this.storage.setItem('cartItems',JSON.stringify(this.cartItems));
  }



}


