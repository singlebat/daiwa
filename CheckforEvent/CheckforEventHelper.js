({
    dosearch : function(component) {
        //必須チェック
        var required=component.get("v.simpleContact.AccountId");
        if(required==null||required==""){
            component.set("v.customeMsg","この項目を入力してください");
            return;
        }else{
            component.set("v.customeMsg","");
        }
     	//検索条件をゲット
     	var userid=  $A.get('$SObjectType.CurrentUser.Id');
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
                          "RelationshipManagement": RelationshipManagement,
                          "userid":userid
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
                component.set('v.selectall',false);
                console.log('--result:' + response.getReturnValue());
            } else if (state === "ERROR") 
            {
				component.set("v.customeMsg","現在のユーザは顧客の編集権限がございません。");
            }
        }));
        $A.enqueueAction(action);
    
	},
        
    doAction : function(component,Stype) {
        var arrowDirectionC = component.get("v.arrowDirectionCheck");
        var arrowDirectionP = component.get("v.arrowDirectionPro");
        var arrowDirectionS = component.get("v.arrowDirectionStatus");
        var arrowDirectionST = component.get("v.arrowDirectionST");
        var arrowDirectionBK = component.get("v.arrowDirectionBK");
        var arrowDirectionBS = component.get("v.arrowDirectionBS");
        var arrowDirectionTime = component.get("v.arrowDirectionTime");
        var items=component.get('v.items');
        var itemssize=component.get('v.itemsSize');
        // 値順にソート
        
        if(Stype=="profile"){
            if(arrowDirectionP=="arrowdown"){
                for (var i=1; i<itemssize; i++) {
                    //如果第i个元素小于第j个，则第j个向后移动
                    var v=items[i].ProfileName__c==null?items[i].profileNameForEventDetail__c:items[i].ProfileName__c;
                    for (j=i-1; j>=0&&v<(items[j].ProfileName__c==null?items[j].profileNameForEventDetail__c:items[j].ProfileName__c); j--){
                        var p=items[j+1];
                        items[j+1]=items[j];
                        items[j]=p;
                    }
                }
                component.set("v.arrowDirectionPro","arrowup");
            }else{
                for (var i=1; i<itemssize; i++) {
                      //如果第i个元素小于第j个，则第j个向后移动
                    var v=items[i].ProfileName__c==null?items[i].profileNameForEventDetail__c:items[i].ProfileName__c;
                    for (j=i-1; j>=0&&v>(items[j].ProfileName__c==null?items[j].profileNameForEventDetail__c:items[j].ProfileName__c); j--){
                        var p=items[j+1];
                        items[j+1]=items[j];
                        items[j]=p;
                    }
                }
                component.set("v.arrowDirectionPro","arrowdown");              
            }
        }
        if(Stype=="Check"){
            if(arrowDirectionC=="arrowdown"){
                for (var i=1; i<itemssize; i++) {
                    //如果第i个元素小于第j个，则第j个向后移动
                    for (var v=items[i].Check__c, j=i-1; j>=0&&v<items[j].Check__c; j--){
                        var p=items[j+1];
                        items[j+1]=items[j];
                        items[j]=p;
                    }
                }
                component.set("v.arrowDirectionCheck","arrowup");
            }else{
                for (var i=1; i<itemssize; i++) {
                    //如果第i个元素小于第j个，则第j个向后移动
                    for (var v=items[i].Check__c, j=i-1; j>=0&&v>items[j].Check__c; j--){
                        var p=items[j+1];
                        items[j+1]=items[j];
                        items[j]=p;
                    }
                }
                component.set("v.arrowDirectionCheck","arrowdown");              
            }
        }
        if(Stype=="Status"){
            if(arrowDirectionS=="arrowdown"){
                for (var i=1; i<itemssize; i++) {
                    var v=items[i].Status__c==null?'':items[i].Status__c;
                    //如果第i个元素小于第j个，则第j个向后移动
                    for (j=i-1; j>=0&&v<(items[j].Status__c==null?'':items[j].Status__c); j--){
                        var p=items[j+1];
                        items[j+1]=items[j];
                        items[j]=p;
                    }
                }
                component.set("v.arrowDirectionStatus","arrowup");
            }else{
                for (var i=1; i<itemssize; i++) {
                    var v=items[i].Status__c==null?'':items[i].Status__c;
                    //如果第i个元素小于第j个，则第j个向后移动
                    for (j=i-1; j>=0&&v>(items[j].Status__c==null?'':items[j].Status__c); j--){
                        var p=items[j+1];
                        items[j+1]=items[j];
                        items[j]=p;
                    }
                }
                component.set("v.arrowDirectionStatus","arrowdown");              
            }
        }
        if(Stype=="ST"){
            if(arrowDirectionST=="arrowdown"){
                for (var i=1; i<itemssize; i++) {
                    var v=items[i].ProfileSortOrder__c==null?'':items[i].ProfileSortOrder__c;
                    //如果第i个元素小于第j个，则第j个向后移动
                    for (j=i-1; (j>=0&&v<(items[j].ProfileSortOrder__c==null?'':items[j].ProfileSortOrder__c)); j--){
                        var p=items[j+1];
                        items[j+1]=items[j];
                        items[j]=p;
                    }
                }
                component.set("v.arrowDirectionST","arrowup");
            }else{
                for (var i=1; i<itemssize; i++) {
                    var v=items[i].ProfileSortOrder__c==null?'':items[i].ProfileSortOrder__c;
                    //如果第i个元素小于第j个，则第j个向后移动
                    for (j=i-1; (j>=0&&v>(items[j].ProfileSortOrder__c==null?'':items[j].ProfileSortOrder__c)); j--){
                        var p=items[j+1];
                        items[j+1]=items[j];
                        items[j]=p;
                    }
                }
                component.set("v.arrowDirectionST","arrowdown");              
            }
        }
         if(Stype=="BK"){
            if(arrowDirectionBK=="arrowdown"){
                for (var i=1; i<itemssize; i++) {
                    var v=items[i].Remark__c==null?'':items[i].Remark__c;
                    //如果第i个元素小于第j个，则第j个向后移动
                    for (j=i-1; (j>=0&&v<(items[j].Remark__c==null?'':items[j].Remark__c)); j--){
                        var p=items[j+1];
                        items[j+1]=items[j];
                        items[j]=p;
                    }
                }
                component.set("v.arrowDirectionBK","arrowup");
            }else{
                for (var i=1; i<itemssize; i++) {
                    var v=items[i].Remark__c==null?'':items[i].Remark__c;
                    //如果第i个元素小于第j个，则第j个向后移动
                    for (j=i-1; (j>=0&&v>(items[j].Remark__c==null?'':items[j].Remark__c)); j--){
                        var p=items[j+1];
                        items[j+1]=items[j];
                        items[j]=p;
                    }
                }
                component.set("v.arrowDirectionBK","arrowdown");              
            }
        }
        if(Stype=="Time"){
            if(arrowDirectionTime=="arrowdown"){
                for (var i=1; i<itemssize; i++) {
                    //如果第i个元素小于第j个，则第j个向后移动
                    for (var v=items[i].LastModifiedDate, j=i-1; (j>=0&&v<items[j].LastModifiedDate); j--){
                        var p=items[j+1];
                        items[j+1]=items[j];
                        items[j]=p;
                    }
                }
                component.set("v.arrowDirectionTime","arrowup");
            }else{
                for (var i=1; i<itemssize; i++) {
                    //如果第i个元素小于第j个，则第j个向后移动
                    for (var v=items[i].LastModifiedDate, j=i-1; (j>=0&&v>items[j].LastModifiedDate); j--){
                        var p=items[j+1];
                        items[j+1]=items[j];
                        items[j]=p;
                    }
                }
                component.set("v.arrowDirectionTime","arrowdown");              
            }
        }
        if(Stype=="BS"){
            if(arrowDirectionBS=="arrowdown"){
                for (var i=1; i<itemssize; i++) {
                    var v=items[i].Department__c==null?items[i].DepartmentForEventDetail__c:items[i].Department__c;
                    //如果第i个元素小于第j个，则第j个向后移动
                    for (j=i-1; (j>=0&&v<(items[j].Department__c==null?items[j].DepartmentForEventDetail__c:items[j].Department__c)); j--){
                        var p=items[j+1];
                        items[j+1]=items[j];
                        items[j]=p;
                    }
                }
                component.set("v.arrowDirectionBS","arrowup");
            }else{
                for (var i=1; i<itemssize; i++) {
                    var v=items[i].Department__c==null?items[i].DepartmentForEventDetail__c:items[i].Department__c;
                    //如果第i个元素小于第j个，则第j个向后移动
                    for (j=i-1; (j>=0&&v>(items[j].Department__c==null?items[j].DepartmentForEventDetail__c:items[j].Department__c)); j--){
                        var p=items[j+1];
                        items[j+1]=items[j];
                        items[j]=p;
                    }
                }
                component.set("v.arrowDirectionBS","arrowdown");              
            }
        }
        component.set('v.items',items);
    }
})