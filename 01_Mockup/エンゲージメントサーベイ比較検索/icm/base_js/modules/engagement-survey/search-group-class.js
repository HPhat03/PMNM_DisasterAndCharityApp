onClosedModal = () => {
    $('#static-modal-group-search').fadeOut(200);
    $('#modal-group-search').css("display","none");
    $('#modal-class-search').css("display","none");
    $('#modal-group-search-result').css("display","none");
    $('#modal-class-search-result').css("display","none");
  }

onOpenModal = (id) => {
    $('#static-modal-group-search').fadeIn(200);
    $('#'+id).css("display","block");
  }

setSearchGrpKW = (id) => {
    kw = $('#' + id).val()
    localStorage.setItem("grpKw", kw);
    $('#searchKeyword').val('');
}



onChangeModal = (id) => {
    $('#modal-group-search').css("display","none");
    $('#modal-class-search').css("display","none");
    $('#modal-group-search-result').css("display","none");
    $('#modal-class-search-result').css("display","none");

    $('#'+id).css("display","block");
    iframe = ($('#Grpiframe'))[0];

    switch (id){
        case 'modal-group-search-result':
            onInitGroupSearch();
            break;
        case 'modal-class-search-result':
                onInitClassSearch();
                break; 
    }
}

onInitGroupSearch = () => {
    gkw = localStorage.getItem('grpKw');
    $('#continueSearchKeyword').val(gkw);

    gkw = gkw.toLowerCase();

    res = groups;
    if(gkw != ''){
        res = [];
        for(i =0; i<groups.length; i++){
            
            grParent = groups[i];
            if(grParent.code.toLowerCase().includes(gkw) || grParent.name.toLowerCase().includes(gkw) )
                res.push(groups[i]);
            else{
                j = 0;
                queue = [...grParent.sub];
                
                while(queue.length > 0){
                    sub = queue.shift()

                    if(sub.code.toLowerCase().includes(gkw) || sub.name.toLowerCase().includes(gkw)){
                        res.push(groups[i]);
                        break;
                    }
                    else if(sub.sub.length >0) {
                        queue = [...queue, ...sub.sub];
                    }
                }
            }
        }
    }

    if(res.length >0){

        textHTML = '';
        key = -1;

        for(i = 0; i< res.length; i++){
            suffix = res[i].sub.length >0 ? "class='submenu'" : "";
            key++;
            textHTML +=   `
            <li ${suffix}>
                    <span>&nbsp;<label><input type="radio" name="radioGroupCode" class="radioGroupCode" value="${key}"
                          ${i==0 ? "checked=''" : ''}">&nbsp;${res[i].name}
                        (${res[i].code})</label></span>
                    <input type="hidden" name="groupCode[${key}]" id="groupCode[${key}]" value="${res[i].code}">
                    <input type="hidden" name="groupName[${key}]" id="groupName[${key}]" value="${res[i].name}">
                    <input type="hidden" name="level[0]" id="level[0]" value="2">
                    <input type="hidden" name="billGroupDiv[0]" id="billGroupDiv[0]" value="3">
            `
            if(res[i].sub.length > 0)
            {
                textHTML += " <ul rel='closed'>";
                sub = res[i].sub;
                for(j = 0; j<sub.length; j++){
                    key++;
                    suffix = sub[j].length >0 ? "class='submenu'" : ""
                    textHTML +=`
                        <li ${suffix}>

                        <span>&nbsp;<label><input type="radio" name="radioGroupCode" class="radioGroupCode"
                              value="${key}">&nbsp;${sub[j].name}
                            (${sub[j].code})</label></span>
                        <input type="hidden" name="groupCode[${key}]" id="groupCode[${key}]" value="${sub[j].code}">
                        <input type="hidden" name="groupName[${key}]" id="groupName[${key}]" value="${sub[j].name}">
                        <input type="hidden" name="level[1]" id="level[1]" value="3">
                        <input type="hidden" name="billGroupDiv[1]" id="billGroupDiv[1]" value="">
                    `
                    if(sub[j].sub.length >0){
                        textHTML += " <ul rel='closed'>";
                        sub = sub[j].sub;
                        for(k = 0; k<sub.length; k++){
                            key++;
                            suffix = sub[k].length >0 ? "class='submenu'" : ""
                            textHTML +=`
                                <li${suffix}>
        
                                <span>&nbsp;<label><input type="radio" name="radioGroupCode" class="radioGroupCode"
                                      value="${key}">&nbsp;${sub[k].name}
                                    (${sub[k].code})</label></span>
                                <input type="hidden" name="groupCode[${key}]" id="groupCode[${key}]" value="${sub[k].code}">
                                <input type="hidden" name="groupName[${key}]" id="groupName[${key}]" value="${sub[k].name}">
                                <input type="hidden" name="level[1]" id="level[1]" value="3">
                                <input type="hidden" name="billGroupDiv[1]" id="billGroupDiv[1]" value="">
                                </li$>`
                        }
                        textHTML += "</ul>"
                    }
                    textHTML += "</li>"
                }
                textHTML += "</ul>"
            }
            textHTML += "</li>"
        }

        $('#treemenu1').html(textHTML);
        ddtreemenu.createTree("treemenu1", true);
    }

}
confirmGrp = () => {
    rads = $('.radioGroupCode');
    index = 0;
    for(i = 0; i<rads.length; i++){
        if(rads[i].checked)
            index = rads[i].value;
    }

    gcode = document.getElementById(`groupCode\[${index}\]`).value;
    gname = document.getElementById(`groupName\[${index}\]`).value;
    $("#searchMainBelongGroupCode").val(gcode);
    $("#searchMainBelongGroupName").val(gname);
    onClosedModal();
}

