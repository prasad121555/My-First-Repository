import { LightningElement, wire, track } from 'lwc';
import retrieveAccounts from '@salesforce/apex/CalendarController.retrieveAccounts';
import getaccountevents from '@salesforce/apex/CalendarController.getaccountevents';

export default class Calender extends LightningElement {
    yearInt;
    monthInt;
    @track yearOpts = [];
    flagt= false;
    @track selectedMonths;
    @track selectedYear;
    outerMap;
    days;
    show29 = false;
    show30 = false;
    show31 = false;
    daysInMonth = [];
    accSpinner = false;
    recentCount;
    @track customClass;
    @track color29;
    @track color30;
    @track color31;

    get optionsM(){
        return [
            {label: 'January', value:'1'},
            {label: 'February', value:'2'},
            {label: 'March', value:'3'},
            {label: 'April', value:'4'},
            {label: 'May', value:'5'},
            {label: 'June', value:'6'},
            {label: 'July', value:'7'},
            {label: 'August', value:'8'},
            {label: 'September', value:'9'},
            {label: 'October', value:'10'},
            {label: 'November', value:'11'},
            {label: 'December', value:'12'}
        ];
    }


    get optionsY(){
        const yearVal = 1995;
        //For 200 years
        for(var i = 1; i<201; i++){
            this.yearOpts=[...this.yearOpts,
                { label: (yearVal+i).toString(), value: (yearVal+i).toString() }
            ];
        }
        console.log('yearOpts==',this.yearOpts);
        return this.yearOpts;
    }

    connectedCallback(){
        const cdt = new Date();
        this.selectedMonths = (cdt.getMonth()+1).toString();
        this.monthInt = parseInt(this.selectedMonths);
        this.selectedYear = cdt.getFullYear().toString();
        this.yearInt = parseInt(this.selectedYear);
        this.accSpinner = true;
        this.customCss();
        
        retrieveAccounts()
        .then(result=>{
            console.log('accs==',result);
            this.data=result;
            this.validate();
        })
    }

    handleMonth(event) {
        this.selectedMonths = event.target.value;
        this.monthInt = parseInt(this.selectedMonths);
        this.accSpinner = true;
        this.daysInMonth = [];
        this.customCss();
        this.validate();
    }

    handleYear(event){
        console.log('inside year');
        this.selectedYear = event.target.value;
        this.yearInt = parseInt(this.selectedYear);
        this.accSpinner = true;
        this.daysInMonth = [];
        this.customCss();
        this.validate();
    }

    noOfDaysInMonth(){
        if(this.selectedMonths== '1' || this.selectedMonths=='3' || this.selectedMonths=='5' ||
            this.selectedMonths=='7' || this.selectedMonths=='8' || this.selectedMonths=='10' ||
            this.selectedMonths=='12'){
            this.days = 31;
            this.show29 = true;
            this.show30 = true;
            this.show31 = true;
        }
        else if(this.selectedMonths== '4' || this.selectedMonths=='6' || this.selectedMonths=='9' ||
            this.selectedMonths=='11' ){
            this.days = 30;
            this.show29 = true;
            this.show30 = true;
            this.show31 = false;
        }
        else if(this.selectedMonths== '2'){
            if((this.yearInt%4==0)&&((this.yearInt%100!=0)||(this.yearInt%400==0))){
                this.days = 29;
                this.show29 = true;
                this.show30 = false;
                this.show31 = false;
            }
            else{
                this.days = 28;
                this.show29 = false;
                this.show30 = false;
                this.show31 = false;
            }
        }
    }

    customCss(){
        const dt = new Date();
        console.log('dt=='+dt.getMonth());

        for(var i = 1;i<=28;i++){
            
            if(dt.getDate() == i && dt.getFullYear() == this.yearInt && (dt.getMonth()+1) == this.monthInt){
                console.log('inside style====')
                this.customClass = "redColor";
            }
            else{
                console.log('not inside style====')
                this.customClass = "blackColor";
            }
            this.daysInMonth.push({key:i,value:i,css:this.customClass});
        }
        if(dt.getFullYear() == this.yearInt && (dt.getMonth()+1) == this.monthInt){
            if(dt.getDate()==29){
                this.color29 = "redColor";
            }
            else if(dt.getDate()==30){
                this.color30 = "redColor";
            }
            else if(dt.getDate()==31){
                this.color31 = "redColor";
            }
            else{
                this.color29 = "blackColor";
                this.color30 = "blackColor";
                this.color31 = "blackColor";
            }
        }
    }

    validate(){
        console.log('inside log');
        console.log(this.selectedMonths);
        console.log(this.selectedYear);

        if(this.selectedMonths!=null && this.selectedYear!=null){
            this.flagt= true;
            this.noOfDaysInMonth();
            getaccountevents({ListOfAccIds : this.data,Month : this.monthInt,Year : this.yearInt,NoOfDays : this.days})
            .then(result=>{
                this.accSpinner = false;
                console.log('result=====',result);
                this.outerMap = [];
                console.log('result', result);
                
                for (var key in result) {
                    let innerMap = [];
                    this.recentCount = 0;
                    console.log('inside for1==',result[key])
                    for (var innerkey in result[key]) {
                        
                        innerMap.push({ key: innerkey, value: result[key][innerkey] });
                        console.log('inside for2==',result[key][innerkey]);
                        this.recentCount = this.recentCount + result[key][innerkey];
                    }

                    //this.totalMeets.push({key: key, value:this.recentCount});
                    this.outerMap.push({ key: this.data[key], value: innerMap, total: this.recentCount });
                    console.log('key', this.outerMap);
                }
            })
        }
    }
}