import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Luv2ShopFormService } from '../../services/luv2-shop-form.service';
import { json } from 'stream/consumers';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { Luv2ShopValidators } from '../../validators/luv2-shop-validators';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { Router } from '@angular/router';
import { Order } from '../../common/order';
import { OrderItem } from '../../common/order-item';
import { Purchase } from '../../common/purchase';
import { error } from 'console';
import { environment } from 'src/environments/environment';
import { PaymentInfo } from 'src/app/common/payment-info';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
 

  countries : Country[] = [];

  checkOutFormGroup : FormGroup;

  totalPrice : number = 0;
  totalQuantity : number = 0;
  
  creditCardYears : number [] = [];
  creditCardMonths : number[] = [];

  shippingAddressStates : State[] = [];
  billingAddressStates : State[] = [];

  storage : Storage = sessionStorage;

    // initialize Stripe API
    stripe = Stripe(environment.stripePublishableKey);

    paymentInfo: PaymentInfo = new PaymentInfo();
    cardElement: any;
    displayError: any = "";

  customer = { firstName: '', lastName: '', email: '' };
  address = { street: '', city: '', state: '', country: '', zipCode: '' }
  creditCard = { cardType: '', nameOnCard: '', cardNumber: '', securityCode: '', expirationMonth: '', expirationYear: '' }

  isDisabled: boolean = false;

  
 constructor(private formBuilder : FormBuilder,
              private luv2ShopFormService : Luv2ShopFormService,
              private cartService : CartService,
              private checkOutService : CheckoutService,
              private router : Router
              ) {} 