setSearchClassKW = (id_code, id_name) => {
    kw_code = $('#' + id_code).val()
    kw_name = $('#' + id_name).val()

    localStorage.setItem("classCode", kw_code);
    localStorage.setItem("className", kw_name);

    $('#searchClassCodeModal').val('');
    $('#searchClassNameModal').val('');

}
onInitClassSearch = () => {
    ccode = localStorage.getItem('classCode');
    cname = localStorage.getItem('className');



    $("#continueSearchCode").val(ccode);
    $("#continueSearchName").val(cname);

    ccode = ccode.toLowerCase();
    cname = cname.toLowerCase()

    res = classes;
    if(ccode != '')
        res = res.filter((x) => {
            return x.code.toLowerCase().includes(ccode); 
    })
    if(cname != '')
        res = res.filter((x) => {
            return x.name.toLowerCase().includes(cname);
        })

    if(res.length > 0){
        textHTML = class_text_start;
        for(i = 0; i<res.length; i++){
            if(i%2 == 0)
                suffix = 'even';
            else
                suffix = 'odd';

            textHTML += `
                <tr class="kc-co-table-line-${suffix}">
                              <td class="kc-co-width_S"><input type="radio" name="classes" class="radioClassCode" value="${res[i].code}"></td>
                              <td>
                                <span id="${res[i].code}">${res[i].name}</span>&nbsp;(${res[i].code})
                                <input type="hidden" id="className_${res[i].code}" value="${res[i].name}">
                              </td>
                            </tr>
            `
        }
        textHTML += class_text_end;
        $('#classResult').html(textHTML);
    }
    else{
        $('#classResult').html(
            `
	                	                    検索結果がありませんでした。
	                
	        <div class="kc-co-hr"><hr></div>
            <div class="kc-co-pagination">
                        &nbsp;&nbsp;&nbsp;&nbsp;
                    </div>
            <div class="kc-co-button-area">
                        <button class="kc-co-btn-grey-detail kc-co-btn-modal-close" type="button" onclick="onClosedModal()">閉じる</button>
	                    	            </div>`
        );
    }
}
confirmClass = () => {
    rads = $('.radioClassCode');
    index = 0;
    for(i = 0; i<rads.length; i++){
        if(rads[i].checked)
            index = rads[i].value;
    }

    
    cname = document.getElementById(`className_${index}`).value;
    $("#searchClassCode").val(index);
    $("#searchClassName").val(cname);
    onClosedModal();
}


