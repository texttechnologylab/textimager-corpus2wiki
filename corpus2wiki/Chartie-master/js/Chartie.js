if (HTMLCollection.prototype.forEach === undefined) {
    HTMLCollection.prototype.forEach = function(callback, thisObj) {
        Array.prototype.forEach.call(this, callback, thisObj);
    }
}

if (NodeList.prototype.forEach === undefined) {
	  NodeList.prototype.forEach = function(callback, thisObj) {
	    Array.prototype.forEach.call(this, callback, thisObj);
	}
}

if (String.prototype.hashCode === undefined) {
  const HASH_LENGTH=Math.pow(2,31)-1;
  String.prototype.hashCode = function(){
  		var hash = 0;
  		if (this.length == 0) return hash;
  		for (i = 0; i < this.length; i++) {
  			char = this.charCodeAt(i);
  			hash = (char << 6) + (hash << 16) - hash + char;
  			hash = hash & hash;// Convert to 32bit integer
  		}
  		return hash & HASH_LENGTH;
  }
}

if (Array.prototype.remove === undefined) {
  Array.prototype.remove = function() {
      var what, a = arguments, L = a.length, ax;
      while (L && this.length) {
          what = a[--L];
          while ((ax = this.indexOf(what)) !== -1) {
              this.splice(ax, 1);
          }
      }
      return this;
  }
}

var container = document.getElementsByClassName("chart-container");
if ( container ) {
  var margin = {
      top: 20,
      right: 40,
      bottom: 35,
      left: 55
  },
  def_x_type        = "temp",
  def_y_type        = "solub",
  def_null          = false,
  def_delim         = ';',
  symb_height       = 15,
  root              = [],
  data              = [],
  exclude           = [],
  sorted            = [],
  x                 = [],
  y                 = [],
  legend            = [],
  chart             = [],
  tip               = [],
  width             = [],
  height            = [];

  if (window.scale_types === undefined){
    var def_legend_title  = "Solvents:";
    var types             = [{
      name  : "general",
      title : "Change please",
      units : [  "a",    "f",       "p",           "n",              "m",              "c",               "d",                 "",                   "K",                      "M",                       "G",                            "T",                              "P"                 ],
      coeffs: [ 1000,  1000000,  1000000000,  1000000000000,  1000000000000000, 10000000000000000, 100000000000000000, 1000000000000000000, 1000000000000000000000, 1000000000000000000000000, 1000000000000000000000000000, 1000000000000000000000000000000, 1000000000000000000000000000000000]
    },{
      name  : "time",
      title : "Time",
      units : ["s", "min", "hour", "day",  "month",  "year" ],
      coeffs: [ 1,   60,    3600,  86400,  2629728, 31556736]
    },
    {
      name  : "mass",
      title : "Mass",
      units : ["mg", "ct",  "g",  "oz",  "lb",    "kg",    "ton"   ],
      coeffs: [ 1,   200,  1000, 28350, 453600, 1000000, 1000000000]
    },
    {
      name  : "length",
      title : "Length",
      units : ["mm", "cm", "in",  "ft",   "yd",  "m",   "km",   "mile"],
      coeffs: [ 1,    10,  25.4,  304.8, 914.4, 1000, 1000000, 1609000]
    },
    {
      name  : "area",
      title : "Area",
      units : ["mm2", "cm2", "in2", "dm2", "ft2",  "yd2",    "m2",     "a",       "da",      "acre",      "ha",        "km2",         "mile2"   ],
      coeffs: [ 1,     100,  645.2, 10000, 92900, 836100,  1000000, 100000000, 1000000000, 4047000000, 10000000000, 1000000000000, 2590000000000]
    },
    {
      name  : "volume",
      title : "Volume",
      units : ["mm3", "cm3",  "pt",    "qt",    "l",    "gal",    "br",       "m3",          "km3"       ],
      coeffs: [  1,   1000,  473200, 946400, 1000000, 3785000, 159000000, 1000000000, 1000000000000000000]
    },
    {
      name  : "speed",
      title : "Speed",
      units : ["mps", "knot", "mph",  "fps", "kph", "kps",    "c"   ],
      coeffs: [  1,   1.944,  2.237,  3.281,  3.6,  1000,  299792458]
    },
    {
      name  : "temp",
      title : "Temperature",
      units : ["C", "K", "F", "Ra"]
    },
    {
      name  : "solub",
      title : "Solubility",
      units : ["g/100g", "%"]
    }];
  } else {
    var def_legend_title  = window.def_legend_title;
    var types             = window.scale_types;
  }

  var page_params=document.getElementsByTagName('body')[0].className,
      dark=(page_params.indexOf("dark") !== -1);

  if (dark) {
      var color_axis = "#b7b7b7";
      var color_text = "#aaaaaa";
      var color_grid = "#515151";
  } else {
      var color_axis = "#333333";
      var color_text = "#515151";
      var color_grid = "#e0e0e0";
  }

    container.forEach(function(item, id) {
        load_csv(id);
    });
}

