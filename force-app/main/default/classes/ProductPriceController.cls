public with sharing class ProductPriceController {
    
    @AuraEnabled
    public static List<Product2> getProducts(String pname)
    {
       
     List<Product2> listToreturn = [Select Id,(select UnitPrice from PricebookEntries), Name from Product2 where name=: pname];
     return listToreturn;

    }

    @AuraEnabled
    public static Account getAddress(String accname)
    {
       
     Account acc = [SELECT Id, BillingCity, BillingStreet, BillingState, BillingPostalCode, BillingCountry FROM Account where name =: accname
     ];
     return acc;

    }
}
