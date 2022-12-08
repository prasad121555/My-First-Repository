public with sharing class ModelBoxClass {
    @AuraEnabled
    public static List<Product2> getFreeProducts(String prodNames){
        system.debug('prodNames=='+prodNames);
        List<Product2> listToreturn = [select name from product2 where Parent_Product__c =: prodNames];
        system.debug('listToreturn=='+listToreturn);
        return listToreturn;
    }
}
