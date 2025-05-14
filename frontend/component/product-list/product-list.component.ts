import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { BrowserModule } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../common/cart-item';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule,RouterModule,NgbModule],
  templateUrl: './product-list-grid.component.html',
  //templateUrl: './product-list-table.component.html',
  //templateUrl: './product-list.component.html',

  styleUrl: './product-list.component.css'
})


export class ProductListComponent implements OnInit {

  searchMode : boolean = false;
  products: Product[] = [];
    currentCategoryId: number = 1;
    previousCategoryId: number = 1;


  // new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5; //defaull pagesize [no of products in a page
  theTotalElements: number = 0;

  previousKeyword : string = "";



  constructor(private productservice: ProductService,
    private route: ActivatedRoute, private cartService : CartService) { }

  ngOnInit(): void {
    //ngOnInit is a lifecycle hook in Angular that is called after the constructor is called and after the component's inputs have been initialized. It is used to perform any additional initialization that is required for the component. ngOnInit is commonly used to call services or to set up subscriptions.
    this.route.paramMap.subscribe(() => {
      this.listProducts();

    });
  }


  listProducts() {

    // to check route has a paramter/value for keyword.
    //if it has keyword paramter we are trying to perform search oprtn/ or searching for a product
    this.searchMode =  this.route.snapshot.paramMap.has('keyword');
    //{path : 'search/:keyword', component : ProductListComponent }
    // will be passed to doSearch methid on SearchCompononent

    if(this.searchMode) {

      this.handleSearchProduct();
      //if keyword has search tjen search oprtn

    }

  else {

    this.handleListProducts();
    // if keyword not search then normal product listing operation
  }




  }


  handleListProducts() {



    // check if id parameter is available

    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    // route - activatedroute used in constructor abv, snapshot - state of route at given moment, parammap - most of route parameters, .has - read the id parameter

    // get the "id" param string. convert string to a number using  "+" symbol
    if (hasCategoryId) {

      // note of ! this is not null assertion operator, tells compiler object is not null, if not used shows error object is possibly null
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;  

    }

    else {

      //category id not available, retrun default category id 1
      this.currentCategoryId = 1;

    }


    //check if we have different category than previous
    // angular will re use a component if its currently being used

    // if we have different category id than previous
    // then set page number to 1

    if(this.previousCategoryId != this.currentCategoryId) {

      this.thePageNumber = 1;

    }

    console.log("previousCategoryId"+this.previousCategoryId);
    console.log("currentCategoryId"+this.currentCategoryId);
    this.previousCategoryId = this.currentCategoryId;



    //now get products for the given categoryid
//     this.productservice.getProductList(this.currentCategoryId).subscribe(
//       data => {
//         this.products = data;
// console.log("data"+data);
//       }
//     )
    


//pagenumber-1 reason:
//pagination component in angular are 1 based
//spring dqta rest pagntn cmpn are 0 based
// so we decrement by 1 to match data received by spring rest

    this.productservice.getProductListPaginate(
      this.thePageNumber -1,
      this.thePageSize, 
      this.currentCategoryId).subscribe(

        data => {
        this.products =  data._embedded.products;
        this.thePageNumber =  data.page.number +1 ; //pagnt in  spring 0 based, angular 1 based hence 0+1
        this.thePageSize =  data.page.size;
         this.theTotalElements = data.page.totalElements;
         //left hand size props defined in classs
         //right side data from spring data rest

         //page: {
          // "size" : "20",
          // "totalElements" : "100",
          // "totalPages" : "5",
          // "number" : "0"
         } );

      }
     


      handleSearchProduct() {

        const theKeyword : string =  this.route.snapshot.paramMap.get('keyword')!;
    
        // if we have a different keyword than previous
        //then set pageNumber to 1

        if(this.previousKeyword != theKeyword) {
        
          this.thePageNumber = 1;

        }

        this.previousKeyword != theKeyword;
        console.log("previouskeyword"+this.previousKeyword, "thekeyword"+theKeyword);

        //now search the product using keyword
      this.productservice.searchProductListPaginate(this.thePageNumber -1,
                                                      this.thePageSize,
                                                      theKeyword).subscribe(this.processResult()); 
    
      }


      updatePageSize(pageSize : string) {
    //initialize local variable to instance/global variable to add products in pagination
        this.thePageSize =+ pageSize;
        this.thePageNumber = 1;
        this.listProducts();
      }






      processResult() {

        return (data : any) => {

      this.products =  data._embedded.products;
      this.thePageNumber =  data.page.number +1;
      this.thePageSize = data.page.size;
      this.theTotalElements =   data.page.totalElements;
       
        }
      }



      addToCart (theProduct : Product) {

        console.log("addtocart product ::product name"+theProduct.name);
        console.log("add to cart product price:: "+theProduct.unitPrice );
        console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);

    const theCartItem = new CartItem(theProduct);
        this.cartService.addToCart(theCartItem);

      }



  }


 



  






