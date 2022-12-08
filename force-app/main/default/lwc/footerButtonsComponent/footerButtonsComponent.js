import { LightningElement, track } from 'lwc';
import getDeliveredRecords from '@salesforce/apex/DeliveredStatusRecordsHandler.getDeliveredRecords';
import updateOrders from '@salesforce/apex/SaveButtonHandler.updateOrders';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import { CloseActionScreenEvent } from "lightning/actions";

const cols = [
{ label : 'Order Shipment Number', fieldName : 'Name'},
{ label : 'Customer Name', fieldName : 'Customer_Name__c'},
{ label : 'Invoice Number', fieldName : 'Invoice_Number__c'},
{ label : 'Total Price', fieldName : 'Total_Price__c'},
{ label : 'Shipment Status', fieldName : 'Shipment_Status__c'},
];

export default class FooterButtonsComponent extends LightningElement {
    @track data = [];
    @track value ;//this.template.querySelector('lightning-input[data-name="temp"]').value;
    showTable = false;
    disable = true;
    @track columns = cols;
    orderSpinner = false;
    @track Ids = [];
    

    // get options() {
    //     return [
    //         { label: 'COD', value: 'COD' },
    //         { label: 'Prepaid', value: 'Prepaid' },
        
    //     ];
    // }
    // connectedCallback(){
    //     getOrders({selectedValue : this.value})
    //     .then(result =>{ //result will store promise(data returned by apex class)
    //     this.data = result;
    //     if(this.data != null && this.data!=''){
    //     this.showTable = true;
    //     }
    //     else{
    //         this.showTable = false;
    //     }
    //     console.log('Data is===>'+this.data);
    // })
    // }

    handleChange(event){
        this.data = [];
        console.log('HandleChange called');
        this.value = event.detail.value;
        console.log('Value is:'+this.value);
        console.log('Value length is:'+this.value.length);

        //Show dataTable when length of invoice number is greater than 2
        if(this.value.length>2){
            console.log('Inside if');
            this.orderSpinner = true;
            getDeliveredRecords({enteredValue : this.value})
        
            .then(result =>{ //result will store promise(data returned by apex class)
                this.data = result;
                this.orderSpinner = false;
            
                if(this.data != null && this.data != '' && this.value.length>2){
                    this.showTable = true;
                    // console.log('Selected rows==> '+this.template.querySelector("lightning-datatable").getSelectedRows().length>0);
                    // if(this.template.querySelector("lightning-datatable").getSelectedRows().length>0){
                    //     this.disable = true;
                    // }
                }
                else{
                    this.showTable = false;
                }
                console.log('Data is===>'+this.data);
            })
        
        }
        else{
            console.log('inside else');
            this.showTable = false;
        }
    }

    getSelectedIds(event){
        console.log(event);
        this.Ids = [];
        const selectedRows = event.detail.selectedRows;
        for (let i = 0; i < selectedRows.length; i++) {
            this.Ids[i] = selectedRows[i].Id;
        }
        console.log('ids===>'+this.Ids);
        if(this.Ids.length > 0){
            this.disable = false;
        }
        else if(this.Ids.length == 0){
            this.disable = true;
        }
    }

    handleSave(){
    //var selectedRecords =  this.template.querySelector("lightning-datatable").getSelectedRows();
        console.log('Ids length===>'+this.Ids.length);
        updateOrders({selectedRows : this.Ids})
        .then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Records updated Successfully!',
                    variant: 'success'
                })
            );
            console.log('Records Updated Successfully!');
            this.dispatchEvent(new CloseActionScreenEvent());
        })
    }

    handleCancel() {
        this.dispatchEvent(new CloseActionScreenEvent());
    }
}