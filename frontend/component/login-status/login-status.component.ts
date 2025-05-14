import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrl: './login-status.component.css'
})

export class LoginStatusComponent implements OnInit {

  isAuthenticated : boolean = false;
  userFullName : string = '';
  storage : Storage = sessionStorage;//ref to web browser session

  constructor( private oktaAuthService : OktaAuthStateService,
               @Inject(OKTA_AUTH) private oktaAuth : OktaAuth ) {


  }

  ngOnInit(): void {

    //subscribe to authenticfation state change and result
    this.oktaAuthService.authState$.subscribe(
      (result) => {

        this.isAuthenticated = result.isAuthenticated!;
        this.getUserDetails();
      }

    );

  }


  getUserDetails() {

    if(this.isAuthenticated) {

      //Fetch logged in user details ( users claims)


      // users full name is exposed as property name
      this.oktaAuth.getUser().then(

        (res) => {
        this.userFullName = res.name as string; // conversion into string as variable is of string type
       
       //retrieve users email from authentication response
        const theEmail =  res.email;

        //store data in browser storage [key,value pair ]
        this.storage.setItem('userEmail',JSON.stringify(theEmail));


        }
      );
    
    }

  }


  logout() {
    // terminates session with okta and removes current token.

    this.oktaAuth.signOut();

  }


}
