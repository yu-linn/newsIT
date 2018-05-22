"use strict";
google.charts.load('current', {'packages':['corechart']});
 $(window).scroll(function () {
    if ($(document).height() <= $(window).scrollTop() + $(window).height()) {
        moreArticles()
    }
 });
 
// toggle side navigation
$("#openSide").click(function(){
        $("#Sidenav").css("width","250px");
});

$(".closebtn").click(function(){
        $("#Sidenav").css("width","0px");
});

//toggle search bar
$("#openSearch").click(function() {
    if ($("#searchBar").css("display") == "none") {
        $("#searchBar").css("display", "block");
    } else {
        //search for topic here
        clear();
        $("h3 > b").html("Search Results: "+ $("#searchBar").val());
        $('.btn.btn-info.btn-md').show();
        var url = getUrl();
        fillSite(url);
    }
});

$('.btn.btn-info.btn-md').click(function() {
    var url = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
    //http://localhost:5000
    console.log(url);
    $.ajax({
        type: 'put',
        url: url+'/users/' + $("#searchBar").prop('name') + '/topics/' + $("#searchBar").val(),
        success: function(data) {
            window.location.href = url;
        },
        error: function(err) {
            alert("Topic has already been saved");
        }
    });
});

//if user pressed enter search
$('#searchBar').bind('keypress', function(e) {
    if (e.keyCode == 13) {
        clear();
        $("#Sidenav").css("width", "0px");
        $("h3 > b").html("search results: " + $("#searchBar").val());
        $('.btn.btn-info.btn-md').show();
        var url = getUrl();
        fillSite(url);
    }
});

//Replace page with list of topics
$('#saved_button').click(function() {
    //saved topics
    clear();
    $("#Sidenav").css("width","0px");
    $("h3 > b").html("Saved Topics:");
    $("#listTopics").show();
});

$('.loadSaved').click(function() {
    document.getElementById("graph").innerHTML = "";
    var topic = $(this).text();
    document.getElementById("inputDays").hidden = false;
    $('#inputDays').bind('keypress', function(e) {
        if (e.keyCode==13) {
                var days = $('#inputDays').val();
                if (days > 0) {
                    // Set a callback to run when the Google Visualization API is loaded.
                    google.charts.setOnLoadCallback(drawChart(topic,days));
            }
        }
    });
});

$('#delete_button').click(function() {
    var url = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
    console.log(url);
    var parent = $(this).parent();
    $.ajax({
        type: 'delete',
        url: url+'/users/' + $(this).prop('name'),
        success: function(data) {
            window.location.href = url;
        },
        error: function(err) {
            alert("Delete failed");
        }
    });
});

$('.deleteTopic').click(function() {
    var url = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
    //http://localhost:5000
    console.log(url);
    var parent = $(this).parent();
    $.ajax({
        type: 'delete',
        url: url+'/users/' + $(this).prop('name') + '/topics/' + $(this).val(),
        success: function(data) {
            parent.remove();
        },
        error: function(err) {
            alert("Delete failed");
        }
    });
});

function drawChart(topic, days) {
    var rows = [];
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'date');
    data.addColumn('number', 'SENTIMENT');

    //set current date to the first date (subtract days from current date)
    let today = new Date();
    var currentDay = new Date(today.setDate(today.getDate() - days));

    for (let i = 0; i < days; i++) {
        var from = currentDay.toISOString().substr(0,10)   //substr(0,10) to remove time
        currentDay.setDate(currentDay.getDate()+1)
        var to = currentDay.toISOString().substr(0,10)

        var url = "https://newsapi.org/v2/everything?language=en" 
        + "&from="+ from
        + "&to="+ to
        + "&sortBy=popularity"
        + "&q=" + topic + "&apiKey=0c892f7ce2ee4fd09aef39ff92f65b77"
        + "&pageSize=" + 5;

        getRow(url,from,function(row) {
            data.addRow(row);
        });
    }
    
    // Set chart options
    var options = {'title': topic + ": " + "sentiment analysis past " + days +" days",
                   'width':600,
                   'height':500};

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.LineChart(document.getElementById('graph'));
    chart.draw(data, options);
  }

function getRow(url, isodate, callback) {
    $.ajax({
        type:'GET',
        url:url,
        async: false,
        success:function(data) {
            var score = 0;
            for (let x=0; x < data.articles.length; x++) {
                analyzeSentimentSync((data.articles[x].title + ". " + data.articles[x].description), function(val){
                    score = score + val;
                });
            }
            var sentiment = score / data.articles.length;
            var row = [isodate,sentiment];
            callback(row);
        },
        error       : function(err) {
            console.log(err);
        }
    });
}
$('#signup_button').click(function() {
    //signup page
    clear();
    $("#Sidenav").css("width","0px");
    $(".signupClass").show();
});




$('#login_button').click(function() {
    //login page
    clear();
    $("#Sidenav").css("width","0px");
    $(".loginClass").show();
    
});


