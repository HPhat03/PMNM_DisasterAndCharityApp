/**
 * Enquete Result Compare
 * Set hidden values
 */
// import * as data from "../TestData";
function enqResCmpValue(cpcc,ccf,cct,eif,eit) {

    $("#course_publisher_company_code").val(cpcc);
    $("#course_code1").val(ccf);
    $("#course_code2").val(cct);
    $("#enquete_id1").val(eif);
    $("#enquete_id2").val(eit);
}

init = () => {
    autoSearch = localStorage.getItem('auto-search');
    searchCondition = localStorage.getItem('search_condition');
    if(autoSearch == null || autoSearch == '0' || searchCondition == null) return;

    searchCondition = JSON.parse(searchCondition);

    $('#course_code').val(searchCondition.course_code);
    $('#course_name').val(searchCondition.course_name);
    $('#searchMainBelongGroupCode').val(searchCondition.group_code);
    $('#searchMainBelongGroupName').val(searchCondition.group_name);
    $('#searchClassCode').val(searchCondition.class_code);
    $('#searchClassName').val(searchCondition.group_code);

}

view = (id) => {
    item = enquetes.filter((x) => {
        return x.id == id;
    })[0]
    
    localStorage.setItem('detail_item', JSON.stringify(item));
    location.href = '../エンゲージメントサーベイ比較/init-view.html';
}
courseSearch = () => {

    $('#result').html('');
    res = enquetes;

    ccode = $('#course_code').val();
    if(typeof ccode !== 'undefined' && ccode != ''){
        res = res.filter((x) => {
            return x.from.code.toLowerCase().includes(ccode.toLowerCase()) || x.to.code.toLowerCase().includes(ccode.toLowerCase())
        })
    }

    all = $("#course_name_radio-0:checked").val() === '0' ? true : false;
    cname = $('#course_name').val();
    if(typeof cname !== 'undefined' && cname != ''){
        res = res.filter((x) => {
            if(all)
                return x.from.name==cname || x.to.name==cname;
            else
                return x.from.name.toLowerCase().includes(cname.toLowerCase()) || x.to.name.toLowerCase().includes(cname.toLowerCase());
        })
    }
    if(res.length === 0)
    {
        $('#result').html(`<div class="kc-co-content-box kc-co-no-data-list kc-co-mt30 kc-co-mb30">検索結果がありませんでした。</div>`)
    }
    else{
        overallHtml = html_format_start;
        for(i = 0; i<res.length; i++){
            if(i%2 === 0)
                suffix = 'odd';
            else
                suffix = 'even'

            overallHtml += 
            `
                <tr class="kc-co-table-line-${suffix}">
                    <td style="word-wrap:break-word;word-break:break-all;">
                    ${res[i].from.name} (${res[i].from.code})
                    </td>
                    <td style="word-wrap:break-word;word-break:break-all;">
                    ${res[i].to.name} (${res[i].to.code})
                    </td>

                    <td rowspan="2">
                    <div class="kc-co-td-button">
                        <div class="kc-co-btn-wrap2">
                        <div class="kc-co-btn-wrap1">
                            <div class="kc-co-btn">
                            <button
                                class="kc-co-btn-style kc-co-btn-style-text kc-co-btn-small"
                                type="button" onclick="view(${res[i].id})">表示</button>
                            </div>
                        </div>
                        </div>
                    </div>
                    </td>

                </tr>
                <tr class="kc-co-table-line-${suffix}">
                    <td>
                    ${res[i].from.enquete_name} (${res[i].from.enquete_code})
                    </td>
                    <td>
                    ${res[i].to.enquete_name} (${res[i].to.enquete_code})
                    </td>

                </tr>
            `
        }
        overallHtml += html_format_end;

        $('#result').html(overallHtml);
    }
    
    $('#searchResultList').css('display', 'block');

    searchCondition = {
        course_code : $('#course_code').val(),
        course_name: $('#course_name').val(),
        group_code: $('#searchMainBelongGroupCode').val(),
        group_name: $('#searchMainBelongGroupName').val(),
        class_code: $('#searchClassCode').val(),
        class_name: $('#searchClassName').val(),
        course_start_date: `${$('#fromScheduleStartYear').val()}/${$('#fromScheduleStartMonth').val()}/${$('#fromScheduleStartDay').val()}`,
        course_end_date: `${$('#toScheduleStartYear').val()}/${$('#toScheduleStartMonth').val()}/${$('#toScheduleStartDay').val()}`,
        submission_start_date: `${$('#fromSubmitYear').val()}/${$('#fromSubmitMonth').val()}/${$('#fromSubmitDay').val()}`,
        submission_end_date: `${$('#toSubmitYear').val()}/${$('#toSubmitMonth').val()}/${$('#toSubmitDay').val()}`
    }

    localStorage.setItem('search_condition', JSON.stringify(searchCondition));

}

html_format_start = `
                <div class="kc-co-hr">
                  <hr>
                </div>
                <div class="kc-co-search_count kc-co-pull-right">
                  検索結果&nbsp;:&nbsp;7件中&nbsp;1件目～7件目表示&nbsp;&nbsp;
                  表示件数&nbsp;:&nbsp;
                  <select id="perPage"
                    name="perPage">
                    <option value="20" selected="selected">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="200">200</option>
                  </select>
                </div>
  
                <table class="kc-co-multi-line-table">
                  <thead>
                    <tr>
                      <th class="header-left" width="420px">今回コース名 (コースコード)<br>今回アンケート名 (アンケートID)</th>
                      <th width="420px">前回コース名 (コースコード)<br>前回アンケート名 (アンケートID)</th>
                      <th width="90px">　</th>
                    </tr>
                  </thead>
                  <tbody> `;

