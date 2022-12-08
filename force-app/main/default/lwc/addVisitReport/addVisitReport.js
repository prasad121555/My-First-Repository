import { LightningElement, track } from 'lwc';
// const actions = [
//     { label: 'Delete', name: 'delete' },
// ];
const columns = [
    { Id: 1, label: 'Visit Date', fieldName: 'Visit_Date' },
    { Id: 2, label: 'Distributor/Dealer Name', fieldName: 'Distributor_Dealer_Name' },
    { Id: 3, label: 'Problem Reported/ Feedback', fieldName: 'Problem_Reported_Feedback' },
    { Id: 4, label: 'Remarks / Resolution', fieldName: 'Remarks_Resolution' },
    { Id: 5, label: 'Tentative Time of Closure', fieldName: 'Tentative_Time_of_Closure' },  
    {
        Id: 6,
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
  /* { type: 'button-icon',
    typeAttributes:
    {
        iconName: 'utility:delete',
        name: 'delete',
        iconClass: 'slds-icon-text-error'
    }
}*/
];

export default class AddVisitReport extends LightningElement {
    columns = columns;
    //rowOffset = 0;
    VisitDate='';
    DDName='';
    Feedback='';
    Remarks='';
    DOC='';
    saveButtonDisableFlag = true;
    AddButtonDisableFlag=true;
    showData = false;
    @track data = [];
    //@track index = 0;
    filter = `RecordType.Name='Distributor' OR RecordType.Name='Retailer'`
    AccountName='';
    AccountId;
    rowId = 1;

    handleChange(event){

        const name = event.target.name;
        if(name == 'Input1'){
            this.VisitDate = event.target.value;
        }
        if(name == 'Input3'){
            this.Feedback=event.target.value;
        }
        if(name == 'Input4'){
            this.Remarks=event.target.value;
        }
        if(name == 'Input5'){
            this.DOC=event.target.value;
        }
        this.validation();
        // handleDDChange(event){
        //     this.DDName=event.target.value;
        //     this.validation();
        // }
    }

    validation(){
        if(this.DOC!='' && this.DOC!=null && this.Remarks!='' && this.Remarks!=null && this.Feedback!='' && this.Feedback!=null 
           && this.AccountName!='' && this.AccountName!=null && this.VisitDate!='' && this.VisitDate!=null){
           this.AddButtonDisableFlag=false; 
        }
        else{
            this.AddButtonDisableFlag=true;
        }
    }

    handleAdd(){
        console.log('inside button click event>>')
        this.rowId = this.rowId + 1;
        if(this.DOC!='' && this.DOC!=null && this.Remarks!='' && this.Remarks!=null && this.Feedback!='' && this.Feedback!=null 
        && this.AccountName!='' && this.AccountName!=null && this.VisitDate!='' && this.VisitDate!=null){
            this.data = [...this.data,
                {
                    Id: this.rowId,
                    Visit_Date:this.VisitDate,
                    Distributor_Dealer_Name:this.AccountName,
                    Problem_Reported_Feedback:this.Feedback,
                    Remarks_Resolution:this.Remarks,
                    Tentative_Time_of_Closure:this.DOC
                }
            ];
            this.showData = true;
            this.saveButtonDisableFlag = false;
        }
    }


    handleAccountSelected(event){
        console.log(event.detail.recId)
        this.AccountId = event.detail.recId;
        this.AccountName = event.detail.recName;
        console.log('this.AccountId--->'+this.AccountId);
        console.log('AccountName-->'+this.AccountName);
        this.validation();
   }
   handleRemoveAccount(event){
       console.log('handle remove')
       this.AccountId='';
       this.AccountName='';
       console.log('after remove -->'+this.AccountId);
       console.log('after remove -->'+this.AccountName);
       this.validation();
   }

   handleRowAction(event) {
       const row = event.detail.row;
       console.log(row)
       this.data.splice(this.data.findIndex(dealer => row.Id === dealer.Id), 1);
       this.data = [...this.data]; 
        
       if(this.data == null || this.data == ''){
           this.showData = false;
           this.saveButtonDisableFlag = true;
       }
}

// removeRow(event){
//     console.log('data ',this.data)
//     console.log('remove row')
//     var selectedRow = event.currentTarget;
//     console.log('row '+selectedRow)
//     var key = selectedRow.dataset.id;
//     console.log('key '+key)
//     if(this.data.length>1){
//         this.data.splice(key, 1);
//         this.index--;
//        // this.isLoaded = false;
//     }else if(this.data.length == 1){
//         this.data = [];
//         this.index = 0;
//       //  this.isLoaded = false;
//     }

//     //this.dispatchEvent(new CustomEvent('deleterow', {detail: this.index}));
//     //console.log(' After adding Record List ', this.dispatchEvent);
// } 


}