import { LightningElement, track } from 'lwc';

const cols = [
    { Id: 1, label: 'Invoice Number',fieldName: 'invoice'},
    { Id: 2, label: 'Shipping Date',fieldName: 'shipping_date', type: 'date' },
    { Id: 3, label: 'Shipping Address',fieldName: 'shipping_addr'},
    { Id: 4, label: 'Quantity',fieldName: 'quantity'},
    {
        Id: 5,
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
]
export default class CustomDatatable extends LightningElement {

    @track data = [];
    showTable = false;
    inv;
    dt;
    addr;
    qty;
    rowId = 1;
    @track columns = cols;
    handleChange(event){
        const name = event.target.name;
        if(name == 'Invoice')
            this.inv = event.target.value;
        if(name == 'ShipDate')
            this.dt = event.target.value;
        if(name == 'ShipAddr')
            this.addr = event.target.value;
        if(name == 'Quantity')
            this.qty = event.target.value;
    }
    
    handleAction(event){
        const row = event.detail.row;
        this.data.splice(this.data.findIndex(order => row.Id === order.Id), 1);
        this.data = [...this.data]; 
        
        if(this.data == null || this.data == ''){
            this.showTable = false;
        }
    }
    handleAdd(event){
        console.log('inside button click event>>')
        this.rowId = this.rowId + 1;
        if(this.inv != '' && this.inv != null && this.dt != '' && this.dt != null && this.addr != '' && this.addr != null && this.qty != '' && this.qty != null){
            console.log('qty===='+this.qty)
            this.data = [...this.data,
            {
                Id: this.rowId,
                invoice : this.inv,
                shipping_date : this.dt,
                shipping_addr : this.addr,
                quantity : this.qty
            }];
            console.log(this.data);
            this.showTable = true;
        }
    }
    handleClear(){
        
        this.template.querySelectorAll('lightning-input')
        .forEach(element => {
            element.value = null;
        });
    }
}