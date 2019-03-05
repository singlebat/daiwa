({
    doAction : function(component,Stype) {
        var arrowDirectionC = component.get("v.arrowDirectionCheck");
        var arrowDirectionP = component.get("v.arrowDirectionPro");
        var arrowDirectionS = component.get("v.arrowDirectionStatus");
        var arrowDirectionST = component.get("v.arrowDirectionST");
        var arrowDirectionBK = component.get("v.arrowDirectionBK");
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
                    //如果第i个元素小于第j个，则第j个向后移动
                    for (var v=items[i].LastModifiedByName__c, j=i-1; (j>=0&&v<items[j].LastModifiedByName__c); j--){
                        var p=items[j+1];
                        items[j+1]=items[j];
                        items[j]=p;
                    }
                }
                component.set("v.arrowDirectionST","arrowup");
            }else{
                for (var i=1; i<itemssize; i++) {
                    //如果第i个元素小于第j个，则第j个向后移动
                    for (var v=items[i].LastModifiedByName__c, j=i-1; (j>=0&&v>items[j].LastModifiedByName__c); j--){
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
        component.set('v.items',items);
    }
})