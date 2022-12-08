import { LightningElement } from 'lwc';
import templateOne from './templateOne.html'
import templateTwo from './templateTwo.html';
// import getNames from '@salesforce/apex/AutoPopulate.getNames';
// import populateInput from '@salesforce/apex/AutoPopulate.populateInput';

export default class Multi extends LightningElement {
    showTemplateTwo = false;

    render() {
        return this.showTemplateTwo ? templateTwo : templateOne;
    }

    switchTemplate() {
        this.showTemplateTwo = !this.showTemplateTwo;
    }
    // accName;
    // accId;
    // options;

    // connectedCallback(){
    //     const arr = [];
    //     getNames()
    //     .then(res => {
    //         for(var i=0; i<res.length; i++){
    //             arr.push({label:res[i].Name, value:res[i].Name});
    //         }
    //         this.options = arr;
    //     })
    // }

    // get accOpts(){
    //     return this.options;
    // }

    // handleChange(event){
    //     const name = event.target.name;
    //     if(name == 'AccName'){
    //         this.accName = event.target.value;
    //         populateInput({nm : this.accName})
    //         .then(result => {
    //             console.log(result.Id)
    //             this.accId = result.Id;
    //         })
    //     }
    // }
}