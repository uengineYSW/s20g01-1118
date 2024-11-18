$(document).ready(function(){
    var OPT = {
        Cols:[
            { Header: "운전자 사원 번호", Name: "driverEmpNo", Type: "Text", Width:80, RelWidth:1},
            { Header: "이름", Name: "name", Type: "Text", Width:80, RelWidth:1},
            { Header: "회사 코드", Name: "companyCode", Type: "Text", Width:80, RelWidth:1},
            { Header: "작업 코드", Name: "worksCode", Type: "Text", Width:80, RelWidth:1},
            { Header: "인사 접근 레벨", Name: "hrAccessLevel", Type: "Text", Width:80, RelWidth:1},
            { Header: "감독자 유형", Name: "supervisorType", Type: "Text", Width:80, RelWidth:1},
            { Header: "현재 직책", Name: "currentJob", Type: "Text", Width:80, RelWidth:1},
            { Header: "핸드폰 번호", Name: "handPhone", Type: "Text", Width:80, RelWidth:1},
            { Header: "면허 번호", Name: "licenseNumber", Type: "Text", Width:80, RelWidth:1},
            { Header: "국가 식별자", Name: "nationalIdentifier", Type: "Text", Width:80, RelWidth:1},
            { Header: "리소스 ID", Name: "resourceId", Type: "Text", Width:80, RelWidth:1},
            { Header: "차량 종류", Name: "carType", Type: "Text", Width:80, RelWidth:1},
            { Header: "은퇴 플래그", Name: "retirementFlag", Type: "Text", Width:80, RelWidth:1},
            { Header: "은퇴일", Name: "retiredDate", Type: "Text", Width:80, RelWidth:1},
            { Header: "설명", Name: "description", Type: "Text", Width:80, RelWidth:1},
       ]
   };

   IBSheet.create({
       id:"sheet",
       el:"sheet_DIV",
       options:OPT
   });
});

function retrieve(){
    fetch("http://internal-k8s-ftl-ingress1-eafee7ab24-1743142653.ap-northeast-2.elb.amazonaws.com/l9a990-sampledrivers/drivers/all", {
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
                    url:"http://ap-northeast-2.elb.amazonaws.com/l9a990-sampledrivers/drivers",
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
                    url:`http://ap-northeast-2.elb.amazonaws.com/l9a990-sampledrivers/drivers/${id}`,
                    method:"PUT",
                    contentType :"application/json",
                    data:JSON.stringify(nameValueData),
                });
                break;
            case "Deleted":
                var id = rows[i].seq;
                $.ajax({
                    url:`http://ap-northeast-2.elb.amazonaws.com/l9a990-sampldrivers/drivers/${id}`,
                    method:"DELETE",
                });
                break;
        }     
    }           
}