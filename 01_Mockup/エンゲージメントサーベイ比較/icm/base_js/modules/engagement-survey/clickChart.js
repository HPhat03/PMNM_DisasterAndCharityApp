/**
 * アンケート結果学習レポート
 * モーダルウィンドウでグラフ作成
 * 
 */
$(function() {
    
    var graph_win;

  $('.openGraphImg').click(function(e) {

      // HTMLからidとtitleを取得
      var graph_id    = $(this).attr("id");  // 'cid' + グラフタイトルID + '_grp' or '_all'
      var graph_title = $(this).attr("gtitle");

      // グラフタイトルIDと全体・所属フラグを作成
      var tmparr = graph_id.split('_');
      var gid = tmparr[0].split('cid')[1];
      var group = tmparr[1];
      if ($('#dialog_graph_div').children().length > 0) {
          $('#dialog_graph_div').children().remove();
      }
      $("#dialog_graph_div").append("<canvas id='dialog_graph_canvas'></canvas>");
       $("#dialogTitle").html(escapeHtml(graph_title));
       createChartRadar(chartData, gid, "dialog_graph_canvas", group, "dialog_graph_div_legend");
       $('#dialog_graph_div').width(500).height(500);
       $('#dialog_graph_canvas').width(500).height(500);


       $('#graphDialog').jqm({
         onShow: function(h) {
             h.w.slideDown();
         },
         modal: true
       });
       $('#graphDialog').jqmShow();

  });

});
