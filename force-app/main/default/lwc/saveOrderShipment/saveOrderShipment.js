import { LightningElement } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import ORDERSHIPMENTOBJECT from '@salesforce/schema/Order_Shipment__c';
import TYPEFIELD from '@salesforce/schema/Order_Shipment__c.Order_Shipment_Type__c';
import INVOICENUMBERFIELD from '@salesforce/schema/Order_Shipment__c.Invoice_Number__c';
import ORDERFIELD from '@salesforce/schema/Order_Shipment__c.Order__c';
import STATUSFIELD from '@salesforce/schema/Order_Shipment__c.Shipment_Status__c';

export default class SaveOrderShipment extends LightningElement {
    
    OjectApiName=ORDERSHIPMENTOBJECT;
    fields=[TYPEFIELD,INVOICENUMBERFIELD,ORDERFIELD,STATUSFIELD];

    handleSuccess(event){
        const showtoast=new ShowToastEvent({
            title: "Record Saved Successfully with record Id: "+event.detail.id,
            varient:"success"
        });
        this.dispatchEvent(showtoast);
    }
}