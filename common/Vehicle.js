$(document).ready(function(){
    var OPT = {
        Cols:[
            { Header: "차량번호", Name: "carrierNo", Type: "Text", Width:80, RelWidth:1},
            { Header: "업무코드", Name: "worksCode", Type: "Text", Width:80, RelWidth:1},
            { Header: "회사코드", Name: "companyCode", Type: "Text", Width:80, RelWidth:1},
            { Header: "차종", Name: "carType", Type: "Text", Width:80, RelWidth:1},
            { Header: "차량모델", Name: "carModel", Type: "Text", Width:80, RelWidth:1},
            { Header: "사용용도", Name: "usage", Type: "Text", Width:80, RelWidth:1},
            { Header: "연료구분", Name: "fuelFlag", Type: "Text", Width:80, RelWidth:1},
            { Header: "차부품회사코드", Name: "partCompanyCd", Type: "Text", Width:80, RelWidth:1},
            { Header: "차량소유자유형코드", Name: "ownerTypeCode", Type: "Text", Width:80, RelWidth:1},
            { Header: "자산번호", Name: "assetNumber", Type: "Text", Width:80, RelWidth:1},
            { Header: "소속회사명", Name: "organizationName", Type: "Text", Width:80, RelWidth:1},
            { Header: "취득금액", Name: "acquisitionAmt", Type: "Text", Width:80, RelWidth:1},
            { Header: "운전자사번", Name: "driverEmpNo", Type: "Text", Width:80, RelWidth:1},
            { Header: "운전자명", Name: "userName", Type: "Text", Width:80, RelWidth:1},
            { Header: "등록일자", Name: "registDate", Type: "Text", Width:80, RelWidth:1},
            { Header: "취소일자", Name: "reversalDate", Type: "Text", Width:80, RelWidth:1},
            { Header: "관리번호", Name: "managementNumber", Type: "Text", Width:80, RelWidth:1},
            { Header: "유형", Name: "type", Type: "Text", Width:80, RelWidth:1},
            { Header: "연도", Name: "yearTp", Type: "Text", Width:80, RelWidth:1},
            { Header: "MD출력값", Name: "mdOutputValue", Type: "Text", Width:80, RelWidth:1},
            { Header: "LCA높이", Name: "lcaHeight", Type: "Text", Width:80, RelWidth:1},
            { Header: "수량", Name: "quantity", Type: "Text", Width:80, RelWidth:1},
            { Header: "승객수", Name: "personCount", Type: "Text", Width:80, RelWidth:1},
            { Header: "기준값", Name: "standardValue", Type: "Text", Width:80, RelWidth:1},
            { Header: "최대적재량", Name: "maxCapacity", Type: "Text", Width:80, RelWidth:1},
            { Header: "단거리운행거리", Name: "shortDistance", Type: "Text", Width:80, RelWidth:1},
            { Header: "고속급행거리", Name: "laneDistance", Type: "Text", Width:80, RelWidth:1},
            { Header: "적재운행거리", Name: "loadedTravelDistance", Type: "Text", Width:80, RelWidth:1},
            { Header: "검사일자", Name: "inspectionDate", Type: "Text", Width:80, RelWidth:1},
            { Header: "설명", Name: "description", Type: "Text", Width:80, RelWidth:1},
            { Header: "최대중량_40Feet", Name: "weight40Max", Type: "Text", Width:80, RelWidth:1},
            { Header: "최대폭_40Feet", Name: "width40Max", Type: "Text", Width:80, RelWidth:1},
            { Header: "길이제한(관)", Name: "lengthConstraintKan", Type: "Text", Width:80, RelWidth:1},
            { Header: "사용중량", Name: "usedWeight", Type: "Text", Width:80, RelWidth:1},
            { Header: "", Name: "driverId", Type: "Text", Width:80, RelWidth:1},
       ]
   };

   IBSheet.create({
       id:"sheet",
       el:"sheet_DIV",
       options:OPT
   });
});

function retrieve(){
    fetch("http://internal-k8s-ftl-ingress1-eafee7ab24-1743142653.ap-northeast-2.elb.amazonaws.com/l9a990-samplevehicles/vehicles/all", {
        method: 'GET',
        headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Content-Type": "application/json"
        }
    }).then(res => {
        return res.json();
    }).then(json => {
        sheet.loadSearchData(json)
    }).catch(error => {
        console.error("에러", error);
    });
}

function addData(){
   sheet.addRow();
}

function deleteData(){
    sheet.deleteRow(sheet.getFocusedRow());
}

function save(){
    var rows = sheet.getSaveJson()?.data;

    for(var i=0; i<rows.length;i++){
        switch(rows[i].STATUS){
            case "Added":
                var saveRow = rows[i];
                saveRow["createdObjectType"] =  "C";
                saveRow["createdObjectId"] =  "L9A01001";
                saveRow["createdProgramId"] =  "L9A01001";
                saveRow["creationTimestamp"] =  1643330024000;
                saveRow["lastUpdatedObjectType"] =  "C";
                saveRow["lastUpdatedObjectId"] =  "L9A01001";
                saveRow["lastUpdateProgramId"] =  "L9A01001";
                saveRow["lastUpdateTimestamp"] =  1643330024000;
                $.ajax({
                    url:"http://ap-northeast-2.elb.amazonaws.com/l9a990-samplevehicles/vehicles",
                    method:"POST",
                    contentType :"application/json",
                    data:JSON.stringify(saveRow)
                });
                break;
            case "Changed":
                var rowObj = sheet.getRowById(rows[i].id);
                var changedData = JSON.parse(sheet.getChangedData(rowObj))["Changes"][0];
                var nameValueData = {};
                var saveArr = Object.keys(changedData).map((key,idx)=>{
                    return {"name":key , "value": changedData[key]}
                })
                nameValueData["nameValues"] = saveArr;
                var id = rows[i].seq;
                $.ajax({
                    url:`http://ap-northeast-2.elb.amazonaws.com/l9a990-samplevehicles/vehicles/${id}`,
                    method:"PUT",
                    contentType :"application/json",
                    data:JSON.stringify(nameValueData),
                });
                break;
            case "Deleted":
                var id = rows[i].seq;
                $.ajax({
                    url:`http://ap-northeast-2.elb.amazonaws.com/l9a990-samplvehicles/vehicles/${id}`,
                    method:"DELETE",
                });
                break;
        }     
    }           
}