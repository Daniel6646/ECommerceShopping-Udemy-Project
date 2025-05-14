import { Component, OnInit } from '@angular/core';
import { ProductCategory } from '../../common/product-category';
import { ProductService } from '../../services/product.service';
import { json } from 'stream/consumers';

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrl: './product-category-menu.component.css'
})
export class ProductCategoryMenuComponent  implements OnInit {


  productCategories : ProductCategory[] = [];

  constructor(private productService : ProductService) {}
 
  ngOnInit(): void {

    this.listProductCategories();
  }

  listProductCategories() {

  this.productService.getproductCategories().subscribe(  
  data => {

      console.log("Product Categories array data  jsonstringify"+data);
      this.productCategories = data;
      console.log("stringify productCategories array"+this.productCategories);
    });

  }


}
