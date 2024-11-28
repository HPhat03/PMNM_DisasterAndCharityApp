/**
 * アンケート結果学習レポート
 * レーダーチャート用 共通オプション
 */
var config = {
    legendCallback: function(chart) {
               var text = [];
                text.push('<ul>');
                for (var i=0; i<chart.data.datasets.length; i++) {
                    text.push('<li style="text-align:left">');
                    text.push('<span style="background-color:' + chart.data.datasets[i].backgroundColor 
                              + ';border:' + chart.data.datasets[i].borderWidth + 'px solid ' + chart.data.datasets[i].borderColor
                              + ';height: 8px;width: 8px;margin: 5px;display: inline-block;vertical-align: middle"></span>');
                    if (chart.data.labels[i]) {
                        text.push('<span style="text-align: center;vertical-align: middle;">' + chart.data.datasets[i].label + '</span>');
                    }
                    text.push('</li>');
                }
                text.push('</ul>');
                return text.join("");
    },
    legend: { // 凡例
        display: true,
        position: 'top',
        onClick: function(){return;},
        labels : {
            boxWidth: 10,
            fontSize: 12,
            fontColor: "rgba(0,0,0,1)"
        }
    },
    scale: {
        pointLabels: {  // 軸ラベル
            fontSize: 12,
            fontColor: "rgba(0,0,0,1)"
        },
        gridLines: { // 軸線
            color: "rgba(0,0,0,0.5)",
            lineWidth: 0.3,
        },
        angleLines: {  // 中心からのびる線
            color: "rgba(0,0,0,0.3)",
            lineWidth: 0.2,
        },
        ticks: { // 目盛り
            fontColor: "rgba(0,0,0,1)",
            fontSize: 12,
            stepSize: 25,    // 目盛りの間隔 2024/11/12 修正
            max: 0,
            beginAtZero: true,
            showLabelBackdrop: false
        }
    }
};

/**
 * アンケート結果学習レポート
 * レーダーチャート作成
 * @data データ配列
 * gid グラフタイトルID
 *     nullの場合は全グラフ作成
 *     指定ありの場合はそのグラフのみ作成
 */
function createChartRadar(data, gid, expand, canvas_id, target, legend_id){

    cur_config = config;

    if (expand=='true') {
    	// グラフ拡大時文字サイズ設定
    	cur_config.legend.labels.fontSize = 16;
    	cur_config.scale.pointLabels.fontSize = 16;
    	cur_config.scale.ticks.fontSize = 15;
    }

    // グラフごとに処理
    Object.keys(data).forEach(function (graphID) {

        // 中身がなければ次へ
        if (data[graphID] === null) {
            return;
        }

        // グラフ作成処理
        if (gid === null || gid == graphID) {
            // 軸の最大数設定
            // cur_config['scale']['ticks']['max'] = data[graphID]['max_cnt']; // 2024/11/12 修正
            cur_config['scale']['ticks']['max'] = 100;
            // 軸ラベル設定
            var alldata = {
                    labels: data[graphID]['labels'],
                    datasets: []
                };
            var grpdata = {
                    labels: data[graphID]['labels'],
                    datasets: []
                };
            // canvasタグID名設定
            var allTag = '#' + data[graphID]['canvas_id'] + 'all';
            var grpTag = '#' + data[graphID]['canvas_id'] + 'grp';
            if (canvas_id != undefined) {
                 allTag = '#' + canvas_id;
                 grpTag = '#' + canvas_id;
            }
            if (legend_id != undefined) {
                cur_config['legend']['display'] = false;
            }
    

            // グラフ線ごとに処理
            Object.keys(data[graphID]['datasets']).forEach(function (key) {

                // 全体のグラフ
                if (key == 0 || key == 1) {
                    // 線の設定
                    alldata['datasets'].push({
                        label: data[graphID]['datasets'][key]['label'],
                        fill: true,
                        backgroundColor: data[graphID]['datasets'][key]['backgroundColor'],
                        borderColor: data[graphID]['datasets'][key]['borderColor'],
                        borderWidth: 2,
                        pointBackgroundColor: data[graphID]['datasets'][key]['borderColor'],
                        pointBorderColor: data[graphID]['datasets'][key]['borderColor'],
                        radius: 0,
                        pointRadius: 0,
                        pointHoverRadius: 3,
                        hitRadius : 15,
                        data: data[graphID]['datasets'][key]['data']
                    });
                }

                // 所属のグラフ
                if (key == 2 || key == 3) {
                    // 線の設定
                    grpdata['datasets'].push({
                        label: data[graphID]['datasets'][key]['label'],
                        fill: true,
                        backgroundColor: data[graphID]['datasets'][key]['backgroundColor'],
                        borderColor: data[graphID]['datasets'][key]['borderColor'],
                        borderWidth: 2,
                        pointBackgroundColor: data[graphID]['datasets'][key]['borderColor'],
                        pointBorderColor: data[graphID]['datasets'][key]['borderColor'],
                        radius: 0,
                        pointRadius: 0,
                        pointHoverRadius: 3,
                        hitRadius : 15,
                        data: data[graphID]['datasets'][key]['data']
                    });
                }

            });

            // グラフ表示（所属）
            if (target == undefined || target === 'grp') {
                if ($(grpTag)[0]) {
                    $(grpTag).width(450).height(450);
                    var chart = new Chart($(grpTag)[0], {type: 'radar', data: grpdata, options: cur_config});
                    var chart = new Chart($('#popup_cid101_grp')[0], {type: 'radar', data: grpdata, options: cur_config});
                }
                if (legend_id != undefined) {
                    document.getElementById(legend_id).innerHTML = chart.generateLegend();
                }
            }

            // グラフ表示（全体）
            if (target == undefined || target === 'all') {
                if ($(allTag)[0]) {
                    $(allTag).width(450).height(450);
                    var chart = new Chart($(allTag)[0], {type: 'radar', data: alldata, options: cur_config});
                    var chart = new Chart($('#popup_cid101_all')[0], {type: 'radar', data: alldata, options: cur_config});
                }
                if (legend_id != undefined) {
                    document.getElementById(legend_id).innerHTML = chart.generateLegend();
                }
            }
        }
    });

}
