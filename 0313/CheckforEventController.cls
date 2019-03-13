public class CheckforEventController {
    public class result{
        @AuraEnabled 
        public  List<GeneralEventDetail__c> tempGeneralEventDetail;   
        @AuraEnabled 
        public  Integer itemsSize;
    }
    @AuraEnabled
    public static List<String> initpicklist()
    {   
        List<String> picklists=GetFieldPikclistValues('GeneralEventDetail__c', 'Status__c');
        system.debug(picklists);
        return picklists;
    }
    
    @AuraEnabled
    public static Boolean initSaveButton(Id generalEventId)
    {   
        GeneralEvent__c tempgen=[select id,InputLimitDate__c from GeneralEvent__c where id=:generalEventId];      
        if(tempgen.InputLimitDate__c==null){
            return true; 
        }
        if(tempgen.InputLimitDate__c<date.today()){
            return false;
        }else{
            return true;            
        }
    }
    
    @AuraEnabled
    public static result getItems(Id generalEventId,String AccountId,String conName,String InChargeDepartment,String RelationshipManagement,String userid)
    {   
        result re=new result();
        List<GeneralEventDetail__c> GeneralEventDetailList= new List<GeneralEventDetail__c>();
        String query ='SELECT RecordId, HasReadAccess, HasEditAccess FROM UserRecordAccess WHERE RecordId = \'';
        query +=String.escapeSingleQuotes(String.valueOf(AccountId))+'\' AND UserId = \''+userid+'\'';
        UserRecordAccess urd=Database.query(query);
        //権限の判定、もし編集できたら
        if( urd.HasEditAccess==true){
            List<Contact> newContact= getContact(generalEventId,AccountId,conName,InChargeDepartment,RelationshipManagement);
            if(newContact!=null &&newContact.size()!=0){
                for(Contact con:newContact){
                    if(con.GeneralEventDetailContacts__r==null||con.GeneralEventDetailContacts__r.size()==0){
                        GeneralEventDetail__c gen=new GeneralEventDetail__c();
                        gen.Check__c=false;
                        gen.selected__c=false;
                        gen.Contact__c=con.id;
                        gen.profileNameForEventDetail__c=con.Name;
                        gen.profilesortedForEvent__c=con.ProfileNo__c;
                        gen.DepartmentForEventDetail__c=con.Department;
                        GeneralEventDetailList.add(gen);
                    }else{
                        try{
                            GeneralEventDetailList.add(con.GeneralEventDetailContacts__r);
                        }catch(exception e){
                            system.debug('DML Search Result Error'+e);
                            throw new  QueryException('DML Search Result Error');
                        }
                    }
                }            
            }
            re.tempGeneralEventDetail=GeneralEventDetailList;
            re.itemsSize=re.tempGeneralEventDetail.size();
        }else{
            //編集できない場合   
            throw new AuraHandledException('no prority');
        }
        
        return re;
    }
    
    public static List<Contact> getContact(Id generalEventId,String AccountId,String conName,String InChargeDepartment,String RelationshipManagement) { 
        String sql='select id, ';
        sql=sql+ 'Name,';
        sql=sql+ 'ProfileNo__c,';
        sql=sql+ 'Department,';
        sql=sql+ '(select ';
        sql=sql+ 'id, ';
        sql=sql+ 'Contact__c, ';
        sql=sql+ 'ProfileName__c, ';
        sql=sql+ 'Department__c, ';
        sql=sql+ 'ProfileSortOrder__c, ';        
        sql=sql+ 'Check__c, ';
        sql=sql+ 'Remark__c, ';
        sql=sql+ 'Status__c, ';
        sql=sql+ 'selected__c, ';
        sql=sql+ 'LastModifiedDate, ';
        sql=sql+ 'CreatedDate ';
        sql=sql+ 'from GeneralEventDetailContacts__r ';
        sql=sql+ 'where GeneralEvent__c= \''+generalEventId+'\' ';       
        sql=sql+ ') child ';
        sql=sql+ 'from Contact ';
        sql=sql+ 'where AccountId=\''+AccountId+'\' ';
        if(conName!=null &&conName!=''){
            sql=sql+ ' and Name like \'%'+conName+'%\' '; 
        }
        if(InChargeDepartment!=null &&InChargeDepartment!=''){
            sql=sql+ ' and Account.InChargeDepartment__c=\''+InChargeDepartment+'\' '; 
        }
        if(RelationshipManagement!=null &&RelationshipManagement!=''){
            sql=sql+ ' and Account.RelationshipManagement__c=\''+RelationshipManagement+'\' '; 
        }
        sql=sql+ ' limit 500 ';   
        system.debug(sql);
        List<Contact> newContact= new List<Contact>();
        try{
            newContact=Database.query(sql);
        }catch(exception e){
            throw new AuraHandledException('DML Search Error');
        }
        return newContact;
    }
    
    @AuraEnabled
    public static void saveItems(String saveresult) { 
        system.debug(saveresult);
        List<GeneralEventDetail__c> saveList = (List<GeneralEventDetail__c>)System.JSON.deserializeStrict(saveresult,List<GeneralEventDetail__c>.Class);
        for(GeneralEventDetail__c ge:saveList){
            ge.selected__c=false;
        }
        upsert saveList;
    }
    
    public Static List<String> GetFieldPikclistValues(String ObjectApi_name, String picklistField)
    {
        Schema.SObjectType targetType = Schema.getGlobalDescribe().get(ObjectApi_name);
        Sobject Object_name = targetType.newSObject();
        Schema.sObjectType sobject_type = Object_name.getSObjectType();
        Schema.DescribeSObjectResult sobject_describe = sobject_type.getDescribe();
        Map<String, Schema.SObjectField> field_map = sobject_describe.fields.getMap();
        List<Schema.PicklistEntry>  controllingFieldValues = field_map.get(picklistField).getDescribe().getPickListValues();
        list<String> values =  new  list<String>();
        for (Schema.PicklistEntry pklVal : controllingFieldValues){
            values.add(pklVal.getValue());  
        }
        return values;
    }
    
}