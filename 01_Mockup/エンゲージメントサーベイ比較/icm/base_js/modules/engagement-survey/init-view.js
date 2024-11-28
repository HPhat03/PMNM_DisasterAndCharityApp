
binding = () => {
    item = localStorage.getItem('detail_item');
    searchCondition = localStorage.getItem('search_condition');

    $('a#downloadBtn').attr({
        target: '_blank',
        href: './sample_file_download.zip'
    })

    if(searchCondition != null){
        searchCondition = JSON.parse(searchCondition)

        if(searchCondition.group_name != '')
            text = searchCondition.group_name;
           else
               text = ' - ';
           
           if(searchCondition.group_code != '')
               text += ` (${searchCondition.group_code})`;
           else
               text += " ( - )"
        $('#groupInfo').html(text);

        if(searchCondition.class_name != '')
            text = searchCondition.class_name;
           else
               text = ' - ';
           
           if(searchCondition.class_code != '')
               text += ` (${searchCondition.class_code})`;
           else
               text += " ( - )"
        $('#classInfo').html(text);

        text = '';
        if(searchCondition.course_start_date != '//')
            text = searchCondition.course_start_date;

        text += ' - ';

        if(searchCondition.course_end_date != '//')
            text += searchCondition.course_end_date;


        $('#courseDate').html(text);

        text = '';
        if(searchCondition.submission_start_date != '//')
            text = searchCondition.submission_start_date;

        text += ' - ';

        if(searchCondition.submission_end_date != '//')
            text += searchCondition.submission_end_date;

        $('#submissionDate').html(text);
            
    }

    if(item != null){
        item = JSON.parse(item);

        if (item.from.userCount > 5) {
            $('#noData').hide();
            $('#hasData').show();

            $('#fromInfo').html(`[今回] ${item.from.name} (アンケートID:${item.from.code})`);
            $('#toInfo').html(`[前回] ${item.to.name} (アンケートID:${item.to.code})`);
            $('#fromEnqueteInfo').html(`${item.from.enquete_name} (${item.from.enquete_code})`);
            $('#toEnqueteInfo').html(`${item.to.enquete_name} (${item.to.enquete_code})`)
            $('.fromEnqueteCount').html(` ${item.from.resultCount} / ${item.from.userCount}`)
            $('.toEnqueteCount').html(` ${item.to.resultCount} / ${item.to.userCount}`)
        } else {
            $('#hasData').hide();
            $('#noData').show();
        }
    }

}

backToSearch = () => {
    localStorage.setItem('auto-search', '1');
    location.href = '../エンゲージメントサーベイ比較検索/init-search.html';
}
