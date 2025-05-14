import { Product } from "./product";

export class CartItem {

    id : string; // id : string in tutorial  lec 125 timestamp : 2.21
    name : string;
    imageUrl : string;
    unitPrice : number ;
    quantity : number;

    constructor(product : Product) {

        this.id = product.id;
        this.name = product.name;
        this.imageUrl = product.imageUrl;
        this.unitPrice = product.unitPrice;
        this.quantity = 1;
    }
    
}