function load_csv(id)
{
  root[id] = container[id].getAttribute('data');
  if (root[id].match(/^(http\:|https\:|ftp\:)*(\/\/)/gi) !== null ) {
    var xhr;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xhr.open("GET", root[id], true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
        root[id] = xhr.responseText;
        get_params(id);
      }
    }
    xhr.send(null);
  } else {
    get_params(id);
  }
}

function get_params(id) {
  var delimiter = container[id].getAttribute('delimiter')  !== null ? container[id].getAttribute('delimiter') : def_delim;
  parce_csv(root[id], delimiter, id);
  root[id].sort(function(a, b) {
    return d3.ascending(a.name, b.name) || d3.ascending(a.x, b.x);
  });

  //get sorted unique names for legend and toogle
  sorted[id]    = [];
  var unique    = d3.nest()
                    .key(function(d) {
                      return d.name;
                    })
                    .entries(root[id]);
  unique.forEach(function(item,i){
    sorted[id].push(item.key);
  });

  sorted[id].sort(function(a, b) {
      return d3.ascending(a, b)
  });

  width[id]  = parseInt(container[id].getAttribute('width'));
  height[id] = parseInt(container[id].getAttribute('height'));

  legend[id]  = {title : (container[id].getAttribute('legend_title')  !== null ? container[id].getAttribute('legend_title')                   : def_legend_title)};
  chart[id]   = {};
	x[id]       = {};
  x[id].type  = (container[id].getAttribute('x_type')  !== null) ? container[id].getAttribute('x_type' )                        : def_x_type;
  x[id].null  = (container[id].getAttribute('x_null')  !== null) ? container[id].getAttribute('x_null' ).match(/^(1|true)$/gui) : def_null;
  x[id].title = (container[id].getAttribute('x_title') !== null) ? container[id].getAttribute('x_title')                        : get_title(x[id].type);
  x[id].unit  = (container[id].getAttribute('x_unit')  !== null) ? container[id].getAttribute('x_unit' )                        : get_unit( x[id].type);
  x[id].I     = get_i(x[id].type, x[id].unit);
  x[id].i     = get_i(x[id].type, x[id].unit);

  y[id]       = {};
  y[id].type  = (container[id].getAttribute('y_type')  !== null) ? container[id].getAttribute('y_type' )                        : def_y_type;
  y[id].null  = (container[id].getAttribute('y_null')  !== null) ? container[id].getAttribute('y_null' ).match(/^(1|true)$/gui) : def_null;
  y[id].title = (container[id].getAttribute('y_title') !== null) ? container[id].getAttribute('y_title')                        : get_title(y[id].type);
  y[id].unit  = (container[id].getAttribute('y_unit')  !== null) ? container[id].getAttribute('y_unit' )                        : get_unit( y[id].type);
  y[id].I     = get_i(y[id].type, y[id].unit);
  y[id].i     = get_i(y[id].type, y[id].unit);

  draw(id);
}

function parce_csv(csv, delim,  id)
{
    var format_4    = "([^"+delim+"]*)"+delim+"([\\d\\.\\,]+)"+delim+"([\\d\\.\\,]+)"+delim+"(\\d*)",
        format_3    = "([^"+delim+"]*)"+delim+"([\\d\\.\\,]+)"+delim+"([\\d\\.\\,]+)",
        line;

        root[id]    = [],
        exclude[id] = [];

    if ((line = csv.match(RegExp(format_4, 'gi'))) !== null ) {
      line.forEach(function(item, i) {
        var d=item.match(RegExp(format_4, 'i'));
        root[id].push(
                  { "name"   : d[1].trim(),
                      "x"    : parseFloat(d[2]),
                      "y"    : parseFloat(d[3])
                    });
        if (parseInt(d[4].trim()) === 0 && exclude[id].indexOf(d[1].trim()) === -1) {
          exclude[id].push(d[1].trim());
        }
      });
    } else if ((line = csv.match(RegExp(format_3, 'gi'))) !== null ) {
      line.forEach(function(item, i) {
        var d=item.match(RegExp(format_3, 'i'));
        root[id].push(
                  { "name"   : d[1].trim(),
                      "x"    : parseFloat(d[2]),
                      "y"    : parseFloat(d[3])
                    });
      });
    } else {
      console.log("CSV data format is wrong!");
    }
}

