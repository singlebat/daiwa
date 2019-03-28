@isTest
public class NewLineChangeRepControllertest {
 static testMethod void NewLineChangeRepControllertest() {
        Test.startTest();
     	Profile profileId = [SELECT Id FROM Profile WHERE Name = 'システム管理者' LIMIT 1];
        //Create a User 
        User u=new User();
        u.Username='xxxxxxx@e.com';
        u.LastName='sss';
        u.Email='test1@exa.com';
        u.Alias='test1';
        u.CommunityNickname='aaaa';
        u.TimeZoneSidKey='Asia/Tokyo';
        u.LocaleSidKey='ja_JP';
        u.EmailEncodingKey='ISO-2022-JP';
        u.ProfileId=profileId.id;
        u.LanguageLocaleKey='ja';        
        insert u;
        //Create a account by front user
        Account na=new Account();   
        na.Name='test';
        //na.CreatedById=u.id;
        insert na;         
        system.debug(na.CreatedById);   
      	//create a Contact by front Account
        Contact con = new Contact();
        con.AccountId=na.id;
        con.LastName='test';
        insert con;  
        //create a LineChanging__c by front Contact
        LineChanging__c lc=new LineChanging__c();
     	lc.Contact__c=con.id;
     	lc.AnnounceDate__c=Date.newInstance(2019, 2, 17);
        lc.InaugurationDate__c=Date.newInstance(2019, 2, 17);
        insert lc;

     
      	NewLineChangeRepController.getAccount(lc.id);
        Test.stopTest();
    }
}