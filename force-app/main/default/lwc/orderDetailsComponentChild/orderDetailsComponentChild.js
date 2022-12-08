import { LightningElement, wire, track, api } from 'lwc';
import getOrders from '@salesforce/apex/OrderDetails.getOrders';
import getNext from '@salesforce/apex/OrderDetails.getNext';
import getPrevious from '@salesforce/apex/OrderDetails.getPrevious';

const cols = [
    { label : 'Order Shipment Number', fieldName : 'Name'},
    { label : 'Customer Name', fieldName : 'Customer_Name__c'},
    { label : 'Invoice Number', fieldName : 'Invoice_Number__c'},
    { label : 'Total Price', fieldName : 'Total_Price__c'}
];

export default class OrderDetailsComponentChild extends LightningElement {
@track columns = cols;
@track v_Offset=0;
@track v_TotalRecords;
@track page_size = 10;

//Fetching records from apex class
handleChange(event){
    this.data = [];
    console.log('HandleChange called');
    this.value = event.detail.value;
    console.log('Value is:'+this.value);
    console.log('Value length is:'+this.value.length);
    this.handlePageChange();
}
handlePageChange(){
    //Show dataTable when length of invoice number is greater than 2
    if(this.value.length>2){
        console.log('Inside if');
        this.orderSpinner = true;
        getOrders({enteredValue : this.value, offset : this.v_Offset, pageSize : this.page_size})

        .then(result =>{ //result will store promise(data returned by apex class)
            this.data = result;
            this.v_TotalRecords = this.data.length;
            this.orderSpinner = false;

            if(this.data != null && this.data != '' && this.value.length>2){ 
                this.showTable = true;
            }
            else{
                this.showTable = false;
            }
        })

    }
    else{
        console.log('inside else');
        this.showTable = false;
    }
}

previousHandler2(){
    getPrevious({offset: this.v_Offset, pageSize: this.page_size})
    .then(result=>{
        this.v_Offset = result;
        if(this.v_Offset === 0){
            this.template.querySelector('c-order-details-component').changeView('trueprevious');
        }else{
            this.template.querySelector('c-order-details-component').changeView('falsenext');
        }
    });
}

nextHandler2(){
    getNext({offset: this.v_Offset, pageSize: this.page_size}).then(result=>{
        this.v_Offset = result;
       if(this.v_Offset + 10 > this.v_TotalRecords){
            this.template.querySelector('c-order-details-component').changeView('truenext');
        }else{
            this.template.querySelector('c-order-details-component').changeView('falseprevious');
        }
    });
}

changeHandler2(event){
    const det = event.detail;
    this.page_size = det;
}
firstpagehandler(){
    this.v_Offset = 0;
    this.template.querySelector('c-order-details-component').changeView('trueprevious');
    this.template.querySelector('c-order-details-component').changeView('falsenext');
}
lastpagehandler(){
    this.v_Offset = this.v_TotalRecords - (this.v_TotalRecords)%(this.page_size);
    this.template.querySelector('c-order-details-component').changeView('falseprevious');
    this.template.querySelector('c-order-details-component').changeView('truenext');
}
}