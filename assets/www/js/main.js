var page = 0;
var nextURL = "";
var items;
var loading = false;
//var base_url = "http://www.reddit.com/r/wtf/new/.json?sort=new"
//var base_url = "http://www.reddit.com/r/pics/new/.json?sort=new";
var base_url = "http://www.reddit.com/r/fffffffuuuuuuuuuuuu/.json",
    seen = {};

var pageLoadSuccess = function(response) {
    items = [];
    console.log("jsonp after " + response.data.after );
    $.each(response.data.children, function(index, val) {
        //console.log("objeto"+ val.data.domain)
        if (val.data.domain === "imgur.com") {
            if ( !seen[val.data.permalink] ) {
                var imgURL = val.data.url;

                var extPos = val.data.url.lastIndexOf(".");
                if (extPos != -1 && extPos != 12) {
                    imgURL = imgURL.substring(0, extPos);
                }

                imgURL = imgURL + ".png";
                items.push('<li class="comicContainer" id="' + index + '"><div class="comicHeader"><h3 class="comicTitle">' + val.data.title + '</h3><a class="commentsLink" href="http://www.reddit.com' + val.data.permalink + '">Comments (' + val.data.num_comments + ')</a></div><img src="' + imgURL + '"/></li>');
                seen[val.data.permalink] = true;
            } else {
                console.log("ja vi o "+ val.data.permalink);
            }
        }
    });

    page++;
    var ulID = 'page' + page;
    $('<ul/>', {
        'class': 'page',
        html: items.join(''),
        'id': ulID
    }).appendTo('#comicContainer');

    nextURL = base_url + "?count=25&after=" + response.data.after;
    loading = false;
};


$(document).ready(function(){
	$.ajax({
		type: 'GET',
		//url: 'http://www.reddit.com/r/fffffffuuuuuuuuuuuu/.json',
		url: base_url,
		jsonp: 'jsonp',
		dataType: 'jsonp',
		success: pageLoadSuccess
	});
});

$(window).scroll(function () {
	if (!loading) {
		var scrollPosition = window.pageYOffset;
		var windowSize     = window.innerHeight;
		var bodyHeight     = $(document).height();
		
		var distanceFromBottom = bodyHeight - (scrollPosition + windowSize);

		var comicsSelector = "#page" + page + " > li";

		var last3ComicsHeight = 0;
		var comics = $(comicsSelector);
		var numberOnPage = comics.size();
		var firstIndice = numberOnPage - 4;

		comics.slice(firstIndice, numberOnPage - 1).each(function (index) {
			last3ComicsHeight += $(this).height();
		});

		if (distanceFromBottom < last3ComicsHeight) {
			loading = true;
			$.ajax({
				type: 'GET',
				url: nextURL,
				jsonp: 'jsonp',
				dataType: 'jsonp',
				success: pageLoadSuccess
			});
		}
	}
});



