({
    init: function (component, event, helper) {
        //画面初期化の状態を記録する
        component.set("v.count",1);
        var action = component.get("c.initpicklist");
        action.setCallback(this, $A.getCallback(function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {   
                var result = response.getReturnValue();
                component.set('v.listValues',result);
            } else if (state === "ERROR") {
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "失敗!",
                    "message": "初期か失敗しました。",
                    "type":"error"
                });
                toastEvent.fire();
            }
        }));
        $A.enqueueAction(action);
    },
    doSearch: function (component, event, helper) {
        helper.dosearch(component,'','search');
        var action2 = component.get("c.initSaveButton");
        action2.setParams({"generalEventId": component.get("v.recordId"),
                          });
        action2.setCallback(this, $A.getCallback(function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {   
                var result = response.getReturnValue();
                if(!result){
                    component.set('v.savebuttonStyle','slds-hide');
                }
            } else if (state === "ERROR") {
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "失敗!",
                    "message": "初期か失敗しました。",
                    "type":"error"
                });
                toastEvent.fire();
            }
        }));
        $A.enqueueAction(action2);
    },
    doCancel: function (component, event, helper) {
        helper.dosearch(component,'','cancel');
    },
    doShow: function (component, event, helper) {
        var va=component.get('v.Showflag');
        if(va=='true'){
            component.set('v.Showflag','false');
        }else{
            component.set('v.Showflag','true');
        }
    },
    Show: function (component, event, helper) {
        component.set('v.style1','slds-popover slds-popover_tooltip slds-nubbin_bottom-right');
    },
    hide: function (component, event, helper) {
        component.set('v.style1','slds-hide');
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
        if(saveresult==null||saveresult.length==0){
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "title": "登録できませんでした!",
                "message": "選択してください！",
                "type":"error"
            });
            toastEvent.fire();
            return;
        }
        var action = component.get("c.saveItems");
        //GeneralEvent__c id
        action.setParams({"saveresult": JSON.stringify(saveresult),
                         });
        action.setCallback(this, $A.getCallback(function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {   
                helper.dosearch(component,'保存しました。','save');
            } else if (state === "ERROR") {
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "失敗!",
                    "message": "保存できませんでした。",
                    "type":"error"
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
        $A.util.addClass(component.find("divHelpBS"), 'slds-hide');
        
        component.set("v.flagST","true");
        component.set("v.flagC","true");
        component.set("v.flagS","true");
        component.set("v.flagBK","true");
        component.set("v.flagP","false");
        component.set("v.flagTime","true");
        component.set("v.flagBS","true");
    },
    sortCheck: function (component, event, helper) {
        helper.doAction(component,"Check");
        $A.util.removeClass(component.find("divHelpCheck"), 'slds-hide');
        $A.util.addClass(component.find("divHelpPro"), 'slds-hide');
        $A.util.addClass(component.find("divHelpStatus"), 'slds-hide');
        $A.util.addClass(component.find("divHelpST"), 'slds-hide');
        $A.util.addClass(component.find("divHelpTime"), 'slds-hide');
        $A.util.addClass(component.find("divHelpBK"), 'slds-hide');
        $A.util.addClass(component.find("divHelpBS"), 'slds-hide');
        
        component.set("v.flagST","true");
        component.set("v.flagS","true");
        component.set("v.flagC","false");
        component.set("v.flagBK","true");
        component.set("v.flagP","true");
        component.set("v.flagTime","true");
        component.set("v.flagBS","true");
    },
    sortStatus: function (component, event, helper) {
        helper.doAction(component,"Status");
        $A.util.addClass(component.find("divHelpCheck"), 'slds-hide');
        $A.util.addClass(component.find("divHelpPro"), 'slds-hide');
        $A.util.removeClass(component.find("divHelpStatus"), 'slds-hide');
        $A.util.addClass(component.find("divHelpST"), 'slds-hide');
        $A.util.addClass(component.find("divHelpTime"), 'slds-hide');
        $A.util.addClass(component.find("divHelpBK"), 'slds-hide');
        $A.util.addClass(component.find("divHelpBS"), 'slds-hide');
        
        component.set("v.flagST","true");
        component.set("v.flagC","true");
        component.set("v.flagP","true");
        component.set("v.flagS","false");
        component.set("v.flagBK","true");
        component.set("v.flagTime","true");
        component.set("v.flagBS","true");
    },
    sortST: function (component, event, helper) {
        helper.doAction(component,"ST");
        $A.util.addClass(component.find("divHelpCheck"), 'slds-hide');
        $A.util.addClass(component.find("divHelpPro"), 'slds-hide');
        $A.util.addClass(component.find("divHelpStatus"), 'slds-hide');
        $A.util.removeClass(component.find("divHelpST"), 'slds-hide');
        $A.util.addClass(component.find("divHelpTime"), 'slds-hide');
        $A.util.addClass(component.find("divHelpBK"), 'slds-hide');
        $A.util.addClass(component.find("divHelpBS"), 'slds-hide');
        
        component.set("v.flagST","false");
        component.set("v.flagC","true");
        component.set("v.flagP","true");
        component.set("v.flagS","true");
        component.set("v.flagBK","true");
        component.set("v.flagTime","true");
        component.set("v.flagBS","true");
    },
    sortBK: function (component, event, helper) {
        helper.doAction(component,"BK");
        $A.util.addClass(component.find("divHelpCheck"), 'slds-hide');
        $A.util.addClass(component.find("divHelpPro"), 'slds-hide');
        $A.util.addClass(component.find("divHelpStatus"), 'slds-hide');
        $A.util.addClass(component.find("divHelpST"), 'slds-hide');
        $A.util.addClass(component.find("divHelpTime"), 'slds-hide');
        $A.util.removeClass(component.find("divHelpBK"), 'slds-hide');
        $A.util.addClass(component.find("divHelpBS"), 'slds-hide');
        
        component.set("v.flagST","true");
        component.set("v.flagC","true");
        component.set("v.flagP","true");
        component.set("v.flagS","true");
        component.set("v.flagBK","false");
        component.set("v.flagTime","true");
        component.set("v.flagBS","true");
    },
    sortTime: function (component, event, helper) {
        helper.doAction(component,"Time");
        $A.util.addClass(component.find("divHelpCheck"), 'slds-hide');
        $A.util.addClass(component.find("divHelpPro"), 'slds-hide');
        $A.util.addClass(component.find("divHelpStatus"), 'slds-hide');
        $A.util.addClass(component.find("divHelpST"), 'slds-hide');
        $A.util.removeClass(component.find("divHelpTime"), 'slds-hide');
        $A.util.addClass(component.find("divHelpBS"), 'slds-hide');
        
        component.set("v.flagST","true");
        component.set("v.flagC","true");
        component.set("v.flagP","true");
        component.set("v.flagS","true");
        component.set("v.flagBK","true");
        component.set("v.flagTime","false");
        component.set("v.flagBS","true");
    },
    sortBS: function (component, event, helper) {
        helper.doAction(component,"BS");
        $A.util.addClass(component.find("divHelpCheck"), 'slds-hide');
        $A.util.addClass(component.find("divHelpPro"), 'slds-hide');
        $A.util.addClass(component.find("divHelpStatus"), 'slds-hide');
        $A.util.addClass(component.find("divHelpST"), 'slds-hide');
        $A.util.addClass(component.find("divHelpTime"), 'slds-hide');
        $A.util.removeClass(component.find("divHelpBS"), 'slds-hide');
        
        component.set("v.flagST","true");
        component.set("v.flagC","true");
        component.set("v.flagP","true");
        component.set("v.flagS","true");
        component.set("v.flagBK","true");
        component.set("v.flagBS","false");
        component.set("v.flagTime","true");
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
    MouseOverBS : function(component, event, helper){
        $A.util.removeClass(component.find("divHelpBS"), 'slds-hide');
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
    MouseLeaveBS: function(component, event, helper){
        var flagBS=component.get("v.flagBS");
        if(flagBS=="true"){
            $A.util.addClass(component.find("divHelpBS"), 'slds-hide');
        }
    },
    onCheck: function(component, event, helper){
        //alert(event.getSource().getLocalId());
        var numR=event.getSource().get('v.labelClass');
        var items=component.get('v.items');
        if(!items[numR].selected__c){
            items[numR].selected__c=true;
            component.set('v.items',items);
        }
        
    },
    onCheck2: function(component, event, helper){
        var numR=event.target.dataset.num;
        var items=component.get('v.items');
        if(!items[numR].selected__c){
            items[numR].selected__c=true;
            component.set('v.items',items);
        }
    },


    
    
    
    
    
    
})