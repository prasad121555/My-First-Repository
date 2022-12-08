public with sharing class AutoPopulate {
    @AuraEnabled
    public static List<Account> getNames() {
        List<Account> aList = [select id,name,Website from account limit 200];
        
        return aList;
    }
    
    @AuraEnabled
    public static Account populateInput(String nm) {
        Account a = [select id from account where name=:nm];
        return a;
    }
}