function draw_all()
{
  container.forEach(function(item,id) {
      draw(id);
  });
}
function draw(id)
{
    calc_width (id);
    calc_height(id);

    get_data(id);
    recalc_x(id);
    recalc_y(id);

    clear_container(id);
    init_container(id);
    add_x_axis(id);
    add_y_axis(id)
    add_line(id);
    add_legend(id);
    set_color(id);
    set_size(id);
}

function get_data(id)
{
  data[id] = root[id].filter(function(item, i) {
      return exclude[id].indexOf(item.name) === -1;
  });
}


function get_x_min(id)
{
  return x[id].null ? 0 : d3.min(data[id], function(d) {
      return Math.floor(d.x);
  });

}

function get_y_min(id)
{
  return y[id].null ? 0 : d3.min(data[id], function(d) {
      return Math.floor(d.y / 3)*3;
  });

}

function get_x_max(id)
{
  return d3.max(data[id], function(d) {
      return Math.ceil(d.x);
  });

}

function get_y_max(id)
{
  return d3.max(data[id], function(d) {
      return Math.ceil(d.y / 3)*3;
  });

}

function get_title(type)
{
  for (var j=0; j< types.length; ++j) {
    var item = types[j];
    if (item.name === type) {
      return item.title;
    }
  }
}

function get_coeff(type, i)
{
  if (i === undefined) i=0;
  for (var j=0; j< types.length; ++j) {
    var item = types[j];
    if (item.name === type) {
      return item.coeffs[i];
    }
  }
}

function get_unit(type, i)
{
  if (i === undefined) i=0;
  for (var j=0; j< types.length; ++j) {
    var item = types[j];
    if (item.name === type) {
      return item.units[i];
    }
  }
}

function unit_name(type, unit)
{
  var name = unit.replace("2", "²").replace("3","³");
  if (type === "speed")               name = name.replace("p","/");
  if (type === "temp")                name = "°" + name;
  return name;
}

function get_i(type, unit)
{
  for (var j=0; j< types.length; ++j) {
    var item = types[j];
    if (item.name === type) {
      var i = item.units.indexOf(unit);
      if (type === "general" && i === -1) {
          i = item.units.indexOf(unit.substring(0, 1));
      }
      if (i === -1) i = 0;
      return i;
    }
  }
  return 0;
}


function next_i(type, i)
{
  for (var j=0; j< types.length; ++j) {
    var item = types[j];
    if (item.name === type) {
      i = (i+1) % item.units.length;
      return i;
    }
  }
  return 0;
}

function recalc_x(id)
{
  data[id] = data[id].map(function(item, i) {
      return {
          "name": item.name,
          "x": round2(convert_data(x[id].type, x[id].i, normalize_data(x[id].type, x[id].I, item.x))),
          "y": item.y
      };
  });
}

function recalc_y(id)
{
  data[id] = data[id].map(function(item, i) {
      return {
          "name": item.name,
          "x": item.x,
          "y": round2(convert_data(y[id].type, y[id].i, normalize_data(y[id].type, y[id].I, item.y)))
      };
  });
}

function convert_data(type, i, num)
{
  switch(type){
    case "general":
    case "time":
    case "mass":
    case "length":
    case "area":
    case "volume":
    case "speed":
      return num / get_coeff(type, i);
    case "temp":
      switch(i){
        case 1:
          return num + 273.15;
        case 2:
          return num * 9 / 5 + 32;
        case 3:
          return (num + 273.15 )* 1.8;
      }
      break;
    case "solub":
      switch(i){
        case 1:
          return (100 * num) / (100 + num);
      }
      break;
  }
  return num;
}

