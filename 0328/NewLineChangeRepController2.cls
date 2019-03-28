public class NewLineChangeRepController2 {
    public class result{
        @AuraEnabled 
        public String LineChangingId ; 
        @AuraEnabled 
        public  String AccountId;
    }
    @AuraEnabled
    public static result getAccount(String ContactId)
    {
        result re=new result();
        if(ContactId!=null && ContactId!=''){
            Contact c=[select Account.id,(select id,AnnounceDate__c from LineChangingContacts__r order by AnnounceDate__c desc limit 1) from Contact where id=:ContactId];
            re.AccountId=c.Account.id;
            if(c.LineChangingContacts__r[0]!=null){
                re.LineChangingId=c.LineChangingContacts__r[0].id;
            }else{
                re.LineChangingId=null;
            }
        }
        system.debug(re);
        return re;
    }
}