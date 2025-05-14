export class OrderHistory {

//Purpose create a array of this class in ts, api call then returning data store in array of this class then iterate over this class arraya data and display data in html of login-status.html

constructor(public id : string,
            public orderTrackingNumber : string,
            public totalPrice :number,
            public totalQuantity: number,
            public dateCreated :Date) {}

}