function normalize_data(type, i, num)
{
  switch(type){
    case "general":
    case "time":
    case "mass":
    case "length":
    case "area":
    case "volume":
    case "speed":
      return num * get_coeff(type, i);
    case "temp":
      switch(i){
        case 1:
          return num - 273.15;
        case 2:
          return (num - 32 ) * 5 / 9;
        case 3:
          return (num - 273.15) / 1.8;
      }
      break;
    case "solub":
      switch(i){
        case 1:
          return (100 * num) / (100 - num);
      }
      break;
  }
  return num;
}

function clear_container(id)
{
  d3.select(container[id]).selectAll("svg,div").remove();
}

function init_container(id)
{
  chart[id].container = d3.select(container[id]).append("div").attr("class","chart").append("svg").attr("transform", "translate(0,0)");
}

function calc_width(id)
{
  var legend_width  = 0;
  sorted[id].forEach(function(name) {
    legend_width = Math.max(legend_width, get_text_width(name)+20, 80);
  });

  legend[id].width = legend_width;

  if (isNaN(width[id])) {
      chart[id].width  = Math.max(((window.innerWidth  !== 0) ? window.innerWidth  : screen.width )-220, 735);
      window.addEventListener("resize", draw_all);
  } else {
    chart[id].width = width[id];
  }
  chart[id].width = chart[id].width - legend[id].width;
}

function calc_height(id)
{
  if (isNaN(height[id])) {
      chart[id].height = Math.max(((window.innerHeight !== 0) ? window.innerHeight : screen.height)-90, 360);
      window.addEventListener("resize", draw_all);
  } else {
    chart[id].height = height[id];
  }

  var legend_height = 0;
  legend_height = Math.max(chart[id].height-10, sorted[id].length * symb_height );

  legend[id].height = legend_height;
}

function get_text_width(text, font) {
    var canvas = get_text_width.canvas || (get_text_width.canvas = document.createElement("canvas"));
    if (font === undefined) font="14px Arial";
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
}

function round2(number)
{
  return Math.round(number * 100) / 100;
}

function add_x_axis(id)
{
  x[id].scale = d3.scaleLinear()
      .domain([get_x_min(id), get_x_max(id)])
      .rangeRound([0, chart[id].width-margin.left-30]);

  x[id].axis = d3.axisBottom(x[id].scale)
      .tickSizeInner(-chart[id].height+margin.top+margin.bottom-10)
      .tickSizeOuter(2)
      .tickPadding(5);

  var x_axis_container = chart[id].container.append("g").attr("class", "x axis").attr("transform", "translate("+margin.left+"," + (chart[id].height-margin.bottom) + ")");

  var x_axis_line = x_axis_container.append("g")
      .attr("class", "plot")
      .call(x[id].axis);

  var x_axis_title = x_axis_container.append("text")
      .attr("class", "title")
      .attr("x", (chart[id].width - margin.left - get_text_width(x[id].title)) / 2 - 34)
      .attr("y", margin.bottom-5)
      .text(x[id].title)
      .on("click", function() {
          return toggle_axis(id, "x");
      });

  var x_axis_unit = x_axis_container.append("text")
      .attr("class", "unit")
      .attr("x", chart[id].width - margin.left - get_text_width(x[id].unit)-26)
      .attr("y", margin.bottom-5)
      .text(unit_name(x[id].type,x[id].unit))
      .on("click", function() {
          return toggle_axis(id, "x_unit");
      });
}

function add_y_axis(id)
{
  y[id].scale = d3.scaleLinear()
      .domain([get_y_min(id), get_y_max(id)])
      .range([chart[id].height-margin.top-margin.bottom+0.5, -margin.top+10]);

  y[id].axis = d3.axisLeft(y[id].scale)
      .tickSizeInner(-chart[id].width+margin.left+30)
      .tickSizeOuter(2)
      .tickPadding(5);

  var y_axis_container = chart[id].container.append("g").attr("class", "y axis").attr("transform", "translate("+(margin.left)+","+(margin.top)+")");

  var y_axis_line = y_axis_container.append("g")
      .attr("class", "plot")
      .call(y[id].axis);

  var y_axis_title = y_axis_container.append("text")
      .attr("class", "title")
      .attr("transform", "rotate(-90)")
      .attr("x", -(chart[id].height + get_text_width(y[id].title)) / 2 + margin.top)
      .attr("y", -margin.left / 1.5)
      .text(y[id].title)
      .on("click", function() {
          return toggle_axis(id, "y");
      });

  var y_axis_unit = y_axis_container.append("text")
      .attr("class", "unit")
      .attr("transform", "rotate(-90)")
      .attr("x", (-get_text_width(y[id].unit))+10)
      .attr("y", -margin.left / 1.5)
      .text(unit_name(y[id].type,y[id].unit))
      .on("click", function() {
          return toggle_axis(id, "y_unit");
      });
}

