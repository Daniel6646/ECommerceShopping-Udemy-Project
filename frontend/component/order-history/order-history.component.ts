import { Component, OnInit } from '@angular/core';
import { OrderHistory } from 'src/app/common/order-history';
import { OrderHistoryService } from 'src/app/services/order-history.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orderHistoryList :OrderHistory[] = [];//empty array to add data in this from rest api
  storage : Storage = sessionStorage; // ref to web browser session storage
  
  constructor(private orderHistoryService : OrderHistoryService) { }

  ngOnInit(): void {

    this.handleOrderHistory();
  }
 
 
  handleOrderHistory() {

   
    //read users email from browser storage
   const theEmail =  JSON.parse( this.storage.getItem('userEmail')! ) ; //stored in storage in loginstatus component now we retieve send to method then restapi and get info
  
    // retrieve data from service
    this.orderHistoryService.getOrderHistory(theEmail).subscribe (
      data => {

       this.orderHistoryList =  data._embedded.orders; //embedded is in interface in OrderHistory Service
      }
    );
    console.log("Inside handle order hisroty method user email::"+theEmail);
      console.log("Inside handle order hisroty method array content from rest api call::"+JSON.stringify(this.orderHistoryList));
  }







  
}
