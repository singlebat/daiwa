public class NewLineChangeRepController {
  	@AuraEnabled
    public static String getAccount(String LineChangingId)
    {	
        String d=null;
        LineChanging__c c;
        system.debug(LineChangingId);
        if(LineChangingId!=null && LineChangingId!=''){
            c=[select Contact__r.Account.id from LineChanging__c where id=:LineChangingId];
            d=c.Contact__r.Account.id;
        }
        return d;
    }
}