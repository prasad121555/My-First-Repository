public class SaveButtonHandler {

    @AuraEnabled
    public static void updateOrders(String[] selectedRows){
        List<Order_Shipment__c> ordList = new List<Order_Shipment__c>();
        ordList = [Select Id, Shipment_Status__c from Order_Shipment__c where Id IN :selectedRows];
        for(Order_Shipment__c os : ordList){
        	os.Shipment_Status__c = 'Delivered';
        }
        update ordList;
    }
}