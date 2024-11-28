/**
 * アンケート結果学習レポート
 * 詳細表示
 */

function setDetail(tag){

    var htags  = [];
    var choiceCnt = 0;
    var existToFlag = false;

    // グラフごとに処理
    $.each(enqResData, function (graphID) {
        // グラフタイトル表示
        htags.push("<div class=\"kc-co-hr\"><hr /></div>");
        htags.push("<h2>" + escapeHtml(graphTitle[graphID]) + "</h2>");

        // 軸ラベルごとに処理
        $.each(enqResData[graphID], function (axisID) {
            // 軸ラベル名表示
            htags.push("<h3>" + escapeHtml(axisLabel[axisID]) + "</h3>");

            // 質問ごとに処理 
            $.each(enqResData[graphID][axisID], function(i, val) {
                existFromFlag = false;   // 今回質問存在フラグ
                existToFlag = false;     // 前回質問存在フラグ
                chFrom = null;           // 今回選択肢配列
                chTo   = null;           // 前回選択肢配列
                itemType = 99;           // 質問タイプ
                choiceCnt = 0;           // 選択肢数

                // 今回が存在
                if (val['from']['item_id'] !== undefined) {

                    // 質問文表示（今回）
                    htags.push("<span class=\"kc-co-label\">&nbsp;&nbsp;[" + strFrom + "]&nbsp;</span>"
                                   + "<span>" + escapeHtml(val['from']['item_title']) + "</span><br />");

                    existFromFlag = true;
                    chFrom = val['from']['choice'];
                    itemType = val['from']['item_type'];
                    choiceCnt = chFrom.length;
                }

                // 前回が存在
                if (val['to']['item_id'] !== undefined) {
                    // 質問文表示（前回）
                    htags.push("<span class=\"kc-co-label\">&nbsp;&nbsp;[" + strTo + "]&nbsp;</span>"
                                   + "<span>" + escapeHtml(val['to']['item_title']) + "</span><br />");

                    // 質問タイプが一致するときのみ選択肢表示
                    if (itemType == 99 || itemType == val['to']['item_type']) {
                        existToFlag = true;
                        chTo = val['to']['choice'];
                        itemType = val['to']['item_type'];

                        // 今回より選択肢数が多いときのみ設定
                        if (chTo.length > choiceCnt) {
                            choiceCnt = chTo.length;
                        }
                    }
                }

                // 選択肢テーブル（記述式以外）
                if ((existFromFlag || existToFlag) && itemType != 6) {
                    htags.push("<table class=\"kc-co-edit-form kc-co-tbl-border\">");

                    // ヘッダ表示
                    htags.push("<tr>");
                    htags.push("<thead>");

                    var tmpStr = "<th style=\"word-wrap:break-word;word-break:break-all;\"";
                    // プルダウンの場合
                    if (itemType == 4) { 
                        tmpStr += " colspan=\"2\"";
                    }
                    htags.push(tmpStr + ">" + strChoice + "</th>");

                    htags.push("<th class=\"kc-co-width_S\">" + strNumber + "</th>");
                    htags.push("<th class=\"kc-co-width_L\">" + strPro + "</th>");
                    htags.push("<th class=\"kc-co-width_S\">" + strUpDown + "</th>");
                    htags.push("</thead>");
                    htags.push("</tr>");

                    // 選択肢を設定
                    for (var chID = 0; chID < choiceCnt; chID++) {

                        if (itemType == 4) { // プルダウンの場合
                            // プルダウンの選択肢数設定
                            var pdCnt = 0;
                            pdFrom = null;
                            pdTo   = null;

                            if (existFromFlag && chFrom[chID] !== undefined) {
                                pdFrom = chFrom[chID];
                                pdCnt = pdFrom.length;
                            }
                            if (existToFlag && chTo[chID] !== undefined) {
                                pdTo = chTo[chID];
                                // 今回より選択肢数が多いときのみ設定
                                if (pdTo.length > pdCnt) {
                                    pdCnt = pdTo.length;
                                }
                            }

                            // プルダウンの選択肢設定
                            var tmpChoice = "";
                            for (var k = 0; k < pdCnt; k++) {
                                tmpChoice += makeChoiceHtml(pdFrom, pdTo, k, val['updown'][chID]);
                            }
                            tmpCount = tmpChoice.split('<tr>').length -	1;
                            tmpChoice = tmpChoice.substr(4);    // 最初の4文字(<tr>タグ)をカット
                            htags.push("<tr style=\"border-top:1px solid #aaaaaa;\"><th class=\"kc-co-width_3S\" rowspan=\"" + tmpCount + "\">((ANS" + ('00'+(chID+1)).slice(-2) + "))</th>");
                            htags.push(tmpChoice);

                        } else {  // プルダウン以外の場合
                            htags.push(makeChoiceHtml(chFrom, chTo, chID, val['updown']));
                        }
                    }

                    htags.push("</table>");
                    htags.push("<div class=\"kc-co-hr\"><hr /></div>");
                }

            });

        });

    });

    tag[0].innerHTML = htags.join("");

}

