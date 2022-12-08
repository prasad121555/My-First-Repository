import { LightningElement,api, track } from 'lwc';
import getFreeProducts from '@salesforce/apex/ModelBoxClass.getFreeProducts';

export default class ModelBox extends LightningElement {

    @track data;
    msg;
    @track columns = [
        { label: 'Product Name',fieldName: 'p_name'},
    ]
    @api productname ;
    showData = false;
    
    connectedCallback(){
        console.log('inside popup=='+JSON.stringify(this.productname));
        if(this.productname != null){
            console.log('inside popup')
            getFreeProducts({prodNames : this.productname})
            .then(res =>{
                this.showData = true;
                this.data = res;
                this.msg = 'Number of free products on this product are - '+this.data.length;
            })
        }
        else{
            console.log('inside popup else')
            this.showData =false;
            this.msg = 'No free products are available on this product';
        }
    }
    // @track isShowModal = false;

    // showModalBox() {  
    //     this.isShowModal = true;
    // }

    hideModalBox() {  
        this.dispatchEvent(new CustomEvent('close'));
        this.msg = null;
        this.showData =false;
        this.data = null;
    }

}