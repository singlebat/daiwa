({
    onLoad: function(component, event, sortField) {
      var action = component.get('c.getAssetList');
      action.setParams({
         'sortField': sortField,
         'isAsc': component.get("v.isAsc")
      });
      action.setCallback(this, function(response){
          var state = response.getState();
          if (state === "SUCCESS") {
              var resData = response.getReturnValue();
              if(resData!=null && resData.length!=0){
                  var nowlist=[];
                  var sizeA=0;
                  for(var i=0;i<resData.length;i++){
                      nowlist.push(i+1);
                      sizeA=sizeA+ resData[i].length;
                  }
                  component.set("v.nowlist", nowlist);
                  component.set("v.resData", resData);
                  component.set("v.now", 0);
                  component.set("v.start", 0);
                  component.set("v.end", resData.length);
                  component.set("v.totalSize", resData.length);
                  component.set("v.records", resData[0]);
                  component.set("v.recCount",sizeA);
              }    
          }
      });
      $A.enqueueAction(action);
    },
 
	sortHelper: function(component, event, sortFieldName) {
      var currentDir = component.get("v.arrowDirection");
 
      if (currentDir == 'arrowdown') { 
         component.set("v.arrowDirection", 'arrowup');
         component.set("v.isAsc", true);
      } else {
         component.set("v.arrowDirection", 'arrowdown');
         component.set("v.isAsc", false);
      }
      this.onLoad(component, event, sortFieldName);
   }
})