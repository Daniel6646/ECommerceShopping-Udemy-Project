export class PaymentInfo {

    constructor(public amount?: number,
                public currency?: string,
                public receiptEmail? : string) {

}
//why using ?
//receiptEmal' is declared but its value is never read.


}
