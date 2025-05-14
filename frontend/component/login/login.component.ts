import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import OktaSignIn from '@okta/okta-signin-widget';
import myAppConfig from '../../config/my-app-config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
 
  oktaSignin : any;

  constructor( @Inject(OKTA_AUTH) private oktaAuth : OktaAuth, private oktaAuthService : OktaAuthStateService ) { 

    // passing information from our app to okta authorization server
    //integration app with okta authorization server 
    this.oktaSignin = new OktaSignIn({

      logo : 'assets/images/logo.png',
      baseUrl : myAppConfig.oidc.issuer.split('/oauth2')[0],  //file myAppConfig created for okta config ctrl click on it
    //abve lne sying gve everything in url besides /oauth2
      clientId : myAppConfig.oidc.clientId,
      redirectUri : myAppConfig.oidc.redirectUri, 
     // useClassicEngine: true,
      authParams : {
        pkce : true, //proof key for code exchange
        issuer : myAppConfig.oidc.issuer,
        scopes : myAppConfig.oidc.scopes
      }
    });

   }

  ngOnInit( ): void {

    // remove previous elemts that were rendered.
    this.oktaSignin.remove();


    //render the sign in widget, renderEl render an element
    this.oktaSignin.renderEl({
        //which element to render which is json :: to render el with given id which is okta-sign-in-widget
        el: '#okta-sign-in-widget'   //this name should be same as the div tag  id in login.component.html
        // # to parse aobe element id 
      },
       (response : any) => {
        if ( response.status === 'SUCCESS' ) {
          this.oktaAuth.signInWithRedirect(); // redirect to our redirect uri

        }
       },
       (error : any) => {
        throw error;

       }
     );

  }





}
