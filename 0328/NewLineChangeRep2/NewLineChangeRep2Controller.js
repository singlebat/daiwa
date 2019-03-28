({
	doInit : function(component, event, helper) {
        //コンポーネントをと閉じる
        var closeAction = function() {
            var dismissActionPanel = $A.get("e.force:closeQuickAction");
            dismissActionPanel.fire();
        }
        setTimeout(closeAction, 0);
		var action = component.get("c.getAccount");
        action.setParams({"ContactId": component.get("v.recordId")
                         });
        action.setCallback(this, $A.getCallback(function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {   
				var result = response.getReturnValue();
               	var createRecordEvent = $A.get("e.force:createRecord");
                createRecordEvent.setParams({
                    "entityApiName": "LineChangeReport__c",
                    "defaultFieldValues": {
                        'LineChange1__c':result.LineChangingId,
                        'Account__c':result.AccountId,
                    }
                });
                createRecordEvent.fire();	
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
	}
})