$('#logout_button').click(function() {
    //logout page
  	$("/logout").submit();
   	clear();
        $("#Sidenav").css("width","0px");
        $("h3 > b").html("Top Headlines:");
        fillSite('https://newsapi.org/v2/top-headlines?country=us&apiKey=0c892f7ce2ee4fd09aef39ff92f65b77');
});
$('#delete_account').click(function() {
  	$("/deleteAcc").submit();
   	clear();
        $("#Sidenav").css("width","0px");
        $("h3 > b").html("Top Headlines:");
        fillSite('https://newsapi.org/v2/top-headlines?country=us&apiKey=0c892f7ce2ee4fd09aef39ff92f65b77');
});

$("#search_button").click(function() {
        clear();
        $("#Sidenav").css("width","0px");
        $("h3 > b").html("Top Headlines:");
        fillSite('https://newsapi.org/v2/top-headlines?country=us&apiKey=0c892f7ce2ee4fd09aef39ff92f65b77');
});

function home() {
    clear();
    $("#Sidenav").css("width","0px");
    $("h3 > b").html("Top Headlines:");
    fillSite('https://newsapi.org/v2/top-headlines?country=us&apiKey=0c892f7ce2ee4fd09aef39ff92f65b77');

}
function home2() {
    clear();
    $("#Sidenav").css("width","0px");
    $("h3 > b").html("Top Headlines:");
    fillSite('https://newsapi.org/v2/top-headlines?country=us&apiKey=0c892f7ce2ee4fd09aef39ff92f65b77');

}


function getUsername() {
    return ": "+ document.getElementById('usernameText').value + "'s Dashboard";
}

$("#advanced_search").click(function() {
    if ($('#search-options').is(':hidden')) {
         $('#search-options').slideDown();
    } else {
         $('#search-options').slideUp();
    }
});

$(window).bind("load", function() {
    $('#search-options').hide();
    $('.btn.btn-info.btn-md').hide();
    fillSite('https://newsapi.org/v2/top-headlines?country=us&apiKey=0c892f7ce2ee4fd09aef39ff92f65b77');
});

//highlight thumbnail border when mouse enters
$(document).on("mouseover",".thumbnail", function(){
    $(this).css("background-color", "#184496");

})


$(document).on("mouseleave",".thumbnail", function(){
    $(this).css("background-color", "transparent");
    
})

$('#usernameText').on('change', function(){
    $.get('/usernamecheck?username=' + $('#usernameText').val().toLowerCase(), function(response){
        //$("#userText").show()

        if(response.message == "exist"){
            //$("#userText").show()
            $("#signupSubmit").attr("disabled", true);
            $("#signupSubmit").prop("value","Username already taken!");
        }
        else{
            $("#signupSubmit").attr("disabled", false);
            $("#signupSubmit").prop("value","Submit");
        }
    })
})

$('#loginSubmit').on('click', function(){
    $.get('/validLogin?username='+$('#username').val()+'&password='+$('#password').val(), function(response){
		if($('#username').val()=="" ||$('#password').val()==""){
			  alert("All fields must be filled.");
		}
        else if(response.message == "password_wrong" || response.message == "username_wrong") {   
            alert("Wrong username or password! Try again.");
        }
        if(response.message == "success"){
            $("#loginHeader").text("Login")
        }
    })
})

function getUrl() {
    var topic = $("#searchBar").val();
    var sort = $("#sort-by").val();
    var lang = $("#language").val();
    var limit = $("#limit").val();
    if (limit == "") {
        limit = 20;
    }


    return "https://newsapi.org/v2/everything?language=" + lang + "&sortBy=" + sort + "&pageSize=" + limit + "&q=" + topic + "&apiKey=0c892f7ce2ee4fd09aef39ff92f65b77";
}

function clear() {
    $("h3 > b").html("");
    $(".loginClass").hide();
    $(".signupClass").hide();   
    $("#listTopics").hide();  
    $('.btn.btn-info.btn-md').hide();
    $("#search-options").hide();
    document.getElementsByClassName("articles")[0].innerHTML = "";
    document.getElementById("articleContents").style.display = "none";
    document.getElementById("inputDays").hidden = true;
    document.getElementById("graph").innerHTML = "";
}

//fill page with articles
function fillSite(url) {
    document.getElementById("articleContents").style.display = "block";
    $.ajax({
        type:'GET',
        url:url,
        success:function(data) {
            $.each(data.articles, function(i, item) {
                appendArticle(item);
            })
        }
    });

}

//add more articles to page
function moreArticles() {
    var topic = $("#searchBar").val();
    var sort = $("#sort-by").val();
    var lang = $("#language").val();
    var limit = $("#limit").val();
    var num_art = document.getElementsByClassName("articles")[0].children.length;
    if(limit == "") {
        limit = 20;
    }
    var page = num_art / parseInt(limit) + 1
    var url = "https://newsapi.org/v2/everything?language=" + lang + "&sortBy=" + sort + "&pageSize=" + limit + "&page=" + page + "&q=" + topic + "&apiKey=0c892f7ce2ee4fd09aef39ff92f65b77";
    if(topic == "") {
        return
    }
    $.ajax({
        type:'GET',
        url:url,
        success:function(data) {
            $.each(data.articles, function(i, item) {
                appendArticle(item);
            })
        }
    });
}