groups = [
    {
        code: "AnalysisGroup01",
        name: "Analysis Group 01",
        sub: [
            {
                code: "AnalysisGroup011",
                name: "Analysis Group_01_01",
                sub: []
            },
            {
                code: "AnalysisGroup012",
                name: "Analysis Group_01_02",
                sub: []
            },
            {
                code: "AnalysisGroup013",
                name: "Analysis Group_01_03",
                sub: [
                    {
                        code: "AnalysisGroup013",
                        name: "Analysis Group_phat",
                        sub: []
                    }
                ]
            },
            
        ]
    },
    {
        code: "AnalysisGroup02",
        name: "Analysis Group 02",
        sub: [
            {
                code: "AnalysisGroup021",
                name: "Analysis Group_02_01",
                sub: []
            },
            {
                code: "AnalysisGroup022",
                name: "Analysis Group_02_02",
                sub: []
            }
        ]
    }
]

classes = [
    {
        code: "ABVCL01",
        name: "ABVHuynhClass01"
    },
    {
        code: "ABVCL02",
        name: "ABVHuynhClass02"
    },
    {
        code: "ABVCL03",
        name: "ABVHuynhClass03"
    },
    {
        code: "ABVCL04",
        name: "ABVHuynhClass04"
    },
    {
        code: "ABVCL05",
        name: "ABVHuynhClass05"
    },
    {
        code: "ABVCL06",
        name: "ABVHuynhClass06"
    },
    {
        code: "ABVCL07",
        name: "ABVHuynhClass07"
    },
    {
        code: "ABVCL08",
        name: "ABVHuynhClass08"
    },
    {
        code: "ABVCL09",
        name: "ABVHuynhClass09"
    },
    {
        code: "ABVCL10",
        name: "ABVHuynhClass10"
    },
    {
        code: "ABVCL11",
        name: "ABVHuynhClass11"
    },
]

