/****************************************************************** 
              ------Datatable with Pagination------
              
Developed by : Prasad Thakur
Completion date : 29/07/2022
*******************************************************************/

import { LightningElement, track, api } from 'lwc';
import getOrders from '@salesforce/apex/OrderDetails.getOrders';
import getPreviousOffset from '@salesforce/apex/OrderDetails.getPreviousOffset';
import getNextOffset from '@salesforce/apex/OrderDetails.getNextOffset';
import getTotalRecords from '@salesforce/apex/OrderDetails.getTotalRecords';

const cols = [
    { label : 'Order Shipment Number', fieldName : 'Name'},
    { label : 'Customer Name', fieldName : 'Customer_Name__c'},
    { label : 'Invoice Number', fieldName : 'Invoice_Number__c'},
    { label : 'Total Price', fieldName : 'Total_Price__c'}
];
const cols1 = [
    {
        label: 'Action',
        type: 'button-icon',
        typeAttributes: {
            iconName: 'action:delete',
            name: 'delete',
            variant: 'destructive',
            title: 'Delete',
            alternativeText: 'Delete'
        }
    }
];
export default class OrderDetailsComponent extends LightningElement {
    @track data = [];
    @track value ;
    showTable = false;
    @track columns = [...cols, ...cols1];
    orderSpinner = false;
    Offset=0;
    totalRecords;
    page_size = 10;
    isNext;
    isPrev;
    isFirst;
    isLast;
    isData;
    currentPage;
    lastPage;
    recordCount = 0;

    connectedCallback(){
        console.log('loaded...')
        this.checkOffset();
        this.isNext = true;
        this.isFirst = true;
        this.isLast = true;
        this.isData = true;
    }
    handleChange(event){
        this.data = [];
        this.value = event.detail.value;
        this.Offset = 0;
        this.currentPage = 1;
        getTotalRecords({searchValue : this.value})
        .then(result =>{
            this.recordCount = result;
            this.lastPage = Math.ceil(this.recordCount/this.page_size);
            this.checkValueLength();
            this.handlePageChange();
        });
    }
    handlePageChange(){
        if(this.value.length>2){
            this.orderSpinner = true;
            this.checkOffset();
            getOrders({enteredValue : this.value, offset : this.Offset, pageSize : this.page_size})
            .then(result =>{
                this.data = result;
                this.totalRecords = this.data.length;
                this.orderSpinner = false;
                if(this.data != null && this.data != '' && this.value.length>2){ 
                    this.showTable = true;
                    this.isNext = false;
                    this.isLast = false;
                    this.isData = false;
                    if(this.currentPage == this.lastPage){
                        this.isNext = true;
                        this.isLast = true;
                    }
                }else{
                    this.showTable = false;
                }
            });
        }else{
            this.showTable = false;
            this.isData = true;
        }
    }
    changeHandler(event){
        const limit = event.target.value;
        this.page_size = limit;
        this.Offset = 0;
        this.currentPage = 1;
        this.lastPage = Math.ceil(this.recordCount/this.page_size);
        this.checkValueLength();
        this.handlePageChange();
    }
    firstHandler(){
        this.Offset = 0;
        this.currentPage = 1;
        this.handlePageChange();
    }
    previousHandler(){
        this.currentPage = this.currentPage - 1;
        getPreviousOffset({offset: this.Offset, pageSize: this.page_size})
        .then(result=>{
            this.Offset = result;
            this.handlePageChange();
            if(this.Offset <= 0){
                this.isPrev = true;
            }else{
                this.isPrev = false;
                this.isNext = false;
            }
        });
    }
    nextHandler(){
        this.currentPage = this.currentPage + 1;
        getNextOffset({offset: this.Offset, pageSize: this.page_size})
        .then(result=>{
            this.Offset = result;
            if(this.Offset > 0){
                this.isFirst = true;
            }else{
                this.isFirst = false;
            }
            this.handlePageChange();
        });
    }
    lastHandler(){
        this.currentPage = this.lastPage;
        if(this.currentPage == this.lastPage && (this.recordCount)%(this.page_size) == 0){
            this.Offset = this.recordCount - (this.recordCount)%(this.page_size) - this.page_size;
        }else{
            this.Offset = this.recordCount - (this.recordCount)%(this.page_size);
        }
        this.handlePageChange();
    }
    handleRowDeletion(event){
        const row = event.detail.row;
        this.data.splice(this.data.findIndex(order => row.Id === order.Id), 1);
        this.data = [...this.data];
    }
    checkOffset(){
        if(this.Offset <= 0){
            this.isFirst = true;
            this.isPrev = true;
        }else{
            this.isFirst = false;
            this.isPrev = false;
        }
    }
    checkValueLength(){
        if(this.showTable == false || this.value.length < 3 || this.data == null || this.data == ''){
            this.isFirst = true;
            this.isPrev = true;
            this.isNext = true;
            this.isLast = true;
        }else{
            this.isNext = false;
            this.isLast = false;
        }
    }
}