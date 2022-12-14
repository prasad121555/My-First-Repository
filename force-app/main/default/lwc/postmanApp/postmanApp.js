import { LightningElement,track } from 'lwc';
import getResponse from '@salesforce/apex/HttpRequestHandler.getResponse';

const COLS = [
    {label:'Key', fieldName:'key'},
    {label:'Value', fieldName:'value', wrapText: true}
]

export default class PostmanApp extends LightningElement {
    @track columns = COLS;
    spinner = false;
    isSend = true;
    isPButtonVisible = false;
    isHButtonVisible = false;
    isBButtonVisible = false;
    checkedSecond = true;
    checkedThird = false;
    checkedLast = false;
    isVisible = true;
    isRaw = false;
    url;
    isBearer = false;
    method='GET';
    jsonBody = '';
    authIn1='No Auth';
    authIn2;
    response;
    @track responseHeaders = [];
    isResponse = false;
    @track listOfParams=[];
    @track listOfHeaders=[];
    @track listOfBody=[];
    @track tempListOfParams=[];
    @track tempListOfHeaders=[];
    @track tempListOfBody=[];
    activeTab='Params';
    statusCode='';
    maxIndexOfParam = 1;
    maxIndexOfHeaders = 1;
    maxIndexOfBody = 1;

    connectedCallback(){
        if(this.listOfParams.length == 0){
            this.createRow(this.listOfParams);
        }
        if(this.listOfHeaders.length == 0){
            this.createRow(this.listOfHeaders);
            console.log('header length='+this.listOfHeaders.length)
        }
        if(this.listOfBody.length == 0){
            this.createRow(this.listOfBody);
        }
    }

    //Removes the selected row
    removeRow(event) {
        if(this.activeTab === 'Params'){
            let toBeDeletedRowIndex = event.target.name;
            this.listOfParams.splice(this.listOfParams.findIndex(param => toBeDeletedRowIndex === param.index), 1);
            this.listOfParams = [...this.listOfParams];
            if(this.listOfParams.length === 1){
                this.isPButtonVisible = false;
            }else{
                this.isPButtonVisible = true;
            }
            this.maxIndexOfParam=Math.max(...this.listOfParams.map(p => p.index));
        }
        if(this.activeTab === 'Headers'){
            let toBeDeletedRowIndex2 = event.target.name;
            this.listOfHeaders.splice(this.listOfHeaders.findIndex(header => toBeDeletedRowIndex2 === header.index), 1);
            this.listOfHeaders = [...this.listOfHeaders];
            if(this.listOfHeaders.length === 1){
                this.isHButtonVisible = false;
            }else{
                this.isHButtonVisible = true;
            }
            this.maxIndexOfHeaders=Math.max(...this.listOfHeaders.map(h => h.index));
        }
        if(this.activeTab === 'Body'){
            let toBeDeletedRowIndex3 = event.target.name;
            this.listOfBody.splice(this.listOfBody.findIndex(body => toBeDeletedRowIndex3 === body.index), 1);
            this.listOfBody = [...this.listOfBody];
            if(this.listOfBody.length === 1){
                this.isBButtonVisible = false;
            }else{
                this.isBButtonVisible = true;
            }
            this.maxIndexOfBody=Math.max(...this.listOfBody.map(b => b.index));
        }
    }

    //handles input value change
    handleInputChange(event) {
        let index = event.target.dataset.id;
        let fieldName = event.target.name;
        let value = event.target.value;
        if(this.activeTab === 'Params'){
            if(this.maxIndexOfParam === parseInt(index)){
                this.createRow(this.listOfParams);
                this.isPButtonVisible = true;
            }
            for(let i = 0; i < this.listOfParams.length; i++) {
                if(this.listOfParams[i].index === parseInt(index)) {
                    this.listOfParams[i][fieldName] = value;
                }
            }
            this.maxIndexOfParam=Math.max(...this.listOfParams.map(p => p.index));
        }
        if(this.activeTab === 'Headers'){
            console.log('max=='+this.maxIndexOfHeaders)//1
            console.log('current=='+index)//2
            if(this.maxIndexOfHeaders === parseInt(index)){
                this.createRow(this.listOfHeaders);
                this.isHButtonVisible = true;
            }
            for(let i = 0; i < this.listOfHeaders.length; i++) {
                if(this.listOfHeaders[i].index === parseInt(index)) {
                    this.listOfHeaders[i][fieldName] = value;
                }
            }
            this.maxIndexOfHeaders=Math.max(...this.listOfHeaders.map(h => h.index));
        }
        if(this.activeTab === 'Body'){
            if(this.maxIndexOfBody === parseInt(index)){
                this.createRow(this.listOfBody);
                this.isBButtonVisible = true;
            }
            for(let i = 0; i < this.listOfBody.length; i++) {
                if(this.listOfBody[i].index === parseInt(index)) {
                    this.listOfBody[i][fieldName] = value;
                }
            }
            this.maxIndexOfBody=Math.max(...this.listOfBody.map(b => b.index));
        }
    }

    //returns options for method combobox
    get methodOptions(){
        return [
            {label: 'GET',value: 'GET'},
            {label: 'POST',value: 'POST'}
        ]
    }

    //returns options for authorization type
    get authOptions(){
        return [
            {label: 'No Auth',value: 'No Auth'},
            {label: 'Bearer Token',value: 'Bearer Token'}
        ]
    }

    //handles url change value
    handleUrlChange(event){
        const name = event.target.name;
        if(name == 'combobox'){
            this.method = event.target.value;
        }if(name == 'inputBox'){
            this.url = event.target.value;
            if(this.url != null && this.url != ''){
                this.isSend = false;
            }
            else{
                this.isSend = true;
            }
        }
    }

