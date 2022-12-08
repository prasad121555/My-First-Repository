import { api, LightningElement, track } from 'lwc';
import searchedList from '@salesforce/apex/LookUpComponentForAllClass.searchedList';

export default class LookUp extends LightningElement {
    /* for product */
    @api nm;
    @api value;
    @api sobject;
    @api fieldname;
    @api recordId;
    @track flag=false;
    @track is_multiple=true;
    @track searchRecords = undefined;
    @track selectedRecords = [];
    @track selectrecordname = [];
    @track message = false;
    @track recordData = [];
    @track single_selectedRec;
    @track btn_clear = false;
    @track showInput=true;

    searchField(event) {
        console.log("js method called ",event.target.value);
        const text = event.target.value;
        console.log("sobject ",this.sobject);
        console.log("fieldname ",this.fieldname);
        searchedList({ obj: this.sobject, name: this.fieldname, value: text })
            .then(data => {
                this.flag = true;
                this.message = false;
                this.searchRecords = data;
                console.log("class method called ");
                console.log("search records", this.searchRecords);

                if (data.length === 0) {
                    this.searchRecords = undefined;
                    console.log("no data");
                    this.message = true;
                    this.flag = false;
                }
            }).catch(error => {
                console.log("Error ", error);
            })
    }

    setSelectedrecord(event) {

        const recid = event.target.dataset.val;
        const recname = event.target.dataset.name;
        console.log('recid',event.target.dataset.val);
        console.log('recname',event.target.dataset.name);
        
        
        if (this.is_multiple === true) {
            let newObj = { 'recId': recid, 'recName': recname };
            let dublele = this.selectedRecords.find(obj => obj.recName === newObj.recName);
            console.log("double")
            if (dublele === undefined) {
                console.log("inside if");
                const selectEvent = new CustomEvent('selected',{detail:newObj});
                this.dispatchEvent(selectEvent);    
                this.selectedRecords.push(newObj);
                this.recordData.push(recid);
                this.btn_clear = true;
            }
            this.flag = false;
            this.showInput=false;
        } else {
            console.log("inside else");
            const selectEvent = new CustomEvent('selected',{detail:newObj});
            this.dispatchEvent(selectEvent); 
            this.single_selectedRec = recname;
            this.flag = false;
        }

    }

    removeHandler(event) {
        console.log('Remove');
        const del = event.target.dataset.val;
        console.log("items " + this.recordData);
        let sel_rec = this.recordData;
        let records = this.selectedRecords;
        records.splice(del, 1);
        sel_rec.splice(del, 1);
        this.selectedRecords = records;
        this.recordData = sel_rec;
        this.showInput=true;
        console.log("deleted item " + this.recordData);
        if (this.recordData.length === 0) {
            this.btn_clear = false;
        }
        const removeEvent = new CustomEvent('removehandler',{detail:this.selectedRecords});
        this.dispatchEvent(removeEvent);

    }

    
   focusOut_event() {
        if (this.mouse_leave === true) {
            this.flag = false;
        } else {
            console.log("hello");
        }
    }

    mouseIn() {
        this.mouse_enter = true;
        this.mouse_leave = false;
        console.log("mouse enter", this.mouse_enter);
    }
    mouseOut() {
        this.mouse_leave = true;
        this.mouse_enter = false;
        console.log("mouse enter", this.mouse_enter);
    }
    removeSingleHandler() {
        this.is_multiple = true;
    }
}