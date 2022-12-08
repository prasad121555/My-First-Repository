import { api, LightningElement, track, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import { CloseActionScreenEvent } from 'lightning/actions';
import getRewardsPoint from '@salesforce/apex/RewardsPointAPI.getRewardsPoint';

const columns = [
    { label: 'description', fieldName:'description' },
    { label: 'discount_code', fieldName:'discount_code' },
    { label: 'discount_price', fieldName: 'discount_price' },
    { label: 'internal_note', fieldName: 'internal_note' },
    { label: 'order_id', fieldName: 'order_link',type: 'url',typeAttributes: {label: {fieldName:'order_id'}, value: {fieldName:'order_link'}}},
    { label: 'points_change', fieldName: 'points_change' },
    { label: 'updated_at', fieldName: 'updated_at',type: 'date', 
    typeAttributes: {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    } }
   
];

export default class RewardHistory extends LightningElement {
    @api recordId;
    @track accId;
    @track accName;
    @track accEmail;
    @track rewardPointsList;
    @track rewardPoints;
    @track show200=true;
    @track show401=false;
    @track show500=false;
    @track showOther=false;
    @track columns=columns;
    @track addSpinner=false
    @track totalPoints;

    @wire(getRecord, { recordId: '$recordId', fields: ['Account.Id','Account.Name','Account.PersonEmail'] })
    wiredAccount({ error, data }) {
        if (data) {
            this.record = data;
            console.log('Data-->',data);
            this.accId=this.record.fields.Id.value;
            this.accName=this.record.fields.Name.value;
           // this.accEmail=this.record.fields.PersonEmail.value;
            this.accEmail='usman.ansari@borosil.com';            
            this.error = undefined;
            console.log('Account id-->',this.accId);
            console.log('Account Name-->',this.accName);
            console.log('Account Email-->',this.accEmail);
            this.rewardPointsDetail();
        } else if (error) {
            console.log('no Data');
            this.error = error;
            this.record = undefined;
        }
    }

    rewardPointsDetail(){
        this.addSpinner=true;
        getRewardsPoint({accEmail:this.accEmail})
        .then(result => {
            this.rewardPoints=result;
            this.totalPoints=this.rewardPoints.totalPoints;
            this.rewardPointsList=result.RewardsPointWrapperList;
            console.log('rewardPoints-->'+this.rewardPoints);
            this.addSpinner=false;
            this.showHideErrorTemplates();
        }).catch(error => {
            console.log(error);
        })
    }
    showHideErrorTemplates(){
        if(this.rewardPoints.statusCode == 200){
            this.show200=true;
        }else if(this.rewardPoints.statusCode == 401){
            this.show200=false;
            this.show401=true;
        }else if(this.rewardPoints.statusCode == 500){
            this.show200=false;
            this.show500=true;
        }else{
            this.show200=false;
            this.showOther=true;
        }
    }
    closeAction(){
        this.dispatchEvent(new CloseActionScreenEvent());
    }
}