!function () {
var DynCheckbox = {};

DynCheckbox.init = function () {

d3.selectAll(".dynCheckbox").each(

				function(d, i) {
					try {
						var text = d3.select(this).text();
						d3.select(this).text("");
						var json = $.parseJSON(text).data;
						var limit = $.parseJSON(text).limit;
						json = json.slice(0,limit);
						if($.parseJSON(text).data[$.parseJSON(text).data.length-1].type==="More")
						json.push($.parseJSON(text).data[$.parseJSON(text).data.length-1]);
						var id = d3.select(this).attr("id")+Math.random();
						var root = d3.select(this);
						var tags = [];
						for ( var i in json)
							if($.inArray(json[i].type,tags)<0 && json[i].type !=="More")
								tags.push(json[i].type);
							root.selectAll("input").data(tags).enter()
								.append('label').attr('for', function(d, i) {
									return id + i;
								}).text(function(d) {
									return d;
								}).append("input").attr("checked", true)
								.attr("type", "checkbox").attr("id", function(d,i) { return id+i; }).on("change",function(d,i,j){
									root.selectAll('ul li').style("clear",null);
									if(this.checked){
										root.selectAll("."+d).style("display",null);
									}
									else
										root.selectAll("."+d).style("display","none");
									root.select('li:not([style*="display:none"]):not([style*="display: none"])').style("clear","both");
								});
							root.append("ul")
//.style("column-count",function(){return Math.round(json.length/6)})
							.selectAll("li").data(json).enter().append("li").attr("class",function(d){return d.type})
							.append("a").attr("class","blacklink").attr("href",function(d){return d.link}).text(function(d){return d.text;});
					}catch(e){}
				});

};
    this.DynCheckbox = DynCheckbox;
}();
