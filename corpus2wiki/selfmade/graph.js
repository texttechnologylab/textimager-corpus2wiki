d3.selectAll(".graph").each(function (d, i) {

                var height = $(this).height();
                var width = $(this).width();

                var nodeSize = 12;
		var text = d3.select(this).text();
		d3.select(this).text("");
                var json = $.parseJSON(text);
                
                var padding = 10;
                var force = d3.layout.force()
                        .nodes(json.nodes)  // setze diese werte fur alle Germany Nodes
                        .links(json.edges)     // die anderen haben default charge usw
                        .gravity(.05) //zug zum zentrum
                        .distance(20) // kanntenlaenge-soll
                        //    .distance(function(d) {return 220*(1.1-d.str); }) // kanntenlaenge-soll
                        .charge(-500) // Abstossen untereinander
                        .size([height, width]);
                force.linkStrength(0.03);  //je kleiner desso dehnbarer sind die links

                force.start();


                var x = d3.scale.linear()
                        .domain([0, width])
                        .range([0, width]);

                var y = d3.scale.linear()
                        .domain([0, height])
                        .range([height, 0]);

                var svg = d3.select(this)
                        .append("svg")
                        .attr("viewBox", "0 0 " + width + " " + height)
                        .attr("preserveAspectRatio", "xMidYMid meet")
                        .call(d3.behavior.zoom().x(x).y(y).scaleExtent([0.1, 8]).on("zoom", zoom)).append("g");

                function zoom() {
                    svg.attr("transform", "translate(" + (d3.event.translate[0]) + "," + (d3.event.translate[1]) + ")scale(" + d3.event.scale + ")");
                }

                var link = svg.selectAll('line.link')
                        .data(json.edges)
                        .enter().append('svg:path')
                        .attr('class', 'link')
                        .attr('sig', function (d) {
                            return d.sig;
                        })
                        .attr("fill", "none")
                        .attr("stroke", "#368AC0")
                        .attr("stroke-width", function(d){
				if(d.value == undefined)
					return 1;
				else{
					console.log(d, d.value);
					return (10*d.value);	
				}			
			})
                        .attr("opacity", 0.7);

                var node = svg.selectAll('node')
                        .data(json.nodes)
                        .enter().append('svg:g')
                        .attr('class', 'node')
                        .call(force.drag);

                var circle = node.append("a")
                        .attr("xlink:href", function (d) {
                            return d.href
                        })
                        .append('circle')
                        .attr('class', 'node')
                        .attr('r', function (d) {
                            if (d.size)
                                return nodeSize * d.size;
                            else
                                return nodeSize;
                        })  //7
                        .attr('id', function (d) {
                            return d.id;
                        })
                        .attr('index', function (d) {
                            return d.index;
                        })
                        .style('fill', function (d) {
                            return d.color;
                        })
//                                .style('fill-opacity', 0.9)
                        .style("stroke", function (d) {
                            return d3.rgb(d.color).darker(0.5);
                        })
                        .style("stroke-width", 2)
                        .each(function (d, i) {
                            $(this).tooltipster({
                                trigger: 'hover',
                                content:d.tooltip,
                                offsetX: (parseInt(d3.select(this).attr('r')) + 3),
				theme: "tooltipster-graph"
                            });
                        });

                node.append('svg:text')
                        .attr('class', function (d) {
                            return ("Left" === d.context) ? 'nodetext current' : 'nodetext';
                        })
                        .attr('dx', function (d) {
                            if (d.size)
                                return (nodeSize * d.size) + 2;
                            else
                                return nodeSize + 2;
                        })
                        .attr('dy', '.35em')
                        .text(function (d) {
                            return d.name;
                        });

                force.on('tick', function () {
                    link.attr("d", function (d) {
                        var dx = d.target.x - d.source.x,
                                dy = d.target.y - d.source.y,
                                dr = Math.sqrt(dx * dx + dy * dy);
                        return "M" + d.source.x + "," + d.source.y + "A" + dr / 1 + "," + dr / 1 + " 0 0,1 " + d.target.x + "," + d.target.y;
                    });
                    node.attr('transform', function (d) {
                        return 'translate(' + d.x + ',' + d.y + ')';
                    });


                    svg.selectAll("circle.node").on("mousedown", function () {
                        d3.select(this).attr('r', parseInt(d3.select(this).attr('r')) - 2)
                    }).on("mouseup", function () {
                        d3.select(this).attr('r', parseInt(d3.select(this).attr('r')))
                    }).on("mouseover", function () {
                        d3.select(this).attr('r', parseInt(d3.select(this).attr('r')) + 3)
                                .style("stroke", function (d) {
                                    return d3.rgb(d.color).darker(1);
                                });

                        selectedNodeValue = d3.select(this).attr('index');
                        svg.selectAll("path.link").style("opacity", function (d, i) {
                            if (selectedNodeValue != d.target.index && selectedNodeValue != d.source.index) {
                                return 0.1;
                            }

                        });

                    }).on("mouseout", function () {
                        d3.select(this).attr('r', function (d) {
                            if (d.size)
                                return nodeSize * d.size;
                            else
                                return nodeSize;
                        })
                                .style("fill", function (d, i) {
                                    return d.color;
                                })
                                .style("stroke", function (d) {
                                    return d3.rgb(d.color).darker(0.5);
                                });
                        svg.selectAll(".link").style("opacity", "0.7");
                    });
                });
            });