html_format_end =  `
                  </tbody>
                </table>
                <div class="kc-co-pagination">
                  &nbsp;&nbsp;&nbsp;&nbsp;
                </div>
            </form>
  
          </div>
        </div>
  
      </div>
      
    <script type="text/JavaScript">
  
                function clearText() {
                  document.getElementById('searchMainBelongGroupCode').value = '';
                  document.getElementById('searchMainBelongGroupName').value = '';
                }
                function clearClass() {
                    $("#searchClassCode").val("");
                    $("#searchClassName").val("");
                }
            
        </script>
  
    <div class="kc-co-jqModal-wrap">
      <div class="kc-co-content-dialog kc-co-transition-dialog" id="transitionDialog" style="display:none;">
        <div class="kc-co-popup-outer kc-co-mb22">
          <h2 class="kc-co-ml20 kc-co-mt20" id="transitionTitle"></h2>
          <p class="kc-co-popup-content-text" id="transitionMessage"></p>
          <hr class="kc-co-bor-hr">
          <div class="kc-co-mt20 kc-co-align-center  kc-co-btn-yesno-align">
            <button class="kc-co-btn-yes-popup"
              onclick="submitForm(&#39;/icm/course-application/init-regist&#39;);return false;"
              type="button">OK</button>
          </div>
        </div>
      </div>
    </div>
`;

enquetes = [
    {
        id: 1,
        from : {
            code: "EmptyDataCourse01",
            name: "Empty Data Course 01",
            enquete_code: 70,
            enquete_name: "Empty Data Enquete 01",
            group_code : "",
            group_name: "",
            resultCount: 1,
            userCount: 2
        },
        to : {
            code: "EmptyDataCourse02",
            name: "Empty Data Course 02",
            enquete_code: 70,
            enquete_name: "Empty Data Enquete 01",
            group_code : "",
            group_name: "",
            resultCount: 2,
            userCount: 3
        }

    },
    {
        id: 2,
        from : {
            code: "ESCourse01",
            name: "ES Course 01",
            enquete_code: 71,
            enquete_name: "enquete Pager 01",
            group_code : "",
            group_name: "",
            resultCount: 6,
            userCount: 6
        },
        to : {
            code: "ESCourse01",
            name: "ES Course 01",
            enquete_code: 71,
            enquete_name: "enquete Pager 01",
            group_code : "",
            group_name: "",
            resultCount: 6,
            userCount: 6
        }
    },
    {
        id: 3,
        from : {
            code: "ESCourse01",
            name: "ES Course 01",
            enquete_code: 71,
            enquete_name: "enquete Pager 01",
            group_code : "",
            group_name: "",
            resultCount: 6,
            userCount: 7
        },
        to : {
            code: "ESCourse01",
            name: "ES Course 01",
            enquete_code: 72,
            enquete_name: "enquete Pager 02",
            group_code : "",
            group_name: "",
            resultCount: 7,
            userCount: 8
        }
    },
    {
        id: 4,
        from : {
            code: "ESCourse01",
            name: "ES Course 01",
            enquete_code: 71,
            enquete_name: "enquete Pager 01",
            group_code : "",
            group_name: "",
            resultCount: 6,
            userCount: 6
        },
        to : {
            code: "ESCourse02",
            name: "ES Course 02",
            enquete_code: 72,
            enquete_name: "enquete Pager 02",
            group_code : "",
            group_name: "",
            resultCount: 6,
            userCount: 6
        }
    },
    {
        id: 5,
        from : {
            code: "ESCourse01",
            name: "ES Course 01",
            enquete_code: 71,
            enquete_name: "enquete Pager 01",
            group_code : "",
            group_name: "",
            resultCount: 7,
            userCount: 7
        },
        to : {
            code: "ESCourse02",
            name: "ES Course 02",
            enquete_code: 71,
            enquete_name: "enquete Pager 01",
            group_code : "",
            group_name: "",
            resultCount: 7,
            userCount: 7
        }
    },
    {
        id: 6,
        from : {
            code: "ESCourse02",
            name: "ES Course 02",
            enquete_code: 71,
            enquete_name: "enquete Pager 01",
            group_code : "",
            group_name: "",
            resultCount: 8,
            userCount: 8
        },
        to : {
            code: "ESCourse01",
            name: "ES Course 01",
            enquete_code: 71,
            enquete_name: "enquete Pager 01",
            group_code : "",
            group_name: "",
            resultCount: 8,
            userCount: 38
        }
    },
    {
        id: 7,
        from : {
            code: "ESCourse02",
            name: "ES Course 02",
            enquete_code: 71,
            enquete_name: "enquete Pager 01",
            group_code : "",
            group_name: "",
            resultCount: 9,
            userCount: 9
        },
        to : {
            code: "ESCourse01",
            name: "ES Course 01",
            enquete_code: 72,
            enquete_name: "enquete Pager 02",
            group_code : "",
            group_name: "",
            resultCount: 9,
            userCount: 9
        }
        
    }

]

