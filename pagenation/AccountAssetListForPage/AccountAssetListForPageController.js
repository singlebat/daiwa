({
    init : function(component, event, helper) {
        helper.onLoad(component, event, 'account_name__c');
        var recordData = component.get("v.records");        
        /*		var action = component.get("c.getAssetList");
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                var resData = response.getReturnValue();
                component.set("v.records", resData);
            }
        });
        $A.enqueueAction(action);*/
    },
    navToAccDetail : function(component, event, helper) {
        var rectarget = event.currentTarget;
        var idstr = rectarget.getAttribute("id"); 
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "recordId": idstr,
            "slideDevName": "account"
        });
        navEvt.fire();
    },
    sortAccountName: function(component, event, helper) { 
        component.set("v.selectedTabsoft", 'accountName');
        helper.sortHelper(component, event, 'account_name__c');
    },
    sortAmount: function(component, event, helper) { 
        component.set("v.selectedTabsoft", 'amount');
        helper.sortHelper(component, event, 'hyouka_sum_all__c');
    },
    displayChildData: function(component, event, helper) {
        var rectarget = event.currentTarget;
        var idstr = rectarget.getAttribute("id");
        var action = component.get('c.getAssetChild');
        action.setParams({
            'assetList': component.get('v.records'),
            'parentId': idstr
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                var resData = response.getReturnValue();
                component.set("v.records", resData);
            }
        });
        $A.enqueueAction(action);
    },
    first : function(component, event, helper){
        var resData =component.get("v.resData");
        var start=component.get("v.start");
        component.set("v.records", resData[start]);
        component.set("v.now",start);
    },
    last : function(component, event, helper){
        var resData =component.get("v.resData");
        var end=component.get("v.end");
        component.set("v.records", resData[end-1]);
        component.set("v.now",end-1);
    },
    next : function(component, event, helper){
        var resData =component.get("v.resData");
        var now=component.get("v.now");
        var end=component.get("v.end");
        if(now==end-1){
            component.set("v.records", resData[end-1]);
        }else{
            component.set("v.records", resData[now+1]);
            component.set("v.now",now+1);
        }
    },
	previous : function(component, event, helper){
        var resData =component.get("v.resData");
        var now=component.get("v.now");
        var start=component.get("v.start");
        if(now==start){
            component.set("v.records", resData[start]);
            component.set("v.now",start);
        }else{
            component.set("v.records", resData[now-1]);
            component.set("v.now",now-1);
        }
    },
})