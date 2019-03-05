public class CheckforEventController {
    public class result{
        @AuraEnabled 
        public  List<GeneralEventDetail__c> tempGeneralEventDetail;   
        @AuraEnabled 
        public  Integer itemsSize;
    }
    @AuraEnabled
    public static result getItems(Id generalEventId,String AccountId,String conName,String InChargeDepartment,String RelationshipManagement)
    {   
        result re=new result();
        List<String> profileIDs=new List<String>();
        //イベント詳細情報をゲットする
        List<GeneralEventDetail__c> GeneralEventDetailList=getGeneralEventDetail(generalEventId,AccountId,conName,InChargeDepartment,RelationshipManagement);
        if(GeneralEventDetailList!=null &&GeneralEventDetailList.size()!=0){
            for(GeneralEventDetail__c ge:GeneralEventDetailList){
                if(!profileIDs.contains(ge.Contact__c)){
                    profileIDs.add(ge.Contact__c);
                }
            }            
        }
        system.debug(re.tempGeneralEventDetail);
        List<Contact> newContact= getContact(generalEventId,AccountId,conName,InChargeDepartment,RelationshipManagement);
        if(newContact!=null &&newContact.size()!=0){
            for(Contact con:newContact){
                if(!profileIDs.contains(con.id)){
                    GeneralEventDetail__c gen=new GeneralEventDetail__c();
                    gen.Check__c=false;
                    gen.selected__c=false;
                    gen.Contact__c=con.id;
                    gen.profileNameForEventDetail__c=con.Name;
                    GeneralEventDetailList.add(gen);
                }
            }            
        }
        re.tempGeneralEventDetail=GeneralEventDetailList;
        re.itemsSize=re.tempGeneralEventDetail.size();
        return re;
    }
    
    public static List<GeneralEventDetail__c> getGeneralEventDetail(Id generalEventId,String AccountId,String conName,String InChargeDepartment,String RelationshipManagement) { 
        String sql='select id, ';
        sql=sql+ 'Contact__c, ';
        sql=sql+ 'ProfileName__c, ';
        sql=sql+ 'Check__c, ';
        sql=sql+ 'Remark__c, ';
        sql=sql+ 'Status__c, ';
        sql=sql+ 'selected__c, ';
        sql=sql+ 'LastModifiedDate, ';
        sql=sql+ 'LastModifiedByName__c, ';
        sql=sql+ 'CreatedDate, ';
        sql=sql+ 'CreatedByName__c ';
        sql=sql+ 'from GeneralEventDetail__c ';
        sql=sql+ 'where GeneralEvent__c= \''+generalEventId+'\' ';
        if(AccountId!=null &&AccountId!=''){
            sql=sql+ ' and Contact__r.AccountId=\''+AccountId+'\' '; 
        }
        if(conName!=null &&conName!=''){
            sql=sql+ ' and Contact__r.Name like \'%'+conName+'%\' '; 
        }
        if(InChargeDepartment!=null &&InChargeDepartment!=''){
            sql=sql+ ' and Contact__r.Account.InChargeDepartment__c=\''+InChargeDepartment+'\' '; 
        }
        if(RelationshipManagement!=null &&RelationshipManagement!=''){
            sql=sql+ ' and Contact__r.Account.RelationshipManagement__c=\''+RelationshipManagement+'\' '; 
        }
        sql=sql+ 'order by LastModifiedDate ';
        sql=sql+ 'limit 200 ';
        return Database.query(sql);
    }
    
    
    public static List<Contact> getContact(Id generalEventId,String AccountId,String conName,String InChargeDepartment,String RelationshipManagement) { 
        String sql='select id, ';
        sql=sql+ 'Name ';
        sql=sql+ 'from Contact ';
        sql=sql+ 'where isdeleted=false';
        if(AccountId!=null &&AccountId!=''){
            sql=sql+ ' and AccountId=\''+AccountId+'\' '; 
        }
        if(conName!=null &&conName!=''){
            sql=sql+ ' and Name=\'%'+conName+'%\' '; 
        }
        if(InChargeDepartment!=null &&InChargeDepartment!=''){
            sql=sql+ ' and Account.InChargeDepartment__c=\''+InChargeDepartment+'\' '; 
        }
        if(RelationshipManagement!=null &&RelationshipManagement!=''){
            sql=sql+ ' and Account.RelationshipManagement__c=\''+RelationshipManagement+'\' '; 
        }
        sql=sql+ ' limit 200 ';
        return Database.query(sql);
    }
    
    @AuraEnabled
    public static void saveItems(String saveresult) { 
        List<GeneralEventDetail__c> saveList = (List<GeneralEventDetail__c>)System.JSON.deserializeStrict(saveresult,List<GeneralEventDetail__c>.Class);
        system.debug(saveList);
        for(GeneralEventDetail__c ge:saveList){
            ge.selected__c=false;
        }
        upsert saveList;
    }
    
}