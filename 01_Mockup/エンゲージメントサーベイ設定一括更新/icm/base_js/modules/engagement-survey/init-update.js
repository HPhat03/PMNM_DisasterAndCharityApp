GoToChecked = () => {
    file = $("#uploadFile-0").val();
    if(file===''){
        $("#errMsgReceiver").html("ファイルを選択してください。")
        $("#errMsg").css("display", "block");
    }
    else if(!file.endsWith(".csv"))
    {
        $("#errMsgReceiver").html("ファイルの拡張子が正しくありません。「.CSV」ファイルを選択してください。")
        $("#errMsg").css("display", "block");
    }
    else {
        $("#errMsg").css("display", "none");
        location.href = "./checked.html";
    }
}

LogDowload = (type) => {
    switch (type){
        case "check_results":
            logContent = "処理区分,今回コースコード,今回アンケートID,今回質問ID,前回コースコード,前回アンケートID,前回質問ID,質問の表示順,グラフモード,グラフタイトルID,グラフタイトル名,軸ラベルID,軸ラベル名"
            + "\na,'ESCourse01','71','233','ESCourse01','71','236','13','1','602','Graph Title 602','101','Axis X','正常'"
            + "\nabc,'ESCourse02','72','233','ESCourse03','73','236','13','71','602','Graph Title 602','101','Axis X','不正:処理区分が不正です。'"
            
            break;
        case "failure_records":
            logContent = "処理区分,今回コースコード,今回アンケートID,今回質問ID,前回コースコード,前回アンケートID,前回質問ID,質問の表示順,グラフモード,グラフタイトルID,グラフタイトル名,軸ラベルID,軸ラベル名"
            + "\nabc,'ESCourse02','72','233','ESCourse03','73','236','13','71','602','Graph Title 602','101','Axis X','不正:処理区分が不正です。'"
            
            break;
        case "update_results":
            logContent = "処理区分,今回コースコード,今回アンケートID,今回質問ID,前回コースコード,前回アンケートID,前回質問ID,質問の表示順,グラフモード,グラフタイトルID,グラフタイトル名,軸ラベルID,軸ラベル名"
            + "\na,'ESCourse01','71','233','ESCourse01','71','236','13','1','602','Graph Title 602','101','Axis X','成功'"
            + "\nabc,'ESCourse02','72','233','ESCourse03','73','236','13','71','602','Graph Title 602','101','Axis X','失敗'"
            
            break;
        default:
            return
                
    }

    blob = new Blob([logContent], {type: 'log'});
    link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = "result_compare_setting_" + type+ ".log";; 
    link.click();
    URL.revokeObjectURL(link.href);
    
}