    //handles active tab
    handleActiveTab(event){
        this.activeTab = event.target.label;
    }

    //creates an empty row
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

    //handles checkbox values
    handleCheckboxChange(event){
        const label = event.target.label;
        if(label == 'form-data'){
            this.checkedSecond = event.target.checked;
            this.isVisible = this.checkedSecond;
            this.checkedThird = false;
            this.checkedLast = false;
            this.isRaw = false;
        }else if(label == 'x-www-form-urlencoded'){
            this.checkedSecond = false;
            this.checkedThird = event.target.checked;
            this.isVisible = this.checkedThird;
            this.checkedLast = false;
            this.isRaw = false;
        }else if(label == 'raw'){
            this.jsonBody = '';
            this.checkedSecond = false;
            this.checkedThird = false;
            this.isVisible = false;
            this.checkedLast = event.target.checked;
            this.isRaw = this.checkedLast;
        }
    }

    //handles authorization combobox
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

    //handles raw body textarea
    handleJsonBody(event){
        this.jsonBody = event.target.value;
    }

    //handles button click
    handleClick(event){
        const name = event.target.name;
        if(name == 'send'){
            this.spinner = true;
            this.performSend();
        }else if(name == 'save'){
            this.performSave();
        }
    }

    performSend(){
        this.responseHeaders = [];
        let finalUrl = this.createFinalURL();
        if(this.isBearer && this.authIn2 != null && this.authIn2 != ''){
            this.setAuthValuesInHeader();
        }
        if(this.checkedThird){
            this.createFormEncodedBody();
        }
        this.makeCallout(finalUrl);
        console.log('headers==',this.responseHeaders)
    }

    performSave(){

    }

    createFinalURL(){
        let tempUrl = '';
        if(!this.url.endsWith('?')){
            tempUrl=this.url+'?';
        }
        for(let i=0;i<this.listOfParams.length;i++){
            if(this.listOfParams[i].Key != null && this.listOfParams[i].Key != ''){
                tempUrl += this.listOfParams[i].Key + '=' + this.listOfParams[i].Value + '&';
            }
        }
        return tempUrl = (tempUrl.slice(0,-1)).replace(' ','%20');
    }

    createFormEncodedBody(){
        this.jsonBody = '';
        for(let i=0;i<this.listOfBody.length;i++){
            if(this.listOfBody[i].Key != null && this.listOfBody[i].Key != ''){
                this.jsonBody += this.listOfBody[i].Key + '=' + this.listOfBody[i].Value + '&';
            }
        }
        this.jsonBody = this.jsonBody.slice(0,-1);
    }

    setAuthValuesInHeader(){
        if(!this.listOfHeaders.some(e => e.Key === 'Authorization')){
            // if(this.listOfHeaders.length === 0){
            //     this.listOfHeaders.push({index:1,Key:'Authorization',Value:'Bearer '+this.authIn2})
            // }
            // else{
            //     console.log('header length1=',this.listOfHeaders)
            //     this.listOfHeaders[0].index = this.listOfHeaders.length;
            //     this.listOfHeaders[0].Key = 'Authorization';
            //     this.listOfHeaders[0].Value = 'Bearer '+this.authIn2;
            // }
            if((this.listOfHeaders[this.listOfHeaders.length - 1].Key=='' || this.listOfHeaders[this.listOfHeaders.length - 1].Key==null) || (this.listOfHeaders[this.listOfHeaders.length - 1].Value=='' || this.listOfHeaders[this.listOfHeaders.length - 1].Value==null)){
                this.listOfHeaders[this.listOfHeaders.length - 1].index = this.listOfHeaders[this.listOfHeaders.length - 1].index+1;
                this.listOfHeaders[this.listOfHeaders.length - 1].Key = 'Authorization';
                this.listOfHeaders[this.listOfHeaders.length - 1].Value = 'Bearer '+this.authIn2;
                console.log('max2=='+this.maxIndexOfHeaders)
            }
            else{
                this.listOfHeaders.push({index:this.listOfHeaders[this.listOfHeaders.length - 1].index+1,Key:'Authorization',Value:'Bearer '+this.authIn2})
            }
            this.createRow(this.listOfHeaders);
            this.isHButtonVisible = true;
        }else{
            let ind = this.listOfHeaders.findIndex(x => x.Key ==="Authorization");
            this.listOfHeaders[ind].Value = 'Bearer '+this.authIn2;
            if((this.listOfHeaders[this.listOfHeaders.length - 1].Key!='' && this.listOfHeaders[this.listOfHeaders.length - 1].Key!=null) || (this.listOfHeaders[this.listOfHeaders.length - 1].Value!='' && this.listOfHeaders[this.listOfHeaders.length - 1].Value!=null)){
                this.createRow(this.listOfHeaders);
                this.isHButtonVisible = true;
            }
        }
        this.maxIndexOfHeaders=Math.max(...this.listOfHeaders.map(h => h.index));
    }

    makeCallout(finalUrl){
        getResponse({url:finalUrl,headers:this.listOfHeaders,method:this.method,body:this.jsonBody})
        .then(res=>{
            this.spinner = false;
            this.isResponse = true;
            this.response = res.resBody;
            this.statusCode = res.statusCode;
            for (var key in res.resHeaders) {
                this.responseHeaders = [...this.responseHeaders , {key:key,value:res.resHeaders[key]}];
            }
            console.log('map==',this.responseHeaders)
        })
    }
}