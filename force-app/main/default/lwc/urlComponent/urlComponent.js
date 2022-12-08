import { LightningElement,track } from 'lwc';
import getNames from '@salesforce/apex/AutoPopulate.getNames';
import { loadStyle } from 'lightning/platformResourceLoader';
import CUSTOMCSS from '@salesforce/resourceUrl/CustomCss';

const cols = [
    {label: 'Account Name', fieldName: 'Name'},
    {label: 'Website', fieldName: 'Website',type:'url', cellAttributes:{class:{fieldName:'linkCss'}}}
]

export default class UrlComponent extends LightningElement {
    @track tableData;
    @track columns = cols;
    isLoaded = false;

    renderedCallback(){
        if(this.isLoaded){
            return;
        }
        this.isLoaded = true;
        loadStyle(this, CUSTOMCSS)
        .then(()=>{

        })
    }
    connectedCallback(){
        getNames()
        .then(res =>{
            console.log('data--->',res)
            this.tableData = res.map(item=>{
                let hideLink = item.Name === 'New Account 0' ? 'hideLink' : '';
                return {...item,
                        'linkCss':hideLink
                }
            })
        })
    }
}