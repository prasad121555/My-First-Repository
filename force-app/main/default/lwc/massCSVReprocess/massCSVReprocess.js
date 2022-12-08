import { LightningElement} from 'lwc';
export default class MassCSVReprocess extends LightningElement {
    yearValue;
    monthValue;
    year;
    previousYear;
    nextYear;


    get monthOptions() {
        return [
                 { label: 'Jan', value: 'Jan' },
                 { label: 'Feb', value: 'Feb' },
                 { label: 'Mar', value: 'Mar' },
                 { label: 'May', value: 'May' },
                 { label: 'Jun', value: 'Jun' },
                 { label: 'Jul', value: 'Jul' },
                 { label: 'Aug', value: 'Aug' },
                 { label: 'Sep', value: 'Sep' },
                 { label: 'Oct', value: 'Oct' },
                 { label: 'Nov', value: 'Nov' },
                 { label: 'Dec', value: 'Dec' },
               ];
    }


    get yearOptions() {
        let dt = new Date();
        
        this.year = dt.getFullYear().toString();
        this.previousYear = (dt.getFullYear()-1).toString();
        this.nextYear = (dt.getFullYear()+1).toString();
        return [
                 { label: this.previousYear, value: this.previousYear},
                 { label: this.year, value: this.year },
                 { label: this.nextYear, value: this.nextYear },
               ];
    }

    connectedCallback(){
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];

        let d = new Date();
        this.monthValue = monthNames[d.getMonth()];

        this.yearValue = d.getFullYear().toString();
        
    }

    handleChangeMonth(event){
        
    }
    handleChangeYear(event){
        this.yearValue = event.detail.value;
        console.log('prevYear=='+this.previousYear);
        console.log('currentYear=='+this.year);
        console.log('nextYear=='+this.nextYear);
        console.log('value=='+this.yearValue);
    }
    handleReprocess()
    {
        reprocess({month:this.monthValue , year:this.yearValue}).then(data=>{

        })
    }
}