function toggle_axis(id, name)
{
    switch (name) {

        case "x":
            x[id].null = !x[id].null;
            break;
        case "y":
            y[id].null = !y[id].null;
            break;
        case "x_unit":
            x[id].i     = next_i(x[id].type, x[id].i);
            if (x[id].type === "general"){
              if (x[id].i !== 7){
                x[id].unit = get_unit(x[id].type, x[id].i) + x[id].unit.substr(1);
              } else {
                x[id].unit = get_unit(x[id].type, x[id].i) + x[id].unit;
              }
            } else if (x[id].type !== "no"){
              x[id].unit = get_unit(x[id].type, x[id].i);
            }
            break;
        case "y_unit":
            y[id].i     = next_i(y[id].type, y[id].i);
            if (y[id].type === "general"){
              if (y[id].i !== 7){
                y[id].unit = get_unit(y[id].type, y[id].i) + y[id].unit.substr(1);
              } else {
                y[id].unit = get_unit(y[id].type, y[id].i) + y[id].unit;
              }
            } else if (y[id].type !== "no"){
              y[id].unit = get_unit(y[id].type, y[id].i);
            }
            break;
    }
    draw(id);
}

function add_line(id)
{
  var line = d3.line()
      .x(function(d) {
          return x[id].scale(d.x);
      })
      .y(function(d) {
          return y[id].scale(d.y);
      })

  var chart_svg = chart[id].container.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  var chart_lines = d3.nest()
      .key(function(d) {
          return d.name;
      })
      .entries(data[id]);

  chart_lines.forEach(function(d, i) {

      var color = intence("hsl(" + d.key.toString().hashCode() + ",100%,35%)", false);

      if( d.values.length > 1) {
        chart_svg.append("path")
            .attr("class", "plot")
            .attr("d", line(d.values))
            .attr("stroke", color)
            .attr("stroke-width", 2)
            .attr("fill", "none");

        chart_svg.append("path")
            .attr("class", "plot-event")
            .attr("d", line(d.values))
            .attr("stroke", "transparent")
            .attr("stroke-width", 10)
            .attr("fill", "none")
            .on("mouseenter", function() {
                highlight_item(id, d.key);
            })
            .on("mousemove", function(d) {
              var point = d3.mouse(container[id]);
              show_tip(id,
                       point[0],
                       point[1]
                      );
            })
            .on("touchstart", function() {
              var point = d3.touches(container[id]);
              show_tip(id,
                       point[0][0],
                       point[0][1]
                      );
              highlight_item(id, d.key);
            })/*
            .on("mouseout", function(event) {
                hide_tip(id);
                unselect_legend(id);
            })*/
            .on("dblclick", function() {
              toggle_line(id, d.key);
            });
      }
      chart_svg.selectAll("dot")
          .data(d.values)
          .enter().append("circle")
          .attr("class", "dot")
          .attr("cx", function(d) {
              return x[id].scale(d.x);
          })
          .attr("cy", function(d) {
              return y[id].scale(d.y);
          })
          .attr("r", 3)
          .attr("fill", color)
          .attr("stroke", "transparent")
          .attr("stroke-width", 10)
          .on("mouseenter", function() {
            var point = d3.mouse(container[id]);
            show_tip(id,
                     point[0],
                     point[1],
                     this.__data__.y
                    );
            highlight_item(id, d.key);
          })
          .on("touchstart", function() {
            var point = d3.touches(container[id]);
            show_tip(id,
                     point[0][0],
                     point[0][1],
                     this.__data__.y
                   );
            highlight_item(id, d.key);
          })/*
          .on("mouseout", function(event) {
              hide_tip(id);
              unselect_legend(id);
          })*/
          .on("dblclick", function() {
            toggle_line(id, d.key);
          });

  });

  tip[id]       = chart_svg.append("text")
                            .attr("class", "tooltip")
                            .style("opacity", 0);
}

