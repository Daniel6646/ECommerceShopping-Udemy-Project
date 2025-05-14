import { FormControl, ValidationErrors } from "@angular/forms";

export class Luv2ShopValidators {

    // whitespace validation on checkout form
    static notOnlyWhiteSpace(control : FormControl) : ValidationErrors {

        //if validation check fails then return validation errors
        //if validation check passes return null 
        //for condition where when empty space is added using space first name is required validation goes away

        //check if string only contains whitespace
        if ((control.value != null) && (control.value.trim().length === 0)) {

            return {'notOnlyWhiteSpace' : true};// validation error key should be same as method
            //will use this error key in html
            // means it contains a string without whitespaces then true
        }

        else {

            //valid return null
            return null;


        }
    }


    static characterThenSpacesValidation(control : FormControl) : ValidationErrors {

        if ((control.value != null) && (control.value.trim().length <=1)) {
        //valdtn for j[character] followed by spaves

            return {'characterThenSpacesValidation' : true};// validation error key should be same as method
       
        }

        else {

            //valid return null
            return null;


        }
    }


}