function appendArticle(item) {
    // Create article
    var article = document.createElement("div");
    article.classList.add("article");  
    document.getElementsByClassName("articles")[0].appendChild(article);

    // Add image
    var contain = document.createElement("div");
    var img = document.createElement("img");
    img.src = item.urlToImage;
    img.style.width = "250px";
    img.style.height = "200px";
    article.appendChild(contain);
    contain.classList.add("thumbnail");
    contain.appendChild(img);
    img.onclick = function() {
        on(item)
    }
    $(img).on('error', function(e) {
        img.src = "favicon.png";
    });

    // Add title
    var title = document.createElement("p");
    var t = document.createTextNode(item.title);
    title.appendChild(t);
    title.classList.add("title");   
    article.appendChild(title);


    var p1 = document.createElement("p");
    var p2 = document.createElement("p");
    p1.innerHTML = "50%";
    p2.innerHTML = "50%";

    var thumbs_div = document.createElement("div");
    thumbs_div.classList.add("td");

    var th_up = document.createElement("img");
    var th_down = document.createElement("img");


    th_up.src = "thumbs_up.png";
    th_down.src = "thumbs_down.png";
    th_up.style.height = "25px";
    th_up.style.width = "25px";
    th_down.style.height = "25px";
    th_down.style.width = "25px";

    thumbs_div.appendChild(th_up);
    thumbs_div.appendChild(p1);
    thumbs_div.appendChild(th_down);
    thumbs_div.appendChild(p2);
    //SENTIMENT ANALYSIS
   // call the analyze function and pass a callback function which will update the DOM once score arrives
     analyzeSentiment(item.title + ". " + item.description, function(val) {
         var val_ = 0;
     if(val < 0) {
            val_ = val * -1.0;
            var temp = val_ + 1.0;
             temp = temp/2.0;
             p2.innerHTML = (temp*100).toFixed(0) + "%";
             var temp2 = 100 - temp*100;
             p1.innerHTML = temp2.toFixed(0) + "%";
         }
        if(val > 0) {
             val_ = val * 1.0;
             var temp = val_ + 1.0;
            temp = temp/2.0;
             p1.innerHTML = (temp*100).toFixed(0) + "%";
            var temp2 = 100 - temp*100;
            p2.innerHTML = temp2.toFixed(0) + "%";
         }
         if(val == 0) {
            p1.innerHTML = "50%";
            p2.innerHTML = "50%";
         }
     });

    article.appendChild(thumbs_div);

    $(".td img, .td p").css('display', 'inline-block')
}

function on(article) {
    var moreInfo = document.getElementById("info");
    document.getElementById("overlay").style.display = "block";
    moreInfo.style.display = "block";
    // Title
    var title = document.createElement("p");
    var t = document.createTextNode(article.title);
    title.appendChild(t);
    title.classList.add("overlayTitle");   
    moreInfo.appendChild(title);
    // Larger image
    var appendImg = document.createElement("img");
    appendImg.src = article.urlToImage;
    appendImg.classList.add("infoImg");
    var a = document.createElement('a');
    a.href = article.url;
    a.target = "_blank";
    a.appendChild(appendImg);
    moreInfo.appendChild(a)
    $(appendImg).on('error', function(e) {
        appendImg.src = "favicon.png";
    });
    // Author and publish date
    var data = document.createElement("p");
    var author = article.author
    if(author == null) {
        author = "Unknown"
    }
    var t = document.createTextNode("Published: " + article.publishedAt + " By: " + author);
    data.appendChild(t);
    data.classList.add("data");   
    moreInfo.appendChild(data);
    // Description
    var description = document.createElement("p");
    var text = article.description
    if(text == null) {
        text = "No description available"
    }
    t = document.createTextNode(text);
    description.appendChild(t);  

    description.classList.add("description"); 
    moreInfo.appendChild(description);
}

function off() {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("info").style.display = "none";
    document.getElementById("info").innerHTML = "";
}


function analyzeSentiment(headline_description, callback) {
    var mykey = "API-Key-Here";
    var score = 3;
    $.ajax({
        type        : "POST",
        url         : "https://language.googleapis.com/v1/documents:analyzeSentiment?key="+ mykey,
        contentType : "application/json",
        data        : '{"document":{"type":"PLAIN_TEXT","content":"'+headline_description+'"}}',
        success     : function(data_) {
            score = data_.documentSentiment.score;
            callback(score);
        },
        error       : function(err) {
            console.log(err);
        }
    });

}


function analyzeSentimentSync(headline_description, callback) {
    var mykey = "API-Key-Here";
    var score = 3;
    $.ajax({
        type        : "POST",
        url         : "https://language.googleapis.com/v1/documents:analyzeSentiment?key="+ mykey,
        contentType : "application/json",
        data        : '{"document":{"type":"PLAIN_TEXT","content":"'+headline_description+'"}}',
        async: false,
        success     : function(data_) {
            score = data_.documentSentiment.score;
            callback(score);
        },
        error       : function(err) {
            console.log(err);
        }
    });
}