class_text_start = `
    <div class="kc-co-pull-right kc-co-mb7">
                          検索結果&nbsp;:&nbsp;34件中&nbsp;1件目～20件目表示&nbsp;&nbsp;
                          表示件数&nbsp;:&nbsp;<select id="perPage"
                            onchange="javascript:clearElementValue([&#39;pageId&#39;]);submitForm(&#39;/FLM9T/common/search-class/&#39;);"
                            name="perPage" fdprocessedid="pqyhv">
                            <option value="20" selected="selected">20</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                            <option value="200">200</option>
                          </select>
                        </div>
                        <table class="kc-co-tbl-list">
                          <thead>
                            <tr>
                              <th style="width: 45px;">
                              </th>
                              <th>クラス名&nbsp;(クラスコード)</th>
                            </tr>
                          </thead>
                          <tbody>
`
class_text_end = `
    </tbody>
                        </table>

                        <div class="kc-co-hr">
                          <hr>
                        </div>
                    
                        <div class="kc-co-button-area">
                          <button
                              class="kc-co-btn-grey-detail kc-co-btn-modal-close" type="button"
                              fdprocessedid="hcgjok" onclick ="onClosedModal()">閉じる</button>
                          <button
                              class="kc-co-btn-style kc-co-btn-modal" type="button"
                              fdprocessedid="1p202c" onclick="confirmClass()">選択</button>
                        </div> 
`
//Chua co phan trang
                        // <div class="kc-co-pagination">
                        //   &nbsp;&nbsp;<b><span class="kc-co-pagination-current">1</span></b>&nbsp;&nbsp;<a
                        //     href="javascript:void(0)"
                        //     onclick="var form = document.createElement(&quot;form&quot;); var input = &quot;&quot;; form.action = &quot;/FLM9T/common/search-class/&quot;; form.method = &quot;POST&quot;; input = document.createElement(&quot;input&quot;); input.setAttribute(&quot;type&quot;, &quot;hidden&quot;); input.setAttribute(&quot;name&quot;, &quot;hash&quot;); input.setAttribute(&quot;value&quot;, &quot;c5ec5e01c449bb2e22af85e71680fd5d636ef62cd5d4613e15927699285ca404&quot;); form.appendChild(input); input = document.createElement(&quot;input&quot;); input.setAttribute(&quot;type&quot;, &quot;hidden&quot;); input.setAttribute(&quot;name&quot;, &quot;headerAuth&quot;); input.setAttribute(&quot;value&quot;, &quot;ad&quot;); form.appendChild(input); input = document.createElement(&quot;input&quot;); input.setAttribute(&quot;type&quot;, &quot;hidden&quot;); input.setAttribute(&quot;name&quot;, &quot;searchCourseCode&quot;); input.setAttribute(&quot;value&quot;, &quot;&quot;); form.appendChild(input); input = document.createElement(&quot;input&quot;); input.setAttribute(&quot;type&quot;, &quot;hidden&quot;); input.setAttribute(&quot;name&quot;, &quot;searchCompanyCode&quot;); input.setAttribute(&quot;value&quot;, &quot;&quot;); form.appendChild(input); input = document.createElement(&quot;input&quot;); input.setAttribute(&quot;type&quot;, &quot;hidden&quot;); input.setAttribute(&quot;name&quot;, &quot;searchStartDate&quot;); input.setAttribute(&quot;value&quot;, &quot;&quot;); form.appendChild(input); input = document.createElement(&quot;input&quot;); input.setAttribute(&quot;type&quot;, &quot;hidden&quot;); input.setAttribute(&quot;name&quot;, &quot;searchStartTime&quot;); input.setAttribute(&quot;value&quot;, &quot;&quot;); form.appendChild(input); input = document.createElement(&quot;input&quot;); input.setAttribute(&quot;type&quot;, &quot;hidden&quot;); input.setAttribute(&quot;name&quot;, &quot;searchRoomCode&quot;); input.setAttribute(&quot;value&quot;, &quot;&quot;); form.appendChild(input); input = document.createElement(&quot;input&quot;); input.setAttribute(&quot;type&quot;, &quot;hidden&quot;); input.setAttribute(&quot;name&quot;, &quot;isClassManager&quot;); input.setAttribute(&quot;value&quot;, &quot;&quot;); form.appendChild(input); input = document.createElement(&quot;input&quot;); input.setAttribute(&quot;type&quot;, &quot;hidden&quot;); input.setAttribute(&quot;name&quot;, &quot;selectType&quot;); input.setAttribute(&quot;value&quot;, &quot;1&quot;); form.appendChild(input); input = document.createElement(&quot;input&quot;); input.setAttribute(&quot;type&quot;, &quot;hidden&quot;); input.setAttribute(&quot;name&quot;, &quot;searchClassCode&quot;); input.setAttribute(&quot;value&quot;, &quot;&quot;); form.appendChild(input); input = document.createElement(&quot;input&quot;); input.setAttribute(&quot;type&quot;, &quot;hidden&quot;); input.setAttribute(&quot;name&quot;, &quot;searchClassName&quot;); input.setAttribute(&quot;value&quot;, &quot;&quot;); form.appendChild(input); input = document.createElement(&quot;input&quot;); input.setAttribute(&quot;type&quot;, &quot;hidden&quot;); input.setAttribute(&quot;name&quot;, &quot;pageId&quot;); input.setAttribute(&quot;value&quot;, &quot;2&quot;); form.appendChild(input); document.getElementsByTagName(&quot;body&quot;)[0].appendChild(form);form.submit(); return false;"
                        //     class="kc-co-pagination-etc" title="page 2">2</a>&nbsp;&nbsp;<a href="javascript:void(0)"
                        //     onclick="var form = document.createElement(&quot;form&quot;); var input = &quot;&quot;; form.action = &quot;/FLM9T/common/search-class/&quot;; form.method = &quot;POST&quot;; input = document.createElement(&quot;input&quot;); input.setAttribute(&quot;type&quot;, &quot;hidden&quot;); input.setAttribute(&quot;name&quot;, &quot;hash&quot;); input.setAttribute(&quot;value&quot;, &quot;c5ec5e01c449bb2e22af85e71680fd5d636ef62cd5d4613e15927699285ca404&quot;); form.appendChild(input); input = document.createElement(&quot;input&quot;); input.setAttribute(&quot;type&quot;, &quot;hidden&quot;); input.setAttribute(&quot;name&quot;, &quot;headerAuth&quot;); input.setAttribute(&quot;value&quot;, &quot;ad&quot;); form.appendChild(input); input = document.createElement(&quot;input&quot;); input.setAttribute(&quot;type&quot;, &quot;hidden&quot;); input.setAttribute(&quot;name&quot;, &quot;searchCourseCode&quot;); input.setAttribute(&quot;value&quot;, &quot;&quot;); form.appendChild(input); input = document.createElement(&quot;input&quot;); input.setAttribute(&quot;type&quot;, &quot;hidden&quot;); input.setAttribute(&quot;name&quot;, &quot;searchCompanyCode&quot;); input.setAttribute(&quot;value&quot;, &quot;&quot;); form.appendChild(input); input = document.createElement(&quot;input&quot;); input.setAttribute(&quot;type&quot;, &quot;hidden&quot;); input.setAttribute(&quot;name&quot;, &quot;searchStartDate&quot;); input.setAttribute(&quot;value&quot;, &quot;&quot;); form.appendChild(input); input = document.createElement(&quot;input&quot;); input.setAttribute(&quot;type&quot;, &quot;hidden&quot;); input.setAttribute(&quot;name&quot;, &quot;searchStartTime&quot;); input.setAttribute(&quot;value&quot;, &quot;&quot;); form.appendChild(input); input = document.createElement(&quot;input&quot;); input.setAttribute(&quot;type&quot;, &quot;hidden&quot;); input.setAttribute(&quot;name&quot;, &quot;searchRoomCode&quot;); input.setAttribute(&quot;value&quot;, &quot;&quot;); form.appendChild(input); input = document.createElement(&quot;input&quot;); input.setAttribute(&quot;type&quot;, &quot;hidden&quot;); input.setAttribute(&quot;name&quot;, &quot;isClassManager&quot;); input.setAttribute(&quot;value&quot;, &quot;&quot;); form.appendChild(input); input = document.createElement(&quot;input&quot;); input.setAttribute(&quot;type&quot;, &quot;hidden&quot;); input.setAttribute(&quot;name&quot;, &quot;selectType&quot;); input.setAttribute(&quot;value&quot;, &quot;1&quot;); form.appendChild(input); input = document.createElement(&quot;input&quot;); input.setAttribute(&quot;type&quot;, &quot;hidden&quot;); input.setAttribute(&quot;name&quot;, &quot;searchClassCode&quot;); input.setAttribute(&quot;value&quot;, &quot;&quot;); form.appendChild(input); input = document.createElement(&quot;input&quot;); input.setAttribute(&quot;type&quot;, &quot;hidden&quot;); input.setAttribute(&quot;name&quot;, &quot;searchClassName&quot;); input.setAttribute(&quot;value&quot;, &quot;&quot;); form.appendChild(input); input = document.createElement(&quot;input&quot;); input.setAttribute(&quot;type&quot;, &quot;hidden&quot;); input.setAttribute(&quot;name&quot;, &quot;pageId&quot;); input.setAttribute(&quot;value&quot;, &quot;2&quot;); form.appendChild(input); document.getElementsByTagName(&quot;body&quot;)[0].appendChild(form);form.submit(); return false;"
                        //     class="kc-co-pagination-etc" title="next page">Next &gt;</a>
                        // </div>
                        