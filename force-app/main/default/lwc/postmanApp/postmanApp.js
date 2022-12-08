import { LightningElement,track } from 'lwc';
import getResponse from '@salesforce/apex/HttpRequestHandler.getResponse';

export default class PostmanApp extends LightningElement {
    cssClass = 'minHeight';
    checkedFirst = true;
    checkedSecond = false;
    checkedThird = false;
    checkedLast = false;
    isVisible = false;
    isRaw = false;
    url;
    isBearer = false;
    method='GET';
    jsonBody;
    
    authIn1='No Auth';
    authIn2;
    response;
    @track listOfParams=[];
    @track listOfHeaders=[];
    @track listOfBody=[];
    tempListOfParams=[];
    tempListOfHeaders=[];
    tempListOfBody=[];
    activeTab='Params';

    connectedCallback() {
        
    }
    /**
     * Adds a new row
     */
    addNewRow() {
        if(this.activeTab === 'Params'){
            this.createRow(this.listOfParams);
            console.log('param size=='+this.listOfParams.length)
        }
        if(this.activeTab === 'Headers'){
            console.log('param size1=='+this.listOfParams.length)
            this.createRow(this.listOfHeaders);
        }
        if(this.activeTab === 'Body'){
            console.log('param size2=='+this.listOfParams.length)
            this.createRow(this.listOfBody);
        }
    }

    /**
     * Removes the selected row
     */
    removeRow(event) {

        if(this.activeTab === 'Params'){
            let toBeDeletedRowIndex = event.target.name;
            console.log('name==',toBeDeletedRowIndex)
            // this.tempListOfParams = [];
            // for(let i = 0; i < this.listOfParams.length; i++) {
            //     let tempRecord = Object.assign({}, this.listOfParams[i]); //cloning object
            //     if(tempRecord.index !== toBeDeletedRowIndex) {
            //         this.tempListOfParams.push(tempRecord);
            //     }
            // }

            // for(let i = 0; i < this.tempListOfParams.length; i++) {
            //     this.tempListOfParams[i].index = i + 1;
            // }
            // this.listOfParams = this.tempListOfParams;
            this.listOfParams.splice(this.listOfParams.findIndex(param => toBeDeletedRowIndex === param.index), 1);
            this.listOfParams = [...this.listOfParams];
        }
        if(this.activeTab === 'Headers'){
            let toBeDeletedRowIndex2 = event.target.name;
            console.log('name1==',toBeDeletedRowIndex2)
            // this.tempListOfHeaders = [];
            // for(let i = 0; i < this.listOfHeaders.length; i++) {
            //     let tempRecord = Object.assign({}, this.listOfHeaders[i]); //cloning object
            //     if(tempRecord.index !== toBeDeletedRowIndex2) {
            //         this.tempListOfHeaders.push(tempRecord);
            //     }
            // }

            // for(let i = 0; i < this.tempListOfHeaders.length; i++) {
            //     this.tempListOfHeaders[i].index = i + 1;
            // }
            // this.listOfHeaders = this.tempListOfHeaders;
            this.listOfHeaders.splice(this.listOfHeaders.findIndex(header => toBeDeletedRowIndex2 === header.index), 1);
            this.listOfHeaders = [...this.listOfHeaders];
        }
        if(this.activeTab === 'Body'){
            let toBeDeletedRowIndex3 = event.target.name;
            console.log('name3==',toBeDeletedRowIndex3)
            // this.tempListOfBody = [];
            // for(let i = 0; i < this.listOfBody.length; i++) {
            //     let tempRecord = Object.assign({}, this.listOfBody[i]); //cloning object
            //     if(tempRecord.index !== toBeDeletedRowIndex3) {
            //         this.tempListOfBody.push(tempRecord);
            //     }
            // }

            // for(let i = 0; i < this.tempListOfBody.length; i++) {
            //     this.tempListOfBody[i].index = i + 1;
            // }
            // this.listOfBody = this.tempListOfBody;
            this.listOfBody.splice(this.listOfBody.findIndex(body => toBeDeletedRowIndex3 === body.index), 1);
            this.listOfBody = [...this.listOfBody];
        }
    }

