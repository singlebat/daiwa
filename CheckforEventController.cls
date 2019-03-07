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
                        GeneralEventDetailList.add(con.GeneralEventDetailContacts__r);
                    }
                }            
            }
            re.tempGeneralEventDetail=GeneralEventDetailList;
            re.itemsSize=re.tempGeneralEventDetail.size();
        }else{
            //編集できない場合   
			throw new AuraHandledException('you have no permission to edit this customer');
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
        sql=sql+ ' limit 200 ';
        system.debug(sql);
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