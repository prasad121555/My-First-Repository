import { LightningElement, api, wire, track } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
//import userId from '@salesforce/user/Id';
//import userProfile from '@salesforce/schema/User.Profile.Name';
import createShippingOrders from '@salesforce/apex/ShippingOrderAPI.createShippingOrders';
//const FIELDS = ['Order_Shipment__c.Invoice_Id__c', 'Order_Shipment__c.Shipping_Status__c'];
const FIELDS = ['Order_Shipment_Product__c.Invoice_Id__c', 'Order_Shipment_Product__c.Shipping_Status__c'];

export default class OnLoadOrderShipment extends LightningElement {
    //@track loggedInUserId = userId;
    //@track loggedInUserProfile;
    @track currentOrdShipId;
    @track currentOrdShipStatus;
    @track p = '&invoice_id=';
    @track param;
    @api recordId;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    wiredAccount({ error, data }) {
        if (data) {
            //console.log('Data in OnLoadCase-->', data);
            this.currentOrdShipId = data.fields.Invoice_Id__c.value;


            this.currentOrdShipStatus = data.fields.Shipping_Status__c.value;
            console.log('Status =>>', this.currentOrdShipStatus);
            if (this.currentOrdShipStatus != 'Delivered' && this.currentOrdShipStatus != 'Shipment Lost' && this.currentOrdShipStatus != 'Shipment OnHold' && this.currentOrdShipStatus != 'Reverse Pickup Scheduled' && this.currentOrdShipStatus != 'Reverse Picked Up' && this.currentOrdShipStatus != 'RTO Undelivered' && this.currentOrdShipStatus != 'RTO Delivered') {
                this.updateOrderShipment();
            }

        }
    }
    //get current user profile
    /*
    @wire(getRecord, {
        recordId: userId,
        fields: [userProfile]
    }) wireuser({
        error,
        data
    }) {
        if (error) {
            this.error = error;
        } else if (data) {
            //console.log('Data in OnLoadOrderShipment-->', data);
            this.loggedInUserProfile = data.fields.Profile.value.fields.Name.value;
        }
    }
    */
    updateOrderShipment() {
        //console.log('login USERID =' + this.loggedInUserId);
        //console.log('login USERProfile =', this.loggedInUserProfile);
        console.log('Order Shipment Invoice Id =', this.currentOrdShipId);
        console.log('Order Shipment Status =', this.currentOrdShipStatus);

        if (this.currentOrdShipStatus != 'Delivered' && this.currentOrdShipStatus != 'Shipment Lost' && this.currentOrdShipStatus != 'Shipment OnHold' && this.currentOrdShipStatus != 'Reverse Pickup Scheduled' && this.currentOrdShipStatus != 'Reverse Picked Up' && this.currentOrdShipStatus != 'RTO Undelivered' && this.currentOrdShipStatus != 'RTO Delivered') {
            console.log('allowed for ship status');
            //this.param = this.p.concat(this.currentOrdShipId.toString());
            this.param = this.p + this.currentOrdShipId;
            console.log('param = ' + this.param);
            createShippingOrders({ Param: this.param })
                .then(result => {
                    console.log('API called = ');
                    eval("$A.get('e.force:refreshView').fire();");
                })
                .catch(error => {
                    this.errorMsg = error;
                })
        }


    }
}