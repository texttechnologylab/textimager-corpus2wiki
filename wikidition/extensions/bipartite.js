d3.selectAll(".bipartite").each(function (d, i) {

                //quelle:http://stackoverflow.com/a/105074/1378201
                function guid() {
                    function s4() {
                        return Math.floor((1 + Math.random()) * 0x10000)
                                .toString(16)
                                .substring(1);
                    }
                    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                            s4() + '-' + s4() + s4() + s4();
                }
                //quelle ende: http://stackoverflow.com/a/105074/1378201

                var idPrefix = guid();
                var panel = this;
                var text = d3.select(this).text();
                d3.select(this).text("");
                var json = $.parseJSON(text);

                var leftrightwidth = ($(panel).width() - 300) / 2;
                console.log(leftrightwidth)
                var leftText = d3.select(panel).append("div")
                        .attr("id", "lefttext" + idPrefix)
                        .style("float", "left")
                        .style("border", "1px solid black")
                        .style("width", leftrightwidth + "px")
                        .style("height", "100%")
                        .style("padding-left", "15px")
                        .style("padding-right", "15px")
                        .style("overflow-y", "scroll");
                var viz = d3.select(panel).append("div")
                        .attr("id", "visualization")
                        .style("float", "left")
                        .style("border-top", "1px solid black")
                        .style("border-bottom", "1px solid black")
                        .style("height", "100%")
                        .style("width", "200px");

                var rightText = d3.select(panel).append("div")
                        .attr("id", "righttext"+idPrefix)
                        .style("float", "left")
                        .style("border", "1px solid black")
                        .style("height", "100%")
                        .style("width", leftrightwidth + "px")
                        .html("das ist ein test")
                        .style("padding-left", "15px")
                        .style("padding-right", "15px")
                        .style("overflow-y", "scroll");

                var fisheye = d3.fisheye.circular().radius(70).distortion(40);
                var x = d3.scale.linear().domain([0, width]).range([0, width]),
                        y = d3.scale.linear().domain([0, height]).range([height, 0]);

                var height = $(viz[0][0]).height();
                var width = $(viz[0][0]).width();
                var data = json;
                var firstNodes = [];
                var secondNodes = [];
                var links = [];
                var maxValue = {};
                var maxMatch = {};
                var matchLinks = [];
                var svgClicked = true;
                var svg = viz.append("svg")
                        .attr("width", width)
                        .attr("height", height)
                        .style("padding", 0)
                        .on("mouseleave", function () {
                            fisheye.focus(d3.mouse(g[0][0]));
                            firstNodes
                                    .attr("cy", function (d) {
                                        return d.y;
                                    })
                                    .attr("r", function (d) {
                                        return ((xDiff / 2) * (9.5 / 10));
                                    });
                            secondNodes
                                    .attr("cy", function (d) {
                                        return d.y;
                                    })
                                    .attr("r", function (d) {
                                        return ((xDiff / 2) * (9.5 / 10));
                                    });
                            allLinks
                                    .attr("d", function (d) {
                                        var ydiff = d.target.y - d.source.y;
                                        var xdiff = d.target.x - d.source.x;
                                        var pathString = "M" + d.source.x + "," + d.source.y;
                                        pathString += " C" + (d.source.x + (xdiff / 2)) + "," + (d.source.y) + " " + (d.target.x - (xdiff / 2)) + "," + (d.target.y) + " " + d.target.x + "," + d.target.y;
                                        return pathString;
                                    });
                        })
                        .on("mousemove", function () {
                            fisheye.focus(d3.mouse(g[0][0]));
                            firstNodes.each(function (d) {
                                d.fisheye = fisheye(d);
                            })
                                    .attr("cy", function (d) {
                                        return d.fisheye.y;
                                    })
                                    .attr("r", function (d) {
                                        return d.fisheye.z * ((xDiff / 2) * (9.5 / 10));
                                    });
                            secondNodes
                                    .each(function (d) {
                                        d.fisheye = fisheye(d);
                                    })
                                    .attr("cy", function (d) {
                                        return d.fisheye.y;
                                    })
                                    .attr("r", function (d) {
                                        return d.fisheye.z * ((xDiff / 2) * (9.5 / 10));
                                    });
                            allLinks
                                    .attr("d", function (d) {
                                        var ydiff = d.target.fisheye.y - d.source.fisheye.y;
                                        var xdiff = d.target.x - d.source.x;
                                        var pathString = "M" + d.source.x + "," + d.source.fisheye.y;
                                        pathString += " C" + (d.source.x + (xdiff / 2)) + "," + (d.source.fisheye.y) + " " + (d.target.x - (xdiff / 2)) + "," + (d.target.fisheye.y) + " " + d.target.x + "," + d.target.fisheye.y;
                                        return pathString;
                                    });
                        })
                        .on("click", function (d) {
                            if (svgClicked) {
                                d3.selectAll(".span" + idPrefix).style("background-color", null);
                                d3.selectAll(".linkbipartit" + idPrefix)
                                        .attr('stroke', function (d) {
                                            return "black";
                                        })
                                        .attr("stroke-opacity", function (d) {
                                            return d.value;
                                        });
                                clicked = false;
                            }
                            else {
                                svgClicked = true;
                            }
                        })
                        .attr("viewBox", "0 " + (height / 3) + " " + width + " " + (height / 3))
                        .attr("preserveAspectRatio", "xMidYMid meet")
//                        .call(d3.behavior.zoom().x(x).y(y).scaleExtent([0.1, 8]).on("zoom", function zoom() {
//                            svg.attr("transform", "translate(" + (d3.event.translate[0]) + "," + (d3.event.translate[1]) + ")scale(" + d3.event.scale + ")");
//                        }))
                        .append("g")
                        .attr("id", "plotG");
                var g = svg.append("g");

                var currentPara = 0;
                var leftTextString = ""
                leftTextString += "<p>"
                for (var i = 0; i < data.sourceSize; i++) {
                    if (currentPara !== data.nodes.sources[i].paragraph) {
                        leftTextString += "</p><p>"
                        var currentPara = data.nodes.sources[i].paragraph;
                    }
                    firstNodes.push({"name": i, "text": data.nodes.sources[i].name, "link": data.nodes.sources[i].link});
                    leftTextString += '<span class="span' + idPrefix + '" id="left' + idPrefix + i + '">' + data.nodes.sources[i].name + "</span> "
                }
                leftTextString += "</p>"
                leftText.html(leftTextString);

                var currentPara = 0;
                var rightTextString = "";
                rightTextString += "<p>";

                for (var i = 0; i < data.targetSize; i++) {
                    if (currentPara !== data.nodes.sources[i].paragraph) {
                        rightTextString += "</p><p>"
                        var currentPara = data.nodes.sources[i].paragraph;
                    }
                    secondNodes.push({"name": i, "text": data.nodes.targets[i].name, "link": data.nodes.targets[i].link});
                    rightTextString += '<span  class="span' + idPrefix + '"  id="right' + idPrefix + i + '">' + data.nodes.targets[i].name + "</span> "
                }
                rightTextString += "</p>"

                rightText.html(rightTextString);


                for (var i in data.links) {
                    var rand = data.links[i].value;
                    if (!maxValue[data.links[i].source]) {
                        maxValue[data.links[i].source] = rand;
                        maxMatch[data.links[i].source] = data.links[i].target;
                    }
                    else {
                        if (maxValue[data.links[i].source] <= rand) {
                            maxValue[data.links[i].source] = rand;
                            maxMatch[data.links[i].source] = data.links[i].target;
                        }
                    }
                    links.push({source: firstNodes[data.links[i].source], target: secondNodes[data.links[i].target], value: rand});
                }
                for (var i = 0; i < firstNodes.length; i++) {
                    if (maxValue[i])
                        matchLinks.push({source: firstNodes[i], target: secondNodes[maxMatch[i]], value: maxValue[i]});
                }

                var clicked = false;

                var xscale = d3.scale.linear()
                        .domain([0, firstNodes.length - 1])
                        .range([10, height - 10]);
                var sourceXScale = d3.scale.linear()
                        .domain([0, firstNodes.length - 1])
                        .range([10, height - 10]);
                var targetXScale = d3.scale.linear()
                        .domain([0, secondNodes.length - 1])
                        .range([10, height - 10]);
                firstNodes.forEach(function (d, i) {
                    d.x = 10;
                    d.y = sourceXScale(i);
                });
                secondNodes.forEach(function (d, i) {
                    d.x = width - 10;
                    d.y = targetXScale(i);
                });
                var xDiff = Math.min(xscale(1) - xscale(0), 15);
                var allLinks = g.selectAll(".linkbipartit")
                        .data(links)
                        .enter()
                        .append("path")
                        .attr("class", "linkbipartit" + idPrefix)
                        .attr("id", function (d, i) {
                            return "bipartite-path" + i + idPrefix;
                        })
                        .attr("d", function (d, i) {
                            var ydiff = d.target.y - d.source.y;
                            var xdiff = d.target.x - d.source.x;
                            var pathString = "M" + d.source.x + "," + d.source.y;
                            pathString += " C" + (d.source.x + (xdiff / 2)) + "," + (d.source.y) + " " + (d.target.x - (xdiff / 2)) + "," + (d.target.y) + " " + d.target.x + "," + d.target.y;
                            return pathString;
//                            var ydiff = d.target.y - d.source.y;
//                            var pathString = "M" + d.source.x + "," + d.source.y;
//                            pathString += " C" + d.source.x + "," + (d.source.y + (ydiff / 2)) + " " + d.target.x + "," + (d.source.y + (ydiff / 2)) + " " + d.target.x + "," + d.target.y;
//                            return pathString;
                        })
                        .style("fill", "none")
                        .attr('width', function (d) {
                            return 10;
                        })
                        .attr('stroke-width', function (d) {
                            return xDiff;
                        })
                        .attr('stroke', function (d) {
                            return "black";
                        })
                        .attr('stroke-opacity', function (d) {
                            return d.value;
                        });
                function mouseover(side, d, i) {
                    var oppositeSide = side === "target" ? "source" : "target";
                    var leftOrRight = side === "source" ? "left" : "right";

                    var matchNodes = [];
                    var filteredLinks = allLinks.filter(function (n) {
                        if (n[side].name === i) {
                            matchNodes.push(n[oppositeSide].name);
                            return true;
                        }
                        else
                            return false;
                    });
                    d3.selectAll(".linkbipartit" + idPrefix).transition().duration(150)
                            .attr("stroke-opacity", 0);
                    var span = d3.select("#left" + idPrefix + d.name)
                            .style('background-color', function (d) {
                                return "rgba(0,154,224,0.3)";
                            });
                    for (var i = 0; i < filteredLinks[0].length; i++) {
                        console.log(filteredLinks[0][i].id);
                        var span = d3.select("#right" + idPrefix + filteredLinks[0][i].__data__.target.name)
                                .style('background-color', function (d) {
                                    return "rgba(0,128,0,0.3)";
                                });

                        var path = d3.select("#" + filteredLinks[0][i].id);
                        path.transition().duration(150)
                                .attr('stroke', function (d) {
                                    return "black";
                                })
                                .attr('stroke-opacity', function (d) {
                                    return d.value;
                                })
                                ;
                    }
                }

                var firstNodes = g.selectAll(".firstnode" + idPrefix)
                        .data(firstNodes)
                        .enter()
                        .append("a")
//                        .attr("xlink:href", function (d) {
//                            return d.link;
//                        })
                        .append("circle")
                        .attr("class", "firstnode" + idPrefix)
                        .attr("id", function (d, i) {
                            return "first" + i + idPrefix;
                        })
                        .attr("cx", function (d, i) {
                            return d.x;
                        })
                        .attr("cy", function (d, i) {
                            return d.y;
                        })
                        .attr("r", function (d, i) {
                            return ((xDiff / 2) * (9 / 10));
                        })
                        .attr("stroke", function (d, i) {
                            return d3.rgb(0, 154, 224).darker(0.5);
                        })
                        .attr("stroke-width", function (d, i) {
                            return "0.6";
                        })
                        .style("fill", function (d, i) {
                            return "rgb(0,154,224)";
                        })
                        .each(function (d, i) {
                            $(this).tooltipster({
                                trigger: 'hover',
                                content: d.text,
                                offsetX: (parseInt(d3.select(this).attr('r')) + 3),
                                theme: "tooltipster-graph"
                            });
                        })
                        .on("mouseover", function (d, i) {
                                                            $("#lefttext" + idPrefix).scrollTop($("#lefttext" + idPrefix).scrollTop() + $("#left" + idPrefix + d.name).position().top-20);

                            if (!clicked) {
                                var matchNodes = [];
                                var filteredLinks = allLinks.filter(function (n) {
                                    if (n.source.name === i) {
                                        matchNodes.push(n["target"].name);
                                        return true;
                                    }
                                    else
                                        return false;
                                });
//                                d3.selectAll(".linkbipartit" + idPrefix).transition().duration(150)
//                                        .attr("stroke-opacity", function (d) {
//                                            return d.value;
//                                        });
                                var span = d3.select("#left" + idPrefix + d.name)
                                        .style('background-color', function (d) {
                                            return "rgba(0,154,224," + 0.5 + ")";
                                        });
                                for (var i = 0; i < filteredLinks[0].length; i++) {
                                    var span = d3.select("#right" + idPrefix + filteredLinks[0][i].__data__.target.name)
                                            .style('background-color', function (d) {
                                                return "rgba(0,128,0," + filteredLinks[0][i].__data__.value + ")";
                                            });

                                    var path = d3.select("#" + filteredLinks[0][i].id);
                                    path.transition().duration(150)
                                            .attr('stroke', function (d) {
                                                return "red";
                                            })
                                            .attr('stroke-opacity', function (d) {
                                                return 1;
                                            })
                                            ;
                                }
                            }
                        })
                        .on("mouseout", function (d) {
                            if (!clicked) {
                                d3.selectAll(".span" + idPrefix).style("background-color", null);
                                d3.selectAll(".linkbipartit" + idPrefix).transition()
                                        .attr('stroke', function (d) {
                                            return "black";
                                        })
                                        .attr("stroke-opacity", function (d) {
                                            return d.value;
                                        });
                            }
                        })
                        .on("click", function (d, i) {
//                            var contactTopPosition = $("#left" + idPrefix + d.name).position().top;
//                                console.log("#left" + idPrefix + d.name);
//                                $("#lefttext" + idPrefix).scrollTop(contactTopPosition);
                                
                                $("#lefttext" + idPrefix).scrollTop($("#lefttext" + idPrefix).scrollTop() + $("#left" + idPrefix + d.name).position().top);

                            if (d3.event.ctrlKey) {
                                if (d.link)
                                    window.open(d.link, "_blank");
                            }
                            else {
                                
                                if (!clicked) {
                                    d3.selectAll(".span" + idPrefix).transition().duration(500).style("background-color", null);
                                    d3.selectAll(".linkbipartit" + idPrefix).transition().duration(500)
                                            .attr('stroke', function (d) {
                                                return "black";
                                            })
                                            .attr("stroke-opacity", function (d) {
                                                return d.value;
                                            });
                                    var matchNodes = [];
                                    var filteredLinks = allLinks.filter(function (n) {
                                        if (n.source.name === i) {
                                            matchNodes.push(n.target.name);
                                            return true;
                                        }
                                        else
                                            return false;
                                    });
                                    d3.selectAll(".linkbipartit" + idPrefix).transition().duration(500)
                                            .attr("stroke-opacity", 0);
                                    var span = d3.select("#left" + idPrefix + d.name).transition().duration(500)
                                            .style('background-color', function (d) {
                                                return "rgba(0,154,224,0.5)";
                                            });

                                    for (var i = 0; i < filteredLinks[0].length; i++) {
                                        console.log(filteredLinks[0][i].id);
                                        var span = d3.select("#right" + idPrefix + filteredLinks[0][i].__data__.target.name).transition().duration(500)
                                                .style('background-color', function (d) {
                                                    return "rgba(0,128,0," + filteredLinks[0][i].__data__.value + ")";
                                                });

                                        var path = d3.select("#" + filteredLinks[0][i].id);
                                        path.transition().duration(500)
                                                .attr('stroke', function (d) {
                                                    return "black";
                                                })
                                                .attr('stroke-opacity', function (d) {
                                                    return d.value;
                                                })
                                                ;
                                    }
                                }
                                clicked = true;
                                svgClicked = false;
                            }
                        });
                var secondNodes = g.selectAll(".secondnode" + idPrefix)
                        .data(secondNodes)
                        .enter()
                        .append("a")
//                        .attr("xlink:href", function (d) {
//                            return d.link;
//                        })
                        .append("circle")
                        .attr("class", "secondnode" + idPrefix)
                        .attr("id", function (d, i) {
                            return "second" + i + idPrefix;
                        })
                        .attr("cx", function (d, i) {
                            return d.x;
                        })
                        .attr("cy", function (d, i) {
                            return d.y;
                        })
                        .attr("r", function (d, i) {
                            return ((xDiff / 2) * (9.5 / 10));
                        })
                        .style("fill", function (d, i) {
                            return "rgb(0,128,0)";
                        })
                        .attr("stroke", function (d, i) {
                            return d3.rgb(0, 128, 0).darker(0.5);
                        })
                        .attr("stroke-width", function (d, i) {
                            return "0.6";
                        })
                        .each(function (d, i) {
                            $(this).tooltipster({
                                trigger: 'hover',
                                content: d.text,
                                offsetX: (parseInt(d3.select(this).attr('r')) + 3),
                                theme: "tooltipster-graph"
                            });
                        })
                        .on("mouseover", function (d, i) {
                           $("#righttext" + idPrefix).scrollTop($("#righttext" + idPrefix).scrollTop() + $("#right" + idPrefix + d.name).position().top-20);

                            if (!clicked) {
                                var matchNodes = [];
                                var filteredLinks = allLinks.filter(function (n) {
                                    if (n.target.name === i) {
                                        matchNodes.push(n.source.name);
                                        return true;
                                    }
                                    else
                                        return false;
                                });
                                d3.selectAll(".linkbipartit" + idPrefix).transition().duration(150)
                                        .attr("stroke-opacity", 0);
                                var span = d3.select("#right" + idPrefix + d.name)
                                        .style('background-color', function (d) {
                                            return "rgba(0,128,0,0.5)";
                                        });
                                for (var i = 0; i < filteredLinks[0].length; i++) {
                                    var span = d3.select("#left" + idPrefix + filteredLinks[0][i].__data__.source.name)
                                            .style('background-color', function (d) {
                                                return "rgba(0,154,224," + filteredLinks[0][i].__data__.value + ")";
                                            });

                                    var path = d3.select("#" + filteredLinks[0][i].id);
                                    path.transition().duration(150)
                                            .attr('stroke', function (d) {
                                                return "black";
                                            })
                                            .attr('stroke-opacity', function (d) {
                                                return d.value;
                                            })
                                            ;
                                }
                            }
//                            else{

//                            }
                        })
                        .on("mouseout", function (d) {
                            if (!clicked) {
                                d3.selectAll(".span" + idPrefix).style("background-color", null);
                                d3.selectAll(".linkbipartit" + idPrefix).transition()
                                        .attr('stroke', function (d) {
                                            return "black";
                                        })
                                        .attr("stroke-opacity", function (d) {
                                            return d.value;
                                        });
                            }
                        })
                        .on("click", function (d, i) {
                            if (d3.event.ctrlKey) {
                                if (d.link)
                                    window.open(d.link, "_blank");
                            }
                            else {
                                if (clicked) {
                                    d3.selectAll(".span" + idPrefix).transition().duration(500).style("background-color", null);
                                    d3.selectAll(".linkbipartit" + idPrefix).transition().duration(500)
                                            .attr('stroke', function (d) {
                                                return "black";
                                            })
                                            .attr("stroke-opacity", function (d) {
                                                return d.value;
                                            });
                                    var matchNodes = [];
                                    var filteredLinks = allLinks.filter(function (n) {
                                        if (n.target.name === i) {
                                            matchNodes.push(n.source.name);
                                            return true;
                                        }
                                        else
                                            return false;
                                    });
                                    d3.selectAll(".linkbipartit" + idPrefix).transition().duration(500)
                                            .attr("stroke-opacity", 0);
                                    var span = d3.select("#right" + idPrefix + d.name).transition().duration(500)
                                            .style('background-color', function (d) {
                                                return "rgba(0,128,0,0.5)";
                                            });
                                    for (var i = 0; i < filteredLinks[0].length; i++) {
                                        console.log(filteredLinks[0][i].id);
                                        var span = d3.select("#left" + idPrefix + filteredLinks[0][i].__data__.source.name).transition().duration(500)
                                                .style('background-color', function (d) {
                                                    return "rgba(0,154,224," + filteredLinks[0][i].__data__.value + ")";
                                                });

                                        var path = d3.select("#" + filteredLinks[0][i].id);
                                        path.transition().duration(500)
                                                .attr('stroke', function (d) {
                                                    return "black";
                                                })
                                                .attr('stroke-opacity', function (d) {
                                                    return d.value;
                                                })
                                                ;
                                    }
                                }
                                clicked = true;
                                svgClicked = false;
                            }
                        })
            });
