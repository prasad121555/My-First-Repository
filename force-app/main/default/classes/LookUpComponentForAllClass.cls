public without sharing class LookUpComponentForAllClass {
    @AuraEnabled
    public static List<Search1> searchedList(String obj,String name,String value){
       
        System.debug('Name'+name);
        System.debug('Value'+value);
        System.debug('obj is'+obj);
        List<Search1> serachlist = new List<Search1>();
        List<SObject> alst;
        if(value == null || value==''){
            System.debug('value null');
            alst = Database.query('select id,'+name+' from '+obj+' limit 5');
        }else{
            //System.debug('select id,'+name+' from '+obj+' where '+name+' like \''+value+'%\' Limit 5');
            alst = Database.query('select id,'+name+' from '+obj+' where '+name+' like \''+value+'%\' Limit 5');                                  
            /* alst = Database.query('select id,'+name+' from '+obj+' where '+name+' like \'%'+value+'%\' Limit 50');*/
        }
        System.debug('size of list'+alst.size());
       

        for(SObject a : alst)
        {
                String fieldname = (String)a.get(name);
                serachlist.add(new Search1(fieldname,a.Id));
        }
        return serachlist;
    }

       
    public class Search1{
       
        @AuraEnabled
        public String recName;

        @AuraEnabled
        public ID recId;
        public Search1(String recNametemp,ID recIdtemp)
        {
            recName = recNametemp;
            recId = recIdtemp;
        }
    }
}