public class DeliveredStatusRecordsHandler {
	@AuraEnabled()
    public static List<Order_Shipment__c> getDeliveredRecords(String enteredValue){
        System.debug('Entered values are: '+enteredValue);
        String invoice = '%'+enteredValue+'%';
        
        //List to return the Order_Shipment__c records
        List<Order_Shipment__c> orderList = new List<Order_Shipment__c>();
        orderList = [Select Name,Customer_Name__c,Invoice_Number__c,Total_Price__c,Shipment_Status__c from Order_Shipment__c 
                                             where Invoice_Number__c like:invoice and Shipment_Status__c != 'Delivered'];
        System.debug('order list: '+orderList);
        return orderList;
    }
}