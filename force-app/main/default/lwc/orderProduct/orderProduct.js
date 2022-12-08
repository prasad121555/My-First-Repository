import { LightningElement,track } from 'lwc';
import getProduct from '@salesforce/apex/ProductPriceController.getProducts'
import getAddress from '@salesforce/apex/ProductPriceController.getAddress'
const cols = [
    { label: 'Product Name',fieldName: 'p_name'},
    { label: 'Price',fieldName: 'price', type: '' },
    { label: 'Quantity',fieldName: 'quantity'},
    { label: 'Tax',fieldName: 'tax'},
    { label: 'SubTotal',fieldName: 'SubTotal'},
    {
        label: 'View Free Products',
        type: 'button-icon',
        typeAttributes: {
            iconName: 'action:preview',
            name: 'preview',
            variant: 'success',
            title: 'preview',
            alternativeText: 'preview'
        }
    }
]
export default class OrderProduct extends LightningElement {


    @track data;
    showTable = false;
    names;
    price=0;
    quant=0;
    tax;
    st=0;
    rowId;
    showPopup = false;
    @track columns = cols;
    arrPB;
    temp;
    accValue;
    bStreet;
    sStreet;
    checkBox;
    isOld = false;

    handleChange(event){
        const name = event.target.name;
        
       
        if(name == 'Quantity'){
            this.quant = event.target.value;
            this.st=this.quant * this.price;
        }
        if(name == 'Tax')
      {            this.tax = event.target.value;
      }
       
 // if(name == 'SubTotal')
        //      {this.st = event.target.value;}
        console.log(this.value +' . '+this.quant+'.'+this.tax+'.'+this.st);
    }
    
    handleAction(event){
        console.log('inside handle action',JSON.stringify(event.detail.row))
        //let row = event.detail.row.Id;
        this.names = event.detail.row.Id

        this.showPopup = true;
        
        // this.data.splice(this.data.findIndex(order => row.Id === order.Id), 1);
        // this.data = [...this.data]; 
        
    }
    handleAdd(event){
        console.log('2'+this.value +' .'+this.quant+'.'+this.tax+'.'+this.st);
        console.log('inside button click event>>')
        // this.rowId = this.rowId + 1;
        if(this.value != '' && this.value != null && this.price != '' && this.price != null && this.quant != '' && this.quant != null && this.st != '' && this.st != null)
        {
            console.log('quant===='+this.quant)
            if(this.data!=null && this.data != ''){
                console.log('inside outer if==')
                for(var i=0;i<this.data.length;i++){
                    console.log('inside for==')
                    if(this.data[i].Id == this.rowId){
                        console.log('inside inner if==')
                        this.data = [...this.data,
                                    {  
                                        Id: this.data[i].Id,
                                        p_name : this.data[i].p_name,
                                        price : this.data[i].price+this.price,
                                        quantity : this.data[i].quantity+this.quant,
                                        tax : this.data[i].tax,
                                        SubTotal : this.data[i].SubTotal+this.st
                                    }]
                        this.data.splice(this.data.indexOf(this.data[i].Id),1);
                        this.data=[...this.data];
                        this.isOld = true;
                        break;
                    }
                    else{
                        break;
                    }
                }
                if(this.isOld == false || this.data == null || this.data == ''){
                    console.log('inside else==')
                    this.data = [...this.data,
                    {
                        Id: this.rowId,
                        p_name : this.value,
                        price : this.price,
                        quantity : this.quant,
                        tax : this.tax,
                        SubTotal : this.st
                    }];
                }
            }
            
            console.log(this.data);
            console.log(this.showTable);
            this.showTable = true;
            console.log(this.showTable);
        }
    }
    handleClear(){
        
        this.template.querySelectorAll('lightning-input')
        .forEach(element => {
            element.value = null;
        });
    }

    handle_Green_Text_Click(){


    }

    handleClose(){
        this.showPopup = false;
    }

    handleSelect(event)
    {
        const label = event.target.nm;
        if(label == 'Product Name'){
         
            console.log('inside onselect')
            this.value = event.detail.recName;
            getProduct({pname:this.value})
            .then(result => {
                console.log('Product price==0',result[0].Id);
                this.rowId=result[0].Id
                this.temp = result.map(row=>{
                    return Object.assign({PBEntries:row.PricebookEntries})
                })
                this.temp.forEach(ele=>{
                    this.arrPB=ele.PBEntries;
                    console.log('arrr===='+JSON.stringify(this.arrPB));
                })
                this.price = this.arrPB[0].UnitPrice;
                console.log('arrr1===='+this.arrPB[0].UnitPrice);
            })
        }
        else if(label=='Customer Name')
        {
             this.accValue = event.detail.recName;
             getAddress({accname:this.accValue})

             .then(res=>{
               this.bStreet=res.BillingStreet;
             })
        }
    }

    handleremove(event)
    {
        const label1 = event.target.nm;
        if(label1 == 'Product Name')
        {
        this.value = null;
    
        this.price = 0;
        this.st=0;
        this.quant=0;

    }else  if(label1 == 'Customer Name')
    {
        this.bStreet=null;
    }
    }

    get options() {
        return [
                   
            { label: 'Mumbai', value: 'Mumbai' },
            { label: 'Madrid', value: 'Madrid' },
        ];
    }


    get Ranges() {
        return [
                   
            { label: 'Silver(10%-20%)', value: 'Silver(10%-20%)' },
            { label: 'Gold(0%-10%)', value: 'Gold(0%-10%)' },
            { label: 'Registered', value: 'Registered' },
        ];
    }
    ChangeAddress(event){
       this.checkBox=event.target.checked;
        if (this.checkBox == true){
            this.sStreet=this.bStreet;  
      } else if(this.checkBox==false) {
            this.sStreet=null;
      }
    }
}