//The FormBuilder is the helper API to build forms in Angular. It provides shortcuts to create the instance of the FormControl, FormGroup or FormArray. It reduces the code required to write complex forms.
//To inject a dependency in a component's constructor(), supply a constructor argument with the dependency type.
//The class should not be needed to annotate with @Injectable
//Marking a class with @Injectable ensures that the compiler will generate the necessary metadata to create the class's dependencies when the class is injected.

  ngOnInit(): void {

     // setup Stripe payment form
     this.setupStripePaymentForm();

    this.reviewCartDetails();

    //read users email from storage
    const theEmail = JSON.parse(this.storage.getItem('userEmail')!); // and populate it down below '' replaced with theEmail variable

    this.checkOutFormGroup = this.formBuilder.group({

      customer : this.formBuilder.group({
        firstName : new FormControl('', [Validators.required,
                                        Validators.minLength(2), 
                                        Luv2ShopValidators.notOnlyWhiteSpace, 
                                        Luv2ShopValidators.characterThenSpacesValidation ]), //set value as empty using ''


        lastName : new FormControl('',[Validators.required,
                                      Validators.minLength(2),
                                      Luv2ShopValidators.notOnlyWhiteSpace, 
                                      Luv2ShopValidators.characterThenSpacesValidation]),

        email :  new FormControl(theEmail,
                                    [Validators.required,
                                    Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
//^[a-z0-9._%+-]+ match any combo of letter & digit, optional period
// @ sepratting email address prtn like @ in eg: anil.public@gmail.com
//[a-z0-9.-]+\\ mtch any combo of letter & digits with period like gmail. or yahoo.
// [a-z]{2,4}$ domain extns like .com
}),

      shippingAddress : this.formBuilder.group({

        street : new FormControl('',
        [Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhiteSpace, 
          Luv2ShopValidators.characterThenSpacesValidation]),
       
          city : new FormControl('',
         [Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhiteSpace, 
          Luv2ShopValidators.characterThenSpacesValidation]),
       
          state :  new FormControl('',
          [Validators.required]),
        
        country : new FormControl('',
        [Validators.required]),
       
        zipCode :new FormControl('',
        [Validators.required,
         Validators.minLength(2),
         Luv2ShopValidators.notOnlyWhiteSpace, 
         Luv2ShopValidators.characterThenSpacesValidation])

      }),

      billingAddress : this.formBuilder.group({

        street : new FormControl('',
        [Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhiteSpace, 
          Luv2ShopValidators.characterThenSpacesValidation]),
       
        city : new FormControl('',
         [Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhiteSpace, 
          Luv2ShopValidators.characterThenSpacesValidation]),
       
        state :  new FormControl('',
          [Validators.required]),
        
        country : new FormControl('',
        [Validators.required]),
       
        zipCode :new FormControl('',
        [Validators.required,
         Validators.minLength(2),
         Luv2ShopValidators.notOnlyWhiteSpace, 
         Luv2ShopValidators.characterThenSpacesValidation])

      }),

      creditCard : this.formBuilder.group({
        /*
        
        
          cardType : new FormControl('',
        [Validators.required]),
       
        nameOnCard :  new FormControl('',
        [Validators.required,
         Validators.minLength(2),
         Luv2ShopValidators.notOnlyWhiteSpace, 
         Luv2ShopValidators.characterThenSpacesValidation]),
        
         cardNumber :new FormControl('',
        [Validators.required,
        Validators.pattern('[0-9]{16}')]),
        
        securityCode : new FormControl('',  [Validators.required,
        Validators.pattern('[0-9]{3}')]),


        expirationMonth : [''],
        expirationYear : ['']
        
        
        */
      })
    });

    //START ::populate credit card months 
    
  /*

  let  startMonth : number = new Date().getMonth() +1; // get credt card months
    console.log("startMonth"+startMonth);// +1 because its zero based it will show past month so +1 to get current month

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe (
      data => {

        console.log("Retrieved credit card months:::  "+JSON.stringify(data));
         this.creditCardMonths =  data;
      } );

  */  

    //END ::populate credit card months


    //START ::populate credit card Years
    /*

      this.luv2ShopFormService.getCreditCarYears().subscribe(

      data => {

        console.log("Retrieved credit card years"+ JSON.stringify(data));
        this.creditCardYears =  data;

      });


    */
    
    //END ::populate credit card Years

    //START populate countires for dropdown in checkout  [shipping-address, billing-address]
    
     this.luv2ShopFormService.getCountries().subscribe(

      data =>
      this.countries =  data

     );

   //END populate countires for dropdown in checkout  [shipping-address,billing address]

  }
 


// event called on Purchase button click
  onSubmit() {


    console.log("handling submit button");
    if(this.checkOutFormGroup.invalid) {
      this.checkOutFormGroup.markAllAsTouched(); //touching all fields trigger the display of error message
      return; //like break dont execute anything else in here
      console.log("inside checkoutformgroup if condition for invalid");
    }

    //set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;
    console.log("inside onsubmit order object"+order);

    //get cart items
    const cartItems = this.cartService.cartItems;
    console.log("inside onsubmit cartitems"+JSON.stringify(cartItems));

    //create orderitems from cartItems
   
    // let orderItems : OrderItem[] = [];
    // for(let i =0; i< cartItems.length; i ++) {

    //   orderItems[i] = new OrderItem(cartItems[i]);
    // }

    //short way of above code using map
    let orderItems : OrderItem[] = cartItems.map(tempCartItems => new OrderItem(tempCartItems));
    console.log("inside onsubmit orderItems"+JSON.stringify(orderItems));

 
    //set up purchase
    let purchase = new Purchase();

    //populate purchase - customer
    purchase.customer =  this.checkOutFormGroup.controls['customer'].value;

    //populate purchase - shipping address
    purchase.shippingAddress = this.checkOutFormGroup.controls['shippingAddress'].value;
    const shippingState : State =  JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry :Country =  JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;
    console.log("inside onsubmit purchase purchase.shippingAddress"+purchase);


    //populate purchase - billing address
    purchase.billingAddress = this.checkOutFormGroup.controls['billingAddress'].value;
    const billingState : State =  JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry :Country =  JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;
    console.log("inside onsubmit purchase purchase.billing"+purchase);


    //populate purchase - order and order items
    purchase.order = order;
    purchase.orderItems = orderItems;

    console.log("Purchase data object populated data:::::");
    console.log(JSON.stringify(purchase));


     // compute payment info, going from dollars to cents 1234$ like 12.34$
     this.paymentInfo.amount = Math.round(this.totalPrice * 100); 
     this.paymentInfo.currency = "USD";
     this.paymentInfo.receiptEmail = purchase.customer.email;// sending receiptEMAIL to stripe email address compo, to send email address


    console.log("PAYMENT AMOUNT ::" +this.paymentInfo.amount );

    // call restapi via checkout service START

    // this.checkOutService.placeOrder(purchase).subscribe ( {
      
    //   //sucess path
    //     next : response => {

    //       alert(`Your order has been received.Your tracking number is${response.orderTrackingNumber}`)
       
    //       //once order done reset cart
    //       this.resetCart();
       
    //     },      
    //     error : err => {
    //       alert(`There was an error ${err.message}`);

    //     }          //error path
    //   }
    // ); 

        // call restapi via checkout service END



    // if valid form then
    // - create payment intent
    // - confirm card payment
    // - place order
    
    //this if check if form is valid
    if (!this.checkOutFormGroup.invalid && this.displayError.textContent === "") {

      //keep purchase button enabled, so after purchase is done to avoid form re-submission
      this.isDisabled = true;

      // call to spring boot rest api
      this.checkOutService.createPaymentIntent(this.paymentInfo).subscribe(  
        (paymentIntentResponse) => {

          //method of stripe api sends credit card data directly to stripe.com servers
          this.stripe.confirmCardPayment(paymentIntentResponse.client_secret, 
            {
              payment_method: {
                card: this.cardElement, //ref stripe element component cardElement, sned credit card info to backend stripe servers
                
                billing_details: { //adding additional details to payment section
                  email: purchase.customer.email,
                  name: `${purchase.customer.firstName} ${purchase.customer.lastName}`,
                  address: {
                    line1: purchase.billingAddress.street,
                    city: purchase.billingAddress.city,
                    state: purchase.billingAddress.state,
                    postal_code: purchase.billingAddress.zipCode,
                    country: this.billingAddressCountry.value.code
                  }
                }
              
              }
            }, { handleActions: false } )
            //then once we get back rslt from stripe confirm card payment, then chck status if we have error msg or is it successfull
           
            .then((result: any) => {
              if (result.error) {
                
                // inform the customer there was an error
                alert(`There was an error: ${result.error.message}`);
                this.isDisabled = false; //disable purchase button if there is an error

              } else {
               
                // call REST API via the CheckoutService, place order in mysql database using spring boot api we used
                this.checkOutService.placeOrder(purchase).subscribe({
                  next: (response: any) => {
                    alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);
  
                    // reset cart
                    this.resetCart();
                    this.isDisabled = false; // order done no need to keep purchase button enabled to setting purchase btn false 

                  },
                  error: (err: any) => {
                    alert(`There was an error: ${err.message}`);
                    this.isDisabled = false; 
                  }
                })
              }            
            });
                
        }

      )


    }

    else {
      this.checkOutFormGroup.markAllAsTouched();
      return;
    }

  } // End of onSubmit method


  copyShippingAddressToBillingAddress(event){

// for checkbox ticket is billing address and shipping address are the same

    if(event.target.checked) {
      //if checked copy data of shipping to billing address
      this.checkOutFormGroup.controls['billingAddress'].
      setValue(this.checkOutFormGroup.controls['shippingAddress'].value);

      //bug fix on tick shipping adress country gets populated in biling but state doesnt
       this.billingAddressStates =  this.shippingAddressStates;
      // so now billingAddressStates array is not empty and values can be extracted.
    }

    else {

      //if not checked keep it emptyy
      this.checkOutFormGroup.controls['billingAddress'].reset();

      // so no data will be shown if copyshipngtobillng option not unticked in checkout page
      this.billingAddressStates = [];

    }


  }



  handleMonthsAndYears() {

    const creditCardFormGroup = this.checkOutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    // if the current year equals the selected year, then start with the current month

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }


  getStates(formGroupName : string) {

   let formGroup =  this.checkOutFormGroup.get(formGroupName);
   const countryCode = formGroup.value.country.code; //country.ts in common has fields code and name
   const countryName = formGroup.value.country.name;

    console.log("country code:: "+countryCode);
    console.log("country name::"+countryName);

    this.luv2ShopFormService.getStates(countryCode).subscribe (

      data => {

        if(formGroupName === 'shippingAddress'){
          this.shippingAddressStates = data;
        }
        
        else {
          this.billingAddressStates = data;
        }

        //select first item by default
        formGroup.get('state').setValue(data[0]); //set value to first item in array
      });

  }

// GETTER methods START


//CUSTOMER getter method to use in html for validation start 
  // to get value for validation
  get firstName() { return this.checkOutFormGroup.get('customer.firstName'); }

  //so from here we can use in html  <div *ngIf="firstName?.errors?.['required']">  firstName property

// to get value for validation
get lastName() {  return this.checkOutFormGroup.get('customer.lastName'); }

// to get value for validation
get email() { return this.checkOutFormGroup.get('customer.email'); }
//CUSTOMER getter method to use in html for validation END 





//SHIPPING address getter method to use in html for validation start 
get shippingAddressStreet() {  return this.checkOutFormGroup.get('shippingAddress.street');  }
get shippingAddressCity() {  return this.checkOutFormGroup.get('shippingAddress.city');  }
get shippingAddressState() {  return this.checkOutFormGroup.get('shippingAddress.state');  }
get shippingAddressZipCode() {  return this.checkOutFormGroup.get('shippingAddress.zipCode');  }
get shippingAddressCountry() {  return this.checkOutFormGroup.get('shippingAddress.country');  }
//SHIPPING address getter method to use in html for validation end 


//BILLING address getter method to use in html for validation start 
get billingAddressStreet() {  return this.checkOutFormGroup.get('billingAddress.street');  }
get billingAddressCity() {  return this.checkOutFormGroup.get('billingAddress.city');  }
get billingAddressState() {  return this.checkOutFormGroup.get('billingAddress.state');  }
get billingAddressZipCode() {  return this.checkOutFormGroup.get('billingAddress.zipCode');  }
get billingAddressCountry() {  return this.checkOutFormGroup.get('billingAddress.country');  }
//BILLING address getter method to use in html for validation end 

//credit card getter method to use in html for validation start 

get creditCardType() {  return this.checkOutFormGroup.get('creditCard.cardType');  }
get creditCardNameOnCard() {  return this.checkOutFormGroup.get('creditCard.nameOnCard');  }
get creditCardNumber() {  return this.checkOutFormGroup.get('creditCard.cardNumber');  }
get creditCardSecurityCode() {  return this.checkOutFormGroup.get('creditCard.securityCode');  }
//credit card getter method to use in html for validation end 



//getter methods END


  reviewCartDetails() {

  //subscribe to carservice.totalQuantity
    this.cartService.totalQuantity.subscribe(

      data => {

       this.totalQuantity = data;

      }

    );

    //subscribe to carservice.totalPrice

    this.cartService.totalPrice.subscribe(

      data => {

       this.totalPrice =  data
      }
    );

}

  resetCart() {

    //reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.cartService.persistCartItems(); //update storage with latest state of cart

    //reset the form
    this.checkOutFormGroup.reset;

    this.router.navigateByUrl('/products');


  }

  setupStripePaymentForm() {

      // get a handle to stripe elements
      var elements = this.stripe.elements();

    // Create a card element ... and hide the zip-code field by adding custom json
    this.cardElement = elements.create('card', { hidePostalCode: true });

    // Add an instance of card UI component into the 'card-element' div
    this.cardElement.mount('#card-element');

    // Add event binding for the 'change' event on the card element we have a div id=card-element in checkout.commp.html
   //for valid card number,exprtn date not gone, proper cvs etc
    this.cardElement.on('change', (event: any) => {

      // get a handle to card-errors element
      this.displayError = document.getElementById('card-errors');

      if (event.complete) {
        this.displayError.textContent = "";
      } else if (event.error) {
        // show validation error to customer
        this.displayError.textContent = event.error.message;
      }

    });













  }
 


}


