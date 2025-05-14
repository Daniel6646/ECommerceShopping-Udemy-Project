import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Product } from '../common/product';
import { response } from 'express';
import { ProductCategory } from '../common/product-category';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {







 // private baseUrl = "http://localhost:8080/api/products";
 private baseUrl = environment.luv2shopApiUrl+'/products';

  
 private categoryUrl =  environment.luv2shopApiUrl+ '/product-category';  
 // private categoryUrl = "http://localhost:8080/api/product-category";
  //  private baseUrl = "http://localhost:8080/api/products?size=100";  will show 100 products on the same screen.


  constructor(private httpclient: HttpClient) { }


  getProductList(theCategoryId: number): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`

    return this.getProducts(searchUrl);

  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpclient.get<GetresponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  searchProducts(theKeyword: string): Observable<Product[]> {

    // build url based on keyword
    //http://localhost:8080/api/products/search/findByNameContaining?name=Python
    //using same url we get api on chrome but depending on what user searches like above we search for python or user can add java, angular etc

    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`

    return this.getProducts(searchUrl);

  }


  getproductCategories(): Observable<ProductCategory[]> {

    return this.httpclient.get<GetresponseProductsCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );

  }


  getProduct(theProductId: number): Observable<Product> {

    // need to build url based on product id
    console.log("get product methhod for details" + theProductId);
    const productUrl = `${this.baseUrl}/${theProductId}`;
    // localhost:8080/api/products/1

    return this.httpclient.get<Product>(productUrl);
  }


  getProductListPaginate(thePage: number,
    thePageSize: number, theCategoryId: number): Observable<GetresponseProducts> {

    // to build url based on category id, page and page size  
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
      + `&page=${thePage}&size=${thePageSize}`;
      console.log("Getting products from link::   "+searchUrl);

    return this.httpclient.get<GetresponseProducts>(searchUrl);

  }


  searchProductListPaginate(thePage: number,
      thePageSize: number, 
      theKeyword: string): Observable<GetresponseProducts> {

    // to build url based on keyword, page and page size  
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
      + `&page=${thePage}&size=${thePageSize}`;
    return this.httpclient.get<GetresponseProducts>(searchUrl);

        //call to above api as spring rest supports pagination

  }

}

interface GetresponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number;
    totalElements: number;
    totalPages: number,
    number: number;

  }

}

interface GetresponseProductsCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }

}