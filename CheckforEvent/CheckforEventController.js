({
    init: function (component, event, helper) {
        //画面初期化の状態を記録する
        component.set("v.count",1);
    },
    doSearch: function (component, event, helper) {
        //検索条件をゲット
        //顧客ID
        var AccountId= component.get("v.simpleContact.AccountId");
        //氏名
        var conName= component.get("v.conName");
        //RM担当部署
        var InChargeDepartment= component.get("v.simpleAccount.InChargeDepartment__c");
        //RM担当者
        var RelationshipManagement= component.get("v.simpleAccount.RelationshipManagement__c");
        //自分
        var myBool= component.get("v.myBool");
        //自分を選択する場合
        if(myBool){
            RelationshipManagement=  $A.get('$SObjectType.CurrentUser.Id');
            InChargeDepartment=null;
        }
        var action = component.get("c.getItems");
        //GeneralEvent__c id
        action.setParams({"generalEventId": component.get("v.recordId"),
                          "AccountId": AccountId,
                          "conName": conName,
                          "InChargeDepartment": InChargeDepartment,
                          "RelationshipManagement": RelationshipManagement
                         });
        action.setCallback(this, $A.getCallback(function (response) {
            var state = response.getState();
            if (state === "SUCCESS") 
            {   
                var result = response.getReturnValue();
                component.set('v.items',result.tempGeneralEventDetail);
                //画面初期化ではない状態を記録する
                component.set("v.count",3);
                component.set('v.itemsSize',result.itemsSize);
                console.log('--result:' + response.getReturnValue());
            } 
            else if (state === "ERROR") 
            {
                var errors = response.getError();
                console.error(errors);
            }
        }));
        $A.enqueueAction(action);
    },
    doSave: function (component, event, helper) {
        var saveresult=[];
        var items=component.get('v.items');
        var itemssize=component.get('v.itemsSize');
        var eventID=component.get("v.recordId");
        for(var i = 0;  i < itemssize;  i++ ){
            //選択された列だけが対象になる
            if(items[i].selected__c){
                items[i].GeneralEvent__c=eventID;
            	saveresult.push(items[i]);
            }
        }
         var action = component.get("c.saveItems");
        //GeneralEvent__c id
        action.setParams({"saveresult": JSON.stringify(saveresult),
                         });
        action.setCallback(this, $A.getCallback(function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {   
               var toastEvent = $A.get("e.force:showToast");
    			toastEvent.setParams({
    				"title": "成功!",
    				"message": "保存しました。",
    				"type":"success"
    			});
    			toastEvent.fire();
            } else if (state === "ERROR") {
				var toastEvent = $A.get("e.force:showToast");
    			toastEvent.setParams({
    				"title": "失敗!",
    				"message": "保存できませんでした。",
    				"type":"fail"
    			});
    			toastEvent.fire();
            }
        }));
        $A.enqueueAction(action);
    },
    oneClick: function (component, event, helper) {
        var onecheck=component.get('v.onecheck');
        var biko=component.get('v.biko');
        var items=component.get('v.items');
        var status=component.get('v.status');
        var itemssize=component.get('v.itemsSize');
        
        for(var i = 0;  i < itemssize;  i++ ){
            //選択された列だけが対象になる
            if(items[i].selected__c){
                if(onecheck){
                    items[i].Check__c=true;
                }else{
                    items[i].Check__c=false;
                }
                items[i].Remark__c=biko;
                if(status!=null&&status!=''){
                    items[i].Status__c=status;
                }
            }
        }
        component.set('v.items',items);
    },    
    selectAll: function (component, event, helper) {
        var checkedvalue=component.get('v.selectall');
        var items=component.get('v.items');
        var itemssize=component.get('v.itemsSize');
        for(var i = 0;  i < itemssize;  i++ ){
            if(checkedvalue){
                items[i].selected__c=true;
            }else{
                items[i].selected__c=false;
            }
        }
        component.set('v.items',items);
    },    
    sortprofile: function (component, event, helper) {
        helper.doAction(component,"profile");
        $A.util.addClass(component.find("divHelpCheck"), 'slds-hide');
        $A.util.removeClass(component.find("divHelpPro"), 'slds-hide');
        $A.util.addClass(component.find("divHelpStatus"), 'slds-hide');
        $A.util.addClass(component.find("divHelpST"), 'slds-hide');
        $A.util.addClass(component.find("divHelpTime"), 'slds-hide');
        $A.util.addClass(component.find("divHelpBK"), 'slds-hide');
        
        component.set("v.flagST","true");
        component.set("v.flagC","true");
        component.set("v.flagS","true");
        component.set("v.flagBK","true");
        component.set("v.flagP","false");
        component.set("v.flagTime","true");
    },
    sortCheck: function (component, event, helper) {
        helper.doAction(component,"Check");
        $A.util.removeClass(component.find("divHelpCheck"), 'slds-hide');
        $A.util.addClass(component.find("divHelpPro"), 'slds-hide');
        $A.util.addClass(component.find("divHelpStatus"), 'slds-hide');
        $A.util.addClass(component.find("divHelpST"), 'slds-hide');
        $A.util.addClass(component.find("divHelpTime"), 'slds-hide');
        $A.util.addClass(component.find("divHelpBK"), 'slds-hide');
        
        component.set("v.flagST","true");
        component.set("v.flagS","true");
        component.set("v.flagC","false");
        component.set("v.flagBK","true");
        component.set("v.flagP","true");
        component.set("v.flagTime","true");
    },
    sortStatus: function (component, event, helper) {
        helper.doAction(component,"Status");
        $A.util.addClass(component.find("divHelpCheck"), 'slds-hide');
        $A.util.addClass(component.find("divHelpPro"), 'slds-hide');
        $A.util.removeClass(component.find("divHelpStatus"), 'slds-hide');
        $A.util.addClass(component.find("divHelpST"), 'slds-hide');
        $A.util.addClass(component.find("divHelpTime"), 'slds-hide');
        $A.util.addClass(component.find("divHelpBK"), 'slds-hide');
        
        component.set("v.flagST","true");
        component.set("v.flagC","true");
        component.set("v.flagP","true");
        component.set("v.flagS","false");
        component.set("v.flagBK","true");
        component.set("v.flagTime","true");
    },
    sortST: function (component, event, helper) {
        helper.doAction(component,"ST");
        $A.util.addClass(component.find("divHelpCheck"), 'slds-hide');
        $A.util.addClass(component.find("divHelpPro"), 'slds-hide');
        $A.util.addClass(component.find("divHelpStatus"), 'slds-hide');
        $A.util.removeClass(component.find("divHelpST"), 'slds-hide');
        $A.util.addClass(component.find("divHelpTime"), 'slds-hide');
        $A.util.addClass(component.find("divHelpBK"), 'slds-hide');
        
        component.set("v.flagST","false");
        component.set("v.flagC","true");
        component.set("v.flagP","true");
        component.set("v.flagS","true");
        component.set("v.flagBK","true");
        component.set("v.flagTime","true");
    },
     sortBK: function (component, event, helper) {
        helper.doAction(component,"BK");
        $A.util.addClass(component.find("divHelpCheck"), 'slds-hide');
        $A.util.addClass(component.find("divHelpPro"), 'slds-hide');
        $A.util.addClass(component.find("divHelpStatus"), 'slds-hide');
        $A.util.addClass(component.find("divHelpST"), 'slds-hide');
        $A.util.addClass(component.find("divHelpTime"), 'slds-hide');
        $A.util.removeClass(component.find("divHelpBK"), 'slds-hide');
         
        component.set("v.flagST","true");
        component.set("v.flagC","true");
        component.set("v.flagP","true");
        component.set("v.flagS","true");
        component.set("v.flagBK","false");
        component.set("v.flagTime","true");
    },
    sortTime: function (component, event, helper) {
        helper.doAction(component,"Time");
        $A.util.addClass(component.find("divHelpCheck"), 'slds-hide');
        $A.util.addClass(component.find("divHelpPro"), 'slds-hide');
        $A.util.addClass(component.find("divHelpStatus"), 'slds-hide');
        $A.util.addClass(component.find("divHelpST"), 'slds-hide');
        $A.util.removeClass(component.find("divHelpTime"), 'slds-hide');
        
        component.set("v.flagST","true");
        component.set("v.flagC","true");
        component.set("v.flagP","true");
        component.set("v.flagS","true");
        component.set("v.flagBK","true");
        component.set("v.flagTime","false");
    },
    MouseOverPro : function(component, event, helper){
        $A.util.removeClass(component.find("divHelpPro"), 'slds-hide');
    },
    MouseOverCheck : function(component, event, helper){
        $A.util.removeClass(component.find("divHelpCheck"), 'slds-hide');
    },
    MouseOverStatus : function(component, event, helper){
        $A.util.removeClass(component.find("divHelpStatus"), 'slds-hide');
    },
    MouseOverST : function(component, event, helper){
        $A.util.removeClass(component.find("divHelpST"), 'slds-hide');
    },
     MouseOverTime : function(component, event, helper){
        $A.util.removeClass(component.find("divHelpTime"), 'slds-hide');
    },
    MouseOverBK : function(component, event, helper){
        $A.util.removeClass(component.find("divHelpBK"), 'slds-hide');
    },
    MouseLeavePro: function(component, event, helper){
        var flagP=component.get("v.flagP");
        if(flagP=="true"){
            $A.util.addClass(component.find("divHelpPro"), 'slds-hide');
        }
    },
    MouseLeaveCheck: function(component, event, helper){
        var flagC=component.get("v.flagC");
        if(flagC=="true"){
            $A.util.addClass(component.find("divHelpCheck"), 'slds-hide');
        }
    },
    MouseLeaveStatus: function(component, event, helper){
        var flagS=component.get("v.flagS");
        if(flagS=="true"){
            $A.util.addClass(component.find("divHelpStatus"), 'slds-hide');
        }
    },
    MouseLeaveST: function(component, event, helper){
        var flagST=component.get("v.flagST");
        if(flagST=="true"){
            $A.util.addClass(component.find("divHelpST"), 'slds-hide');
        }
    },
    MouseLeaveTime: function(component, event, helper){
        var flagTime=component.get("v.flagTime");
        if(flagTime=="true"){
            $A.util.addClass(component.find("divHelpTime"), 'slds-hide');
        }
    },
    MouseLeaveBK: function(component, event, helper){
        var flagBK=component.get("v.flagBK");
        if(flagBK=="true"){
            $A.util.addClass(component.find("divHelpBK"), 'slds-hide');
        }
    },
     onCheck: function(component, event, helper){
        //var numR=event.target.dataset.num;
    },
})