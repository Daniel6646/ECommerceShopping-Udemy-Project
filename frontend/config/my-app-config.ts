export default {

    // define json for odic OpenId connect

    oidc : {
       // clientId : '0oae47nw3wNI68BDv5d7',
       // go to okta site signin with google on left tab click on applications/applications to get client id
        clientId : '0oae6hbv2fDxY1NRE5d7',
        issuer : 'https://dev-05237015.okta.com/oauth2/default', // right top bar you will get it, then add https:// , then add domain oauth2/default
        redirectUri : 'https://localhost:4200/login/callback',
        scopes : ['openid','profile','email'] //setting json or properties file via json config

    }

}

//description

//client id : is the public identifier of the client app
//issuer : issuer of tokens, thats the url we will use when authorizing with Okta authorixation server.
//redirectUri : send the user to this link when they login
//scopes : provide access to information about a user 
//[openid,profile,email]
// openid : required for authentication requests,
// profile :  users first name, last name, phone etc
// email : users email