function toggle_line(id, name)
{
    if (name !== "*") {
        if (exclude[id].indexOf(name) !== -1) {
            exclude[id].remove(name);
        } else {
            exclude[id].push(name);
        }
    } else {
        if (exclude[id].length !== sorted[id].length) {
            exclude[id]= sorted[id].map(function(d) {return d; });
        } else {
            exclude[id]=[];
        }
    }
    draw(id);
}

function show_tip(id, dx, dy, text)
{
  if (text === undefined) {
    text = Math.round((y[id].scale.invert(dy - margin.top)) * 100) / 100;
  }
  tip[id].html(text)
      .attr("x", dx - margin.left)
      .attr("y", dy - margin.top - 5);
  tip[id].transition()
      .duration(100)
      .style("opacity", .9);
}
function hide_tip(id)
{
  tip[id].style("opacity", 0);
}

function add_legend(id)
{
  legend[id].container=d3.select(container[id]).append("div").attr("class", "legend");

  var legend_title=legend[id].container.append("div")
       .attr("class", "title")
       .attr("transform", "translate(10,0)")
       .text(legend[id].title)
       .on("click", function() {
         return toggle_line(id, "*");
       });

  var legend_svg=legend[id].container.append("div")
      .attr("class", "container")
      .append("svg")
      .attr("transform", "translate(10,0)")
      .append("g");

  sorted[id].forEach(function(name, i) {

      var color = intence("hsl(" + name.toString().hashCode() + ",100%,35%)", false);

      legend_svg.append("circle")
          .attr("class", "dot")
          .attr("cx", 5)
          .attr("cy", (i + 1) * 15 - 5)
          .attr("r", 4)
          .attr("fill", ((exclude[id].indexOf(name) !== -1) ? "transparent" : color))
          .attr("stroke", ((exclude[id].indexOf(name) !== -1) ? color : "transparent"))
          .attr("stroke-width", 1)
          .on("click", function() {
              return toggle_line(id, name);
          });

      legend_svg.append("text")
          .attr("class", "item")
          .attr("x", 16)
          .attr("y", (i + 1) * 15 - 1)
          .attr("fill", ((exclude[id].indexOf(name) !== -1) ? unintence(unintence(color_text)) : color_text))
          .text(function() {
              return name;
          })
          .on("click", function() {
              return toggle_line(id, name);
          });

  });
}

function highlight_item(id, name)
{
    var legend = d3.select(container[id]).selectAll(".legend .item");
    legend.transition()
        .duration(100)
        .filter(function() {
            if (this.innerHTML.indexOf(name) !== -1) {
                this.style.fontWeight = "bold";
            } else {
                this.style.fontWeight = "normal";
            };
        });
}

function unhighlight_item(id)
{
    var legend = d3.select(container[id]).selectAll(".legend .item");
    legend.transition()
        .duration(100)
        .style("font-weight", "normal");
}

function set_color(id)
{
  d3.select(container[id]).selectAll(".title,.unit")
      .attr("fill", color_axis)
      .style("color", color_axis);
  d3.select(container[id]).selectAll(".domain")
      .attr("stroke", color_axis);

  d3.select(container[id]).selectAll(".axis .plot")
      .attr("stroke", color_grid);
  d3.select(container[id]).selectAll(".tick > line")
      .attr("stroke", color_grid);

  d3.select(container[id]).selectAll(".tick > text")
      .attr("fill", color_text);

  d3.select(container[id]).selectAll(".tooltip")
      .attr("fill", intence(color_axis));
}

function unintence(color, for_light)
{
    for_light = (for_light !== 'undefined') ? for_light : false;
    return (dark ? d3.color(color).darker() : (for_light ? d3.color(color).brighter() : d3.color(color)));
}

function intence(color, for_light)
{
    for_light = (for_light !== 'undefined') ? for_light : false;
    return (dark ? d3.color(color).brighter() : (for_light ? d3.color(color).darker() : d3.color(color)));
}

function set_size(id)
{
  chart[id].container
      .attr("width",  chart[id].width  + "px")
      .attr("height", chart[id].height + "px");

  legend[id].container.select("svg")
      .attr("width",  legend[id].width  + "px")
      .attr("height", legend[id].height + "px");

  legend[id].container.selectAll(".container")
      .style("width", legend[id].width  + "px")
      .style("height",chart[id].height  + "px");
}