    handleInputChange(event) {
        let index = event.target.dataset.id;
        let fieldName = event.target.name;
        let value = event.target.value;
        if(this.activeTab === 'Params'){
            for(let i = 0; i < this.listOfParams.length; i++) {
                if(this.listOfParams[i].index === parseInt(index)) {
                    this.listOfParams[i][fieldName] = value;
                }
            }
            console.log('data==',JSON.stringify(this.listOfParams))
        }
        if(this.activeTab === 'Headers'){
            for(let i = 0; i < this.listOfHeaders.length; i++) {
                if(this.listOfHeaders[i].index === parseInt(index)) {
                    this.listOfHeaders[i][fieldName] = value;
                }
            }
            console.log('data1==',JSON.stringify(this.listOfHeaders))
        }
        if(this.activeTab === 'Body'){
            for(let i = 0; i < this.listOfBody.length; i++) {
                if(this.listOfBody[i].index === parseInt(index)) {
                    this.listOfBody[i][fieldName] = value;
                }
            }
            console.log('data2==',JSON.stringify(this.listOfBody))
        }
    }

    get options(){
        return [
                {label: 'GET',value: 'GET'},
                {label: 'POST',value: 'POST'}
            ]
    }

    get options1(){
        return [
                {label: 'No Auth',value: 'No Auth'},
                {label: 'Bearer Token',value: 'Bearer Token'}
            ]
    }

    handleUrlChange(event){
        const name = event.target.name;
        if(name == 'combobox'){
            console.log('combo value is=='+event.target.value)
            this.method = event.target.value;
        }if(name == 'inputBox'){
            console.log('input value is=='+event.target.value)
            this.url = event.target.value;
        }
    }

    handleActiveTab(event){
        this.activeTab = event.target.label;
        console.log('active tab=='+this.activeTab);
        if(this.activeTab === 'Params' && this.listOfParams.length == 0){
            this.createRow(this.listOfParams);
        }
        if(this.activeTab === 'Headers' && this.listOfHeaders.length == 0){
            this.createRow(this.listOfHeaders);
        }
        if(this.activeTab === 'Body' && this.listOfBody.length == 0){
            this.createRow(this.listOfBody);
        }
    }

    createRow(params) {
        let paramsObject = {};
        if(params.length > 0) {
            paramsObject.index = params[params.length - 1].index + 1;
        } else {
            paramsObject.index = 1;
        }
        paramsObject.Key = null;
        paramsObject.Value = null;
        params.push(paramsObject);
    }

    handleCheckboxChange(event){
        const label = event.target.label;
        if(label == 'none'){
            this.checkedFirst = true;
            this.isVisible = false;
            this.checkedSecond = false;
            this.checkedThird = false;
            this.checkedLast = false;
            this.isRaw = false;
        }else if(label == 'form-data'){
            this.checkedFirst = false;
            this.checkedSecond = true;
            this.isVisible = event.target.checked;
            this.checkedThird = false;
            this.checkedLast = false;
            this.isRaw = false;
        }else if(label == 'x-www-form-urlencoded'){
            this.checkedFirst = false;
            this.checkedSecond = false;
            this.checkedThird = true;
            this.isVisible = event.target.checked;
            this.checkedLast = false;
            this.isRaw = false;
        }else if(label == 'raw'){
            this.checkedFirst = false;
            this.checkedSecond = false;
            this.checkedThird = false;
            this.isVisible = false;
            this.checkedLast = true;
            this.isRaw = event.target.checked;
        }
    }

    handleChange(event){
        const name = event.target.name;
        if(name == 'authIn1'){
            this.authIn1 = event.target.value;
            if(this.authIn1 == 'No Auth'){
                this.isBearer = false;
            }else{
                this.isBearer = true;
            }
        }else if(name == 'authIn2'){
            this.authIn2 = event.target.value;
        }
    }

    handleJsonBody(event){
        this.jsonBody = event.target.value;
    }

    handleClick(event){
        const name = event.target.name;
        if(name == 'send'){
            let finalUrl;
            if(this.paramIn1 != null && this.paramIn1 != ''){
                finalUrl = this.url+'?'+this.paramIn1+'='+this.paramIn2;
            }
            else{
                finalUrl = this.url;
            }
            console.log('inside send>>')
            getResponse({url:finalUrl,method:this.method,bearerToken:this.authIn2,body:this.jsonBody})
            .then(res=>{
                console.log('response==',res)
                this.response = res;
            })
        }else if(name == 'save'){
            console.log('inside save>>')
        }
    }
}