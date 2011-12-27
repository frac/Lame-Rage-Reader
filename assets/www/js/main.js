"use strict";
var page = 0,
    nextURL = "",
    items,
    loading = false,
    //base_url = "http://www.reddit.com/r/gonewild/.json?foo=1",
    //base_url = "http://www.reddit.com/.json?feed=7e73de803f62396bfe33e75fd1aa49a48958cdd0&user=fractalk",

    //base_url = "http://www.reddit.com/r/pics/new/.json?sort=new",
    base_url = "http://www.reddit.com/r/fffffffuuuuuuuuuuuu/.json",
    seen = [],



include = function(arr,obj) {
    return (arr.indexOf(obj) != -1);
},
append = function(arr,obj) {
    arr.push(obj);
},

page_error = function(res, stat, foo) {
    console.log("erro ao pegar pagina "+ res.responseText + " - " + foo);
},


pageLoadSuccess = function(response) {
    items = [];
    console.log("jsonp after " + response.data.after );
    $.each(response.data.children, function(index, val) {
        console.log("peguei "+ val.data.domain);
        if (val.data.domain === "imgur.com" || val.data.domain === "i.imgur.com") {
		console.log("apresentando");
            if ( !include(seen, val.data.id) ) {
                var imgURL = val.data.url;

                var extPos = val.data.url.lastIndexOf(".");
                if (extPos != -1 && extPos != 12) {
                    imgURL = imgURL.substring(0, extPos);
                }

                imgURL = imgURL + ".png";
                items.push('<li class="comicContainer" id="' + index + '"><div class="comicHeader"><h3 class="comicTitle">' + val.data.title + '</h3><a class="commentsLink" href="http://www.reddit.com' + val.data.permalink + '">Comments (' + val.data.num_comments + ')</a></div><img src="' + imgURL + '" class="the_comics"/></li>');
                append(seen, val.data.id);
            } else {
                console.log("ja vi o "+ val.data.permalink);
            }
        }
    });
    console.log("salvando "+ seen.length +" itens");
    if (seen.length > 600){
        seen.splice(0,seen.length - 600);
    }
    window.localStorage.setItem("seen", seen);

    page++;
    var ulID = 'page' + page;
    $('<ul/>', {
        'class': 'page',
        html: items.join(''),
        'id': ulID
    }).appendTo('#comicContainer');

    nextURL = base_url + "?count=25&after=" + response.data.after;
    loading = false;
    if (items.length < 3){
        console.log("Nao achei comics o suficiente");
        load_comics();    
    }

},
load_comics = function() {
    loading = true;
    $.ajax({
        type: 'GET',
        url: nextURL,
        jsonp: 'jsonp',
        dataType: 'jsonp',
        success: pageLoadSuccess,
        error: page_error
    });
},
clear_history =  function() {
    console.log("limpando a bagaca");
    seen = [];
    window.localStorage.clear();
    window.location.reload();
},

//$(document).ready(

onDeviceReady = function() {
    //db = window.openDatabase("fooo", "0.1", "fooDB", 1000000);
    console.log("iniciando");
    seen = window.localStorage.getItem("seen") ;
    if ( seen === undefined || seen === null ){
        seen = [];
    } else {
        seen = seen.split(",");       
    }

    console.log("tenho armazenado "+ (typeof seen) );
    $("#clear").click(function (e){ e.preventDefault(); clear_history();  });
    $("#reload").click(function (e){ window.location.reload();  });
    nextURL = base_url;
    load_comics();
};

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
            load_comics();
		}
	}
});



