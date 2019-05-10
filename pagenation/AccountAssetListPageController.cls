public class AccountAssetListPageController {
    //ページごとに表示する行数
    public static Integer rowCounts=10;
	@AuraEnabled
    public static List<List<CUSTOMER_ASSET__c>> getAssetList(String sortField, boolean isAsc){
        //ログインユーザ
        ID loginUserId = UserInfo.getUserId();
        //抽出SOQL文
        String soqlStr = 'select kokyaku__c,account_name__c,asset_img__c,hyouka_sum_all__c,parent_child_flg__c,';
        soqlStr += '             hyouka_sum_start__c,hyouka_sum_img_1__c,hyouka_sum_img_2__c,hyouka_sum_img_3__c,';
        soqlStr += '             hyouka_sum_img_4__c,hyouka_sum_img_5__c,hyouka_sum_img_6__c,hyouka_sum_end__c,parent_id__c,';
        soqlStr += '             kokyaku__r.toushi_category__c,risk_pre_img__c,kokyaku__r.child_count__c,kouza_risk_score__c';
        soqlStr += '        from CUSTOMER_ASSET__c';
        soqlStr += '        where account_name__c!= null';
        //soqlStr += '        where Zeneigyoubiflag__c = true';
        //soqlStr += '          and kokyaku__r.parentId = null';
//        soqlStr += '          and kokyaku__r.OwnerId = :loginUserId';
		soqlStr += '        order by ' + sortField;
        if (isAsc) {
            soqlStr += ' asc';
        } else {
            soqlStr += ' desc';
        }
        system.debug('#####   '+soqlStr);
        //預かり資産取得
        List<List<CUSTOMER_ASSET__c>> assetLists= new List<List<CUSTOMER_ASSET__c>>();
        List<CUSTOMER_ASSET__c> assetList = Database.query(soqlStr);
        if(assetList!=null && assetList.size()>0){
            //ページ数を計算しよう
            Integer remainder=math.mod(assetList.size(),rowCounts);
            Integer pagecount;
            if(remainder==0){
                pagecount=assetList.size()/rowCounts;
            }else{
                pagecount=assetList.size()/rowCounts+1;            
            }
            for(Integer i=0;i<pagecount;i++){
                List<CUSTOMER_ASSET__c> templist =new List<CUSTOMER_ASSET__c>();
                //1~10
                for(Integer j=0;j<rowCounts;j++){
                    Integer row=j+rowCounts*i;
                    if(row>(assetList.size()-1)){
                        break;
                    }
                    templist.add(assetList[row]);
                }
                assetLists.add(templist);
            }
            return assetLists;
        }else{
            return assetLists;
        }        
    }
    
    @AuraEnabled
    public static List<CUSTOMER_ASSET__c> getAssetChild(List<CUSTOMER_ASSET__c> assetList,Id parentId){
        boolean childClickFlg = false;
        for(integer i=0; i<assetList.size(); i++){
            CUSTOMER_ASSET__c asset = assetList.get(i);
            if(asset.parent_id__c == parentId){
                childClickFlg = true;
                assetList.remove(i);
                i--;
            }
        }
        if(childClickFlg){
            return assetList;
        }
        List<CUSTOMER_ASSET__c> assetChild = [select kokyaku__c,account_name__c,asset_img__c,hyouka_sum_all__c,parent_child_flg__c,
                                                     hyouka_sum_start__c,hyouka_sum_img_1__c,hyouka_sum_img_2__c,hyouka_sum_img_3__c,
                                                     hyouka_sum_img_4__c,hyouka_sum_img_5__c,hyouka_sum_img_6__c,hyouka_sum_end__c,parent_id__c,
                                              		 kokyaku__r.toushi_category__c,risk_pre_img__c,kokyaku__r.child_count__c,kouza_risk_score__c
                                                from CUSTOMER_ASSET__c 
                                               where parent_id__c = :parentId
                                                 and Zeneigyoubiflag__c = true];
        if(assetChild!=null && assetChild.size()>0){
            for(integer i=0; i<assetList.size(); i++){
                CUSTOMER_ASSET__c asset = assetList.get(i);
                if(asset.kokyaku__c==parentId){
                    integer j=1;
                    if(i+j>=assetList.size()){
                        assetList.addAll(assetChild);
                    } else {
                        for(CUSTOMER_ASSET__c child : assetChild){
                            assetList.add(i+j,child);
                            j++;
                        }
                    }
                    break;
                }
            }
        }       
        return assetList.clone();
    }
}