d3.selectAll(".wikifikation").each(function (d, i) {
	var item = d3.select(this);
	var options = item.attr("value").split(";");
	var language = options[0];
	var search= options[1];

	$.ajax({
		type: "GET",
		url: "https://"+language+".wikipedia.org/w/api.php?action=query&list=search&srsearch="+search+"&srwhat=text&srprop=timestamp&continue=&srlimit=1&format=json&callback=?",
		contentType: "application/json; charset=utf-8",
		async: true,
		dataType: "json",
		format:"json",

		success: function (data, textStatus, jqXHR) {
		    if(data.query.search.length){
		        var text = item.text();
		        item.text("").append("a").attr("href", "http://"+language+".wikipedia.org/wiki/"+data.query.search[0].title).text(text);
		    }
		},
		error: function (errorMessage) {
		}
	    });
});