/**
 * アンケート結果学習レポート
 * 詳細表示用 選択肢表示HTML作成処理
 */

function makeChoiceHtml(chFrom, chTo, num, upDown){

    var tmpUpDown = "-";
    var countDatas = 0;
    var tmpFrom = "";
    var tmpTo   = "";

    // 存在すれば選択肢を設定（今回）
    if (chFrom !== null && chFrom !== undefined && (chFrom[num] !== undefined)) {
        tmpFrom += "<tr>";
        tmpFrom += "<td style=\"border-bottom:none;\">" + escapeHtml(chFrom[num]['text']) + "</td>";
        tmpFrom += "<td style=\"border-bottom:none;text-align:center;\">" + chFrom[num]['grpSum'] + "</td>";
        tmpFrom += "<td style=\"border-bottom:none;\">";
        tmpFrom += "<div style=\"float:left;\">";
        tmpFrom += "<div class=\"gFrom\" >";
        tmpFrom += "<span class=\"barFrom\" style=\"width:" + chFrom[num]['grpPro'] + "%\"></span>";
        tmpFrom += "</div>";
        tmpFrom += "</div>";
        tmpFrom += "<div style=\"float:left;\">　" + chFrom[num]['grpPro'] + "%</div>";
        countDatas++;
    }
    // 存在すれば選択肢を追加設定（前回）
    if (chTo !== null && chTo !== undefined && (chTo[num] !== undefined)) {
        tmpTo += "<tr>";
        tmpTo += "<td style=\"border-top:none;\">" + escapeHtml(chTo[num]['text']) + "</td>";
        tmpTo += "<td style=\"border-top:none;text-align:center;\">" + chTo[num]['grpSum'] + "</td>";
        tmpTo += "<td style=\"border-top:none;\">";
        tmpTo += "<div style=\"float:left;\">";
        tmpTo += "<div class=\"gTo\" >";
        tmpTo += "<span class=\"barTo\" style=\"width:" + chTo[num]['grpPro'] + "%\"></span>";
        tmpTo += "</div>";
        tmpTo += "</div>";
        tmpTo += "<div style=\"float:left;\">　" + chTo[num]['grpPro'] + "%</div>";
        countDatas++;
    }

    // 伸び率設定
    if (upDown !== null && upDown !== undefined && (upDown[num] !== undefined)) {
        if (upDown[num]['grp'] !== null) {
        tmpUpDown = upDown[num]['grp'];
        }
    }

    if (countDatas == 2) {  // 今回・先のどちらも存在するとき
        tmpFrom += "<td rowspan=\"2\" style=\"text-align:center;border-bottom:none;\">" + tmpUpDown + "</td></tr>";
    } else if (countDatas == 1) {  // 今回・先のどちらかでも存在するとき
        tmpTo += "<td style=\"text-align:center;border-bottom:none;\">" + tmpUpDown + "</td></tr>";
    }

    return tmpFrom + tmpTo;
}

function escapeHtml(content) {
  return content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/\n/g, '<br />');
}
