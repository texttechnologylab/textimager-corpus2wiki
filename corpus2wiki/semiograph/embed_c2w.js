$(document).ready(function ()
{
	var rest_baseurl = "http://semiograph.texttechnologylab.org/api";
	var rest_endpoint = rest_baseurl + "/nn";

	var showLabelIsChecked = true;
	var showArrowIsChecked = false;
	var showClassesIsChecked = false;
	var threshholdFilterValue = 50;
	var threshholdDdcFilterValue = 50;
	var threshholdWordsDdcFilterValue = 50;
	var distanceFilterValue = 100;
	var wordDistanceFilterValue = 50;
	var ddcDistanceFilterValue = 100;
	var fontSizeValue = 15;
	var ddc_node_min_size = 10;
	var ddc_node_max_size = 50;
	var node_size_factor = 1;
	var ddcLinkColor = "rgba(144, 238, 144, 1.0)";
	var embeddingLinkColor = "rgba(255, 165, 0, 1.0)";
	var linkStrengthValue = 0.5;
	var linkSizeValue = 2;
	var maxnValue = 50;
	var selectedNode = null;
	var grid = null;
	var network = {};
	var modifier_keys = {
		"ctrl": false,
		"alt": false,
		"shift": false
	};
	var word_input_forms = [ ];
	var global_zoom_factor = 0.5;
	var global_all_pos = [];
	var filter_pos = [];

	function should_filter_pos(pos) {
		if (pos in filter_pos) {
			return !filter_pos[pos];
		}
		return false;
	}

	var try_get_ddc_color = function(node) {
		if (node.colors && node.colors.ddc && node.colors.ddc.length>0 && node.colors.ddc[0].length>0)
			return node.colors.ddc[0][1][0];
		return node.colors.pos;
		//return node.colors.normal;
	}

	var try_get_ddc_color_muted = function(node) {
		if (node.colors && node.colors.ddc && node.colors.ddc.length>0 && node.colors.ddc[0].length>0)
			return node.colors.ddc[0][1][1];
		return node.colors.pos;
		//return node.colors.normal;
	}

	var map_value = function(val, in_min, in_max, out_min, out_max) {
		var ret = ((val - in_min) * (out_max - out_min) / (in_max - in_min)) + out_min;
		if (isNaN(ret)) {
			return out_max;
		}
		return ret;
	}

	var generate_graph = function (word_input, embedding, ddc, maxn, width, height, vizDiv)
	{
		var payload = {
			"embeddings": embedding,
			"words": word_input,
			"maxn": maxn,
			"add_ddc_nodes": ddc
		};
		console.log(payload);

		$.ajax({
			method: "POST",
			contentType: "application/json",
			dataType: "json",
			url: rest_endpoint,
			data: JSON.stringify(payload)
		})
			.done(function (jqXHR, textStatus, errorThrown)
			{
				console.log(jqXHR);

				$.each(jqXHR, function (index, element)
				{
					console.log(index)
					console.log(element)

					setTimeout(do_generate_graph, 1, index, element, vizDiv, width, height);
				});
			})
			.fail(function (jqXHR, textStatus, errorThrown)
			{
				console.log("Error: " + jqXHR.status + ": " + jqXHR.statusText);
			})
			.always(function ()
			{
			});
	}

	function round2(val) {
		return +(Math.round(val + "e+2")  + "e-2");
	}

	var do_generate_graph = function(index, element, elem, width, height) {
		// Exit if no nodes/links
		if (element.nodes.length < 1 && element.links.length < 1) {
			console.log("Word Not found in embedding.");
			return;
		}

		var tmpIndex = 0;
		var seedWords = [];
		var ddcMap = { };
		var ddcScoreMap = { };
		var nonDDCNodeCount = 0;
		var all_pos = [];
		element.nodes.forEach(function(d, i){

			// collect all pos...
			if ("pos" in d) {
				all_pos.push(d.pos);
			}


			// if(!(d.id in labelIdMap)){
			//     labelIdMap[d.id] = tmpIndex++;
			// }
			// d.id = labelIdMap[d.id];
			// d.val = 1;
			if(d.is_seed_word){
				seedWords.push(d.id);
				//d.color=d.colors.seed_word;
			}
			else {
				//d.color=d.colors.normal;
			}

			if (!d.is_ddc_node) {
				nonDDCNodeCount++;
			}

			if (d.ddc && d.ddc[0]) {
				ddcMap[d.id] = d.ddc[0]["score"];
			}

			if (!d.is_ddc_node) {
				for (ddcelem in d.ddc) {
					var id = d.ddc[ddcelem]["id"];
					var score = d.ddc[ddcelem]["score"];
					if (!(id in ddcScoreMap)) {
						ddcScoreMap[id] = 0;
					}
					ddcScoreMap[id] += score;
				}
			}
		})
		var minDdcScore = 1;
		var maxDdcScore = 0;
		for (ddcscore in ddcScoreMap) {
			ddcScoreMap[ddcscore] /= nonDDCNodeCount;
			if (ddcScoreMap[ddcscore] > maxDdcScore)
				maxDdcScore = ddcScoreMap[ddcscore];
			if (ddcScoreMap[ddcscore] < minDdcScore)
				minDdcScore = ddcScoreMap[ddcscore];
		}
		element.nodes.forEach(function(d, i){
			if (d.is_ddc_node) {
				if (d.id in ddcScoreMap) {
					d.title += "<br/>" + round2(ddcScoreMap[d.id]*100) + "%";
				}
			}
		});

		var adjacentMap = {};
		var nodeWidthHeightMap = {};
		var minLinkValue = 1;
		var maxLinkValue = 0;

		var minLinkValue2 = 1;
		var maxLinkValue2 = 0;

		element.links.forEach(function(d, i){
			if(d.source in adjacentMap){
				adjacentMap[d.source].add(d.target);
			}
			else{
				adjacentMap[d.source] = new Set();
				adjacentMap[d.source].add(d.target);

			}
			if(d.target in adjacentMap){
				adjacentMap[d.target].add(d.source);
			}
			else{
				adjacentMap[d.target] = new Set();
				adjacentMap[d.target].add(d.source);
			}
			if(!d.is_ddc_edge && ((seedWords.indexOf(d.source)>-1) || (seedWords.indexOf(d.target)>-1))){
				if(d.value>maxLinkValue)
					maxLinkValue=d.value
				if(d.value<minLinkValue)
					minLinkValue=d.value
			}

			if(d.value>maxLinkValue2 && !d.is_ddc_edge)
				maxLinkValue2=d.value;
			if(d.value<minLinkValue2 && !d.is_ddc_edge)
				minLinkValue2=d.value;


			if (!d.is_ddc_edge) {
				if (!d.target.is_ddc_node) {
					if(d.target in nodeWidthHeightMap){
						if(seedWords.indexOf(d.source)>-1 || seedWords.indexOf(d.target)>-1){
							nodeWidthHeightMap[d.target]["width"] = nodeWidthHeightMap[d.target]["width"]+d.value;
							nodeWidthHeightMap[d.target]["width_count"] = nodeWidthHeightMap[d.target]["width_count"]+1;
							nodeWidthHeightMap[d.target]["neighbours"] = nodeWidthHeightMap[d.target]["neighbours"]+1;
							nodeWidthHeightMap[d.target]["seedNeighbours"] = nodeWidthHeightMap[d.target]["seedNeighbours"]+1;
						}
						else{
							nodeWidthHeightMap[d.target]["height"] = nodeWidthHeightMap[d.target]["height"]+d.value;
							nodeWidthHeightMap[d.target]["width_count"] = nodeWidthHeightMap[d.target]["width_count"]+1;
							nodeWidthHeightMap[d.target]["neighbours"] = nodeWidthHeightMap[d.target]["neighbours"]+1;
						}
					}
					else{
						if(seedWords.indexOf(d.source)>-1 || seedWords.indexOf(d.target)>-1){
							nodeWidthHeightMap[d.target] = {width: (1+d.value), width_count: 1, height:1, neighbours:1, seedNeighbours:1};
						}
						else{
							nodeWidthHeightMap[d.target] = {width: 1, width_count: 1, height:(1+d.value), neighbours:1, seedNeighbours:1};
						}
					}
				}
				if (!d.source.is_ddc_node) {
					if(d.source in nodeWidthHeightMap){
						if(seedWords.indexOf(d.source)>-1 || seedWords.indexOf(d.target)>-1){
							nodeWidthHeightMap[d.source]["width"] = nodeWidthHeightMap[d.source]["width"]+d.value;
							nodeWidthHeightMap[d.target]["width_count"] = nodeWidthHeightMap[d.target]["width_count"]+1;
							nodeWidthHeightMap[d.source]["neighbours"] = nodeWidthHeightMap[d.source]["neighbours"]+1;
							nodeWidthHeightMap[d.source]["seedNeighbours"] = nodeWidthHeightMap[d.source]["seedNeighbours"]+1;
						}
						else{
							nodeWidthHeightMap[d.source]["height"] = nodeWidthHeightMap[d.source]["height"]+d.value;
							nodeWidthHeightMap[d.target]["width_count"] = nodeWidthHeightMap[d.target]["width_count"]+1;
							nodeWidthHeightMap[d.source]["neighbours"] = nodeWidthHeightMap[d.source]["neighbours"]+1;
						}
					}
					else{
						if(seedWords.indexOf(d.source)>-1 || seedWords.indexOf(d.target)>-1){
							nodeWidthHeightMap[d.source] = {width: (1+d.value), width_count: 1, height:1, neighbours:1, seedNeighbours:1};
						}
						else{
							nodeWidthHeightMap[d.source] = {width: 1, width_count: 1, height:(1+d.value), neighbours:1, seedNeighbours:1};
						}
					}
				}
			}

			for(var i in seedWords){
				var tmpSeedWord = seedWords[i];
				nodeWidthHeightMap[tmpSeedWord] = {
					width: seedWords.length+2,
					height: seedWords.length+2
				};

			}

		})

		element.nodes.forEach(function(d, i){
			if (d.is_ddc_node) {
				var w = 0.1;
				var h = 0.1;
				if (d.id in ddcScoreMap) {
					var side = ddcScoreMap[d.id];
					w = side;
					h = side;
				}
				nodeWidthHeightMap[d.id] = {
					width: w,
					height:h,
					//width: seedWords.length,
					//height:seedWords.length,
					neighbours:(nodeWidthHeightMap.length-seedWords.length)
				};
			}
		});
		//console.log(nodeWidthHeightMap)

		var in_min = minLinkValue2;
		var in_max = maxLinkValue2;
		var out_min = 0.1;
		var out_max = 1.0;
		element.links.forEach(function(d, i){
			if(seedWords.indexOf(d.source)>-1 || seedWords.indexOf(d.target)>-1){
				// d.color=d.colors.seed_word;
				// d.color=d.colors.normal;
				d.color= "black";
				d.connected_to_seed_word = true;
			}
			else {
				d.connected_to_seed_word = false;

				if (d.is_ddc_edge_internal) {
					// d.color=d.colors.ddc;
					d.color= ddcLinkColor;
				}
				else if (d.is_ddc_edge) {
					//d.color = d.colors.ddc[0];

					// value is based on top ddc class
					if (d.source in ddcMap)
					{
						//d.value = ddcMap[d.source];
						var parts = d.colors.ddc[0].split(",");
						if (parts.length != 4) {
							d.color=d.colors.ddc[0];
						}
						else {
							var colTransparent = (d.value - 0) * (1 - 0) / (1 - 0) + 0;
							parts[3] = colTransparent + ")";
							d.color=parts.join(",");
							// d.color= "lightblue";
						}
					}
					else
					{
						//d.value = 0;
					}
				}
				else {
					// modify alpha based on value
					//rgba(1, 0, 0, 1)
					var parts = d.colors.normal.split(",");
					if (parts.length != 4) {
						d.color=d.colors.normal;
						// d.color= "lightblue";
					}
					else {
						var colTransparent = (d.value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
						parts[3] = colTransparent + ")";
						d.color=parts.join(",");
						d.color= embeddingLinkColor;
					}
				}
			}
		});

		// kann hier kein object sein??
		var init_width = width;
		var init_height = height;
		let highlightNodes = [];
		let highlightLink = null;

		network = {
			network: elem,
			adjacentMap: adjacentMap,
			nodeWidthHeightMap: nodeWidthHeightMap,
			graph: null,
			element: element
		};

		//console.log(element)
		network["graph"] = ForceGraph()
		(elem)
			.width(init_width)
			.height(init_height)
			//.width(size.width)
			//.height(size.height)
			// .linkDirectionalParticles(2)
			.warmupTicks(1000)
			// .onEngineStop(function() {
			// 	console.log("STOP");
			// 	jQuery('#' + ids.loading_id).addClass("hidden");
			// })
			.nodeId("id")
			.nodeLabel('title')
			.linkLabel(function(d){
				var val = d.value;
				if (d.is_ddc_edge && !d.is_ddc_edge_internal) {
					//val -= 100000;
				}

				if (d.is_ddc_edge_internal) {
					if(selectedNode!=null){
						if(selectedNode.id==d.source.id || selectedNode.id==d.target.id){
							if(val<(threshholdDdcFilterValue/100)){
								return false;
							}
							else{
								return d.title;
							}
						}
						else{
							return false;
						}
					}
					else{
						if(val<(threshholdDdcFilterValue/100)){
							return false;
						}
						else{
							return d.title;
						}
					}
				}
				else if (d.is_ddc_edge) {

					if(selectedNode!=null){
						if(selectedNode.id==d.source.id || selectedNode.id==d.target.id){
							if(val<(threshholdWordsDdcFilterValue/100)){
								return false;
							}
							else{
								return d.title;
							}
						}
						else{
							return false;
						}
					}
					else{
						if(val<(threshholdWordsDdcFilterValue/100)){
							return false;
						}
						else{
							return d.title;
						}
					}
				}

				if(selectedNode!=null){
					if(selectedNode.id==d.source.id || selectedNode.id==d.target.id){
						if(val<(threshholdFilterValue/100)){
							return false;
						}
						else{
							return d.title;
						}
					}
					else{
						return false;
					}
				}
				else{
					if(val<(threshholdFilterValue/100)){
						return false;
					}
					else{
						return d.title;
					}
				}
			})
			// .nodeRelSize(10)
			.nodeVal(function(d){
				return d.val * 0.8;
				//console.log(nodeWidthHeightMap[d.id].width)
				//		return nodeWidthHeightMap[d.id].width*5;
			})
			// .linkSource("from")
			// .linkTarget("to")
			.linkCurvature(0.05)
			.linkDirectionalArrowRelPos(0.4)
			.linkDirectionalArrowLength(function(d){
				var val = d.value;
				if (d.is_ddc_edge && !d.is_ddc_edge_internal) {
					//val -= 100000;
				}


				if(showArrowIsChecked){

					if (d.is_ddc_edge_internal) {
						if(selectedNode!=null){
							if(selectedNode.id==d.source.id || selectedNode.id==d.target.id){
								if(val<(threshholdDdcFilterValue/100)){
									return 0.0001;
								}
								else{
									// return Math.pow((((d.value))-0.75)*4, 2);
									return 2;
								}
							}
							else{
								return 0;
							}
						}
						else{
							if(val<(threshholdDdcFilterValue/100)){
								return 0;
							}
							else{
								return 2;
							}
						}
					}
					else if (d.is_ddc_edge) {
						if(selectedNode!=null){
							if(selectedNode.id==d.source.id || selectedNode.id==d.target.id){
								if(val<(threshholdWordsDdcFilterValue/100)){
									return 0.0001;
								}
								else{
									// return Math.pow((((d.value))-0.75)*4, 2);
									return 2;
								}
							}
							else{
								return 0;
							}
						}
						else{
							if(val<(threshholdWordsDdcFilterValue/100)){
								return 0;
							}
							else{
								return 2;
							}
						}
					}

					if(selectedNode!=null){
						if(selectedNode.id==d.source.id || selectedNode.id==d.target.id){
							if(val<(threshholdFilterValue/100)){
								return 0.0001;
							}
							else{
								// return Math.pow((((d.value))-0.75)*4, 2);
								return 2;
							}
						}
						else{
							return 0;
						}
					}
					else{
						if(val<(threshholdFilterValue/100)){
							return 0;
						}
						else{
							return 2;
						}
					}
				}
				else{
					return 0;
				}
			})
			.nodeCanvasObject((node, ctx, globalScale) => {
				// Hide if POS matches filter
				if ("pos" in node) {
					if (should_filter_pos(node["pos"])) {
						return;
					}
				}
				// var ctx = canvas.getContext("2d");
				if(showClassesIsChecked && !node.is_ddc_node){
					var make_grey = false;
					if(selectedNode!=null && (selectedNode.id != node.id)) {
						if(adjacentMap[selectedNode.id]){
							if(!adjacentMap[selectedNode.id].has(node.id)){
								make_grey = true;
							}
						}
					}
					//var colors = ['#4CAF50', '#00BCD4', '#E91E63', '#FFC107', '#9E9E9E', '#CDDC39', '#18FFFF', '#F44336', '#FFF59D', '#6D4C41'];
					//var angles = [Math.PI * 0.3, Math.PI * 0.7, Math.PI * 0.2, Math.PI * 0.4, Math.PI * 0.4]; // SUMME MUSS 2 ERGEBEN
					var colors = [];
					var angles = []; // SUMME MUSS 2 ERGEBEN
					if (node.ddc) {
						var percent = 0;
						for (var ddcind in node.ddc) {

							var col = node.colors.ddc[ddcind][1][(make_grey ? 1 : 0)];
							var parts = col.split(",");
							if (parts.length == 4) {
								if (make_grey) {
									parts[3] = "0.33)";
								}
								else {
									parts[3] = "0.85)";
								}
								col=parts.join(",");
							}
							colors.push(col);
							var score = Number(node.ddc[ddcind].score);
							if (score >= 0.99) {
								score = 1.0;
							}
							if (score >= 0.005) {
								if (score < 0.01) {
									score = 0.01;
								}
								score *= 2;
								percent += score;
								angles.push(Math.PI * score);
							}
						}
						if (colors.length == 0) {
							// Keine DDC Info, auch hier mit Randfarbe füllen
							angles.push(Math.PI*2);
							colors.push(node.colors.pos);
							percent = 1;
						}
						if (percent < 2.0) {
							colors.push("rgba(256, 256, 256, 0.15)");
							angles.push(Math.PI * (2.0-percent));
						}
					}
					else {
						// Kein DDC => Randfarbe
						angles.push(Math.PI*2);
						colors.push(node.colors.pos);
						percent = 1;
					}

					var offset = 10;
					var beginAngle = 0;
					var endAngle = 0;
					var offsetX, offsetY, medianAngle;
					for(var i = 0; i < angles.length; i = i + 1) {
						beginAngle = endAngle;
						endAngle = endAngle + angles[i];
						medianAngle = (endAngle + beginAngle) / 2;
						ctx.beginPath();
						ctx.fillStyle = colors[i % colors.length];
						ctx.moveTo(node.x, node.y);
						ctx.arc(node.x, node.y, (5*node_size_factor), beginAngle, endAngle);
						ctx.lineTo(node.x, node.y);
						ctx.lineWidth=0.1;
						if (node.is_seed_word) {
							ctx.lineWidth= 0.6;
						}
						ctx.stroke();
						ctx.fill();
					}

					if(showLabelIsChecked){
						const label = node.word;
						var fontSize = fontSizeValue/globalScale;
						if(globalScale>0 || node.is_ddc_node){
							ctx.font = `${fontSize}px Sans-Serif`;
							if (node.is_seed_word) {
								ctx.font = `bold ${fontSize}px Sans-Serif`;
							}
							const textWidth = ctx.measureText(label).width;
							const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding
							ctx.fillStyle = node.colors.textbg;
							ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2 -8, ...bckgDimensions);

							ctx.fillStyle = node.colors.text;
							ctx.textAlign = 'center';
							ctx.textBaseline = 'middle';
							// ctx.fillStyle = node.color;
							ctx.fillText(label, node.x, node.y-8);
						}
					}

					ctx.beginPath()
					ctx.ellipse(node.x, node.y, (5*node_size_factor), (5*node_size_factor), 0, 0, 2 * Math.PI);
					ctx.fillStyle = 'transparent';
					ctx.fill();
					ctx.strokeStyle= node.colors.pos;
					ctx.lineWidth= 1;
					if (node.is_seed_word) {
						ctx.lineWidth= 2;
					}
					ctx.stroke();
					ctx.strokeStyle= 'transparent';

				}
				else{
					ctx.beginPath();
					var node_min_size = 5;
					if(seedWords.indexOf(node.id)>-1) {
						var size = (node_size_factor*node_min_size)+(maxLinkValue*10);
						ctx.ellipse(node.x, node.y, size, size, 0, 0, 2 * Math.PI);
						node.val = size;
					}
					else if (node.is_ddc_node) {
						var width = map_value(nodeWidthHeightMap[node.id].width, minDdcScore, maxDdcScore, ddc_node_min_size, ddc_node_max_size);
						var height = map_value(nodeWidthHeightMap[node.id].height, minDdcScore, maxDdcScore, ddc_node_min_size, ddc_node_max_size);
						ctx.rect((node.x - (width/2)), (node.y-(height/2)), width,height);
						node.val = Math.min(width, height);
					}
					else {
						var width = (node_size_factor*node_min_size)+(Math.pow(((((nodeWidthHeightMap[node.id].width-1)/nodeWidthHeightMap[node.id].seedNeighbours)-minLinkValue)/(maxLinkValue-minLinkValue)), 1)*10);
						var height = (node_size_factor*node_min_size)+(nodeWidthHeightMap[node.id].neighbours*10/200);
						ctx.ellipse(node.x, node.y, width, height, 0, 0, 2 * Math.PI);
						node.val = Math.min(width, height);
					}
					if(selectedNode!=null){
						if(adjacentMap[selectedNode.id]){
							if(adjacentMap[selectedNode.id].has(node.id)){
								ctx.fillStyle = try_get_ddc_color(node);
								ctx.strokeStyle= node.colors.pos;
							}
							else{
								if(selectedNode.id==node.id){
									ctx.fillStyle = try_get_ddc_color(node);
									ctx.strokeStyle= node.colors.pos;
								}
								else{
									ctx.fillStyle = try_get_ddc_color_muted(node);
									ctx.strokeStyle= node.colors.muted;
								}
							}
						}
						else{
							ctx.fillStyle = try_get_ddc_color_muted(node);
							ctx.strokeStyle= node.colors.muted;
						}
					}
					else{
						ctx.fillStyle = try_get_ddc_color(node);
						ctx.strokeStyle= node.colors.pos;
					}

					if (node.is_ddc_node) {
						ctx.fillStyle = try_get_ddc_color(node);
						ctx.strokeStyle= 'transparent';
					}

					ctx.lineWidth= 1;
					ctx.fill();
					if (node.is_seed_word) {
						ctx.lineWidth= 3;
					}
					ctx.stroke();
					ctx.lineWidth= 1;
					if(showLabelIsChecked){
						const label = node.word;
						var fontSize = fontSizeValue/globalScale;
						if(globalScale>0 || node.is_ddc_node){
							ctx.font = `${fontSize}px Sans-Serif`;
							if (node.is_seed_word) {
								ctx.font = `bold ${fontSize}px Sans-Serif`;
							}
							const textWidth = ctx.measureText(label).width;
							const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding
							ctx.fillStyle = node.colors.textbg;
							if(node.is_ddc_node)
								ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2 - height/2-12, ...bckgDimensions);
							else
								ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
							ctx.fillStyle = node.colors.text;
							ctx.textAlign = 'center';
							ctx.textBaseline = 'middle';
							// ctx.fillStyle = node.color;
							if(node.is_ddc_node)
								ctx.fillText(label, node.x, node.y - height/2-12);
							else
								ctx.fillText(label, node.x, node.y);
						}
					}
				}
			})
			.onNodeClick(node => {
				if (modifier_keys["ctrl"] && !node.is_ddc_node) {
					// Strg+Click: Add neighbopurs from this node
					var autoid = "auto_gen"+Math.floor(Math.random() * Math.floor(1000));
					networks[index].word_input_form.datalist.flexdatalist('add', {"id": autoid, "w": node.word+"_"+node.pos});
					generate_graph();
				}
				else if (modifier_keys["alt"] && !node.is_ddc_node) {
					// Alt+Click: Replace graph with neighbours from this node
					var words = [node.word + "_" + node.pos];
					var embedding_id = networks[index].oldId;
					add_word_form(words, embedding_id, true);
					replace_graph();
				}
				else if (modifier_keys["shift"] && !node.is_ddc_node) {
					// Shift+Click: Add new graph with this node only
					//TODO
				}
				else {
					// "normal" click
					// Center/zoom on node
					if(selectedNode){
						if(node.id==selectedNode.id)
							selectedNode = null;
						else {
							selectedNode = node;
							// for(var i=0; i<element.links.length; i++){
							// 		var tmpLink = element.links[i];
							// 		if(tmpLink.to!=node.id && tmpLink.from!=node.id){
							// 				element.links.splice(i, 1);
							// 				i--;
							// 		}
							// }
						}
					}
					else {
						selectedNode = node;
						// for(var i=0; i<element.links.length; i++){
						// 		var tmpLink = element.links[i];
						// 		if(tmpLink.to!=node.id && tmpLink.from!=node.id){
						// 				element.links.splice(i, 1);
						// 				i--;
						// 		}
						// }
					}
					var selectedLinks = []
					var unselectedLinks = [];
					for(var i in element.links){
						var tmpLink = element.links[i];
						if(selectedNode!=null){
							if(selectedNode.id==tmpLink.source.id || selectedNode.id==tmpLink.target.id){
								if((tmpLink.is_ddc_edge_internal && (tmpLink.value<(threshholdDdcFilterValue/100))) || (tmpLink.is_ddc_edge_internal && (tmpLink.value<(threshholdDdcFilterValue/100))) || (tmpLink.value<(threshholdFilterValue/100))){
									unselectedLinks.push(tmpLink)
								}
								else{
									selectedLinks.push(tmpLink)
								}
							}
							else{
								unselectedLinks.push(tmpLink)
							}
						}
						else{
							if((tmpLink.is_ddc_edge_internal && (tmpLink.value<(threshholdDdcFilterValue/100))) || (tmpLink.is_ddc_edge_internal && (tmpLink.value<(threshholdDdcFilterValue/100))) || (tmpLink.value<(threshholdFilterValue/100))){
								unselectedLinks.push(tmpLink)
							}
							else{
								selectedLinks.push(tmpLink)
							}
						}
					}
					//console.log(element)
					element.links = [];

					for(var i in unselectedLinks){
						element.links.push(unselectedLinks[i])
					}
					for(var i in selectedLinks){
						element.links.push(selectedLinks[i])
					}
					//console.log(element)
				}
			})
			.graphData(element)
			//.zoom(2.2)
			.zoom(global_zoom_factor)
			.onLinkHover(link => {
				if(link){
					var val = link.value;
					if (link.is_ddc_edge && !link.is_ddc_edge_internal) {
						//val -= 100000;
						//console.log(val)
						//console.log(threshholdFilterValue/100)
					}

					if (link.is_ddc_edge_internal) {
						if(selectedNode!=null){
							if(selectedNode.id==link.source.id || selectedNode.id==link.target.id){
								if(val<(threshholdDdcFilterValue/100)){
								}
								else{
									highlightLink = link;
									highlightNodes = link ? [link.source, link.target] : [];
								}
							}
							else{
							}
						}
						else{
							if(val<(threshholdDdcFilterValue/100)){
							}
							else{
								highlightLink = link;
								highlightNodes = link ? [link.source, link.target] : [];
							}
						}
					}
					else if (link.is_ddc_edge) {
						if(selectedNode!=null){
							if(selectedNode.id==link.source.id || selectedNode.id==link.target.id){
								if(val<(threshholdWordsDdcFilterValue/100)){
								}
								else{
									highlightLink = link;
									highlightNodes = link ? [link.source, link.target] : [];
								}
							}
							else{
							}
						}
						else{
							if(val<(threshholdWordsDdcFilterValue/100)){
							}
							else{
								highlightLink = link;
								highlightNodes = link ? [link.source, link.target] : [];
							}
						}
					}

					if(selectedNode!=null){
						if(selectedNode.id==link.source.id || selectedNode.id==link.target.id){
							if(val<(threshholdFilterValue/100)){
							}
							else{
								highlightLink = link;
								highlightNodes = link ? [link.source, link.target] : [];
							}
						}
						else{
						}
					}
					else{
						if(val<(threshholdFilterValue/100)){
						}
						else{
							highlightLink = link;
							highlightNodes = link ? [link.source, link.target] : [];
						}
					}
				}
				else{
					highlightLink = null;
					highlightNodes = [];
				}
				// highlightLink = link;
				// highlightNodes = link ? [link.source, link.target] : [];
			})
			// .linkWidth(link => link === highlightLink ? 5 : 1)
			.linkDirectionalParticles(4)
			.linkDirectionalParticleSpeed(function(d){
				return d.value/50;
			})
			.linkDirectionalParticleWidth(link => link === highlightLink ? 4 : 0)
			//.linkHoverPrecision(0.0000015)
			.linkHoverPrecision(4)
			.linkColor(function(d) {
				var finalColor = "";
				if(seedWords.indexOf(d.source)>-1 || seedWords.indexOf(d.target)>-1){
					// d.color=d.colors.seed_word;
					// d.color=d.colors.normal;
					return "black";
					d.connected_to_seed_word = true;
				}
				else {
					d.connected_to_seed_word = false;

					if (d.is_ddc_edge_internal) {
						// d.color=d.colors.ddc;
						finalColor = ddcLinkColor;
						//return  ddcLinkColor;
					}
					else if (d.is_ddc_edge) {
						//d.color = d.colors.ddc[0];
						// value is based on top ddc class
						if (d.source in ddcMap)
						{
							d.value = ddcMap[d.source];
							var parts = d.colors.ddc[0].split(",");
							if (parts.length != 4) {
								finalColor = d.colors.ddc[0];
								//return d.colors.ddc[0];
							}
							else {
								var colTransparent = (d.value - 0) * (1 - 0) / (1 - 0) + 0;
								parts[3] = colTransparent + ")";
								finalColor = parts.join(",");
								//return parts.join(",");
							}
						}
						else
						{
							finalColor = d.colors.ddc[0];
							//return d.colors.ddc[0];
						}
					}
					else {
						var parts = d.colors.normal.split(",");
						if (parts.length != 4) {
							finalColor = d.colors.normal;
							//return d.colors.normal;
						}
						else {
							finalColor = embeddingLinkColor;
							//return embeddingLinkColor;
						}
					}
				}

				/*var parts = finalColor.split(",");
				if (parts.length != 4) {
					return finalColor;
				}
				//(d.value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
				var orig = Number(parts[3].substr(0, parts[3].length-1));
				var colTransparent = (orig - linkStrengthValue) * (1 - 0) / (1 - 0) + linkStrengthValue;
				parts[3] = colTransparent + ")";
				finalColor = parts.join(",");*/
				return finalColor;
			})
			.linkVisibility(function(d) {
				// filter edge if adjacent to filtered pos node
				try{
					if (d.target && "pos" in d.target) {
						if (should_filter_pos(d.target["pos"])) {
							return false;
						}
					}
					if (d.source && "pos" in d.source) {
						if (should_filter_pos(d.source["pos"])) {
							return false;
						}
					}
				}
				catch (e) {
				}

				var val = d.value;
				if (d.is_ddc_edge && !d.is_ddc_edge_internal) {
					//val -= 100000;
				}

				if (d.is_ddc_edge_internal) {
					if(selectedNode!=null){
						if(selectedNode.id==d.source.id || selectedNode.id==d.target.id){
							return val>=(threshholdDdcFilterValue/100);
						}
					}
					return val>=(threshholdDdcFilterValue/100);
				}
				else if (d.is_ddc_edge) {
					if(selectedNode!=null){
						if(selectedNode.id==d.source.id || selectedNode.id==d.target.id){
							return val>=(threshholdWordsDdcFilterValue/100);
						}
					}
					return val>=(threshholdWordsDdcFilterValue/100);
				}

				if(selectedNode!=null){
					if(selectedNode.id==d.source.id || selectedNode.id==d.target.id){
						return val>=(threshholdFilterValue/100);
					}
				}
				return val>=(threshholdFilterValue/100);
			})
			.linkWidth(function(d){
					var val = d.value;
					if (d.is_ddc_edge && !d.is_ddc_edge_internal) {
						//val -= 100000;
					}

					if (d.is_ddc_edge_internal) {
						if(selectedNode!=null){
							if(selectedNode.id==d.source.id || selectedNode.id==d.target.id){
								if(val<(threshholdDdcFilterValue/100)){
									return 0.00000001 * linkSizeValue;
								}
								else{
									return 1 * linkSizeValue;
								}
							}
							else{
								return 0.00000001 * linkSizeValue;
							}
						}
						else{
							if(val<(threshholdDdcFilterValue/100)){
								return 0.00000001 * linkSizeValue;
							}
							else{
								return 1 * linkSizeValue;
							}
						}
					}
					else if (d.is_ddc_edge) {
						if(selectedNode!=null){
							if(selectedNode.id==d.source.id || selectedNode.id==d.target.id){
								if(val<(threshholdWordsDdcFilterValue/100)){
									return 0.00000001 * linkSizeValue;
								}
								else{
									return 1 * linkSizeValue;
								}
							}
							else{
								return 0.00000001 * linkSizeValue;
							}
						}
						else{
							if(val<(threshholdWordsDdcFilterValue/100)){
								return 0.00000001 * linkSizeValue;
							}
							else{
								return 1 * linkSizeValue;
							}
						}
					}

					if(selectedNode!=null){
						if(selectedNode.id==d.source.id || selectedNode.id==d.target.id){
							if(val<(threshholdFilterValue/100)){
								return 0.00000001 * linkSizeValue;
							}
							else{
								return Math.pow(val, 4) * linkSizeValue;
							}
						}
						else{
							return 0.00000001 * linkSizeValue;
						}
					}
					else{
						if(val<(threshholdFilterValue/100)){
							return 0.00000001 * linkSizeValue;
						}
						else{
							return Math.pow(val, 4) * linkSizeValue;
						}
					}
				}
			);

		network["graph"]
			.d3Force('link')
			.distance(link => {
				if (link.is_ddc_edge_internal) {
					return (ddcDistanceFilterValue*5);
				}
				else if (link.is_ddc_edge) {
					return (distanceFilterValue*5);
				}
				return (wordDistanceFilterValue*5);
			});
	};

	$('.embeddingviz').each(function (ind)
	{
		var thisViz = $(this);
		console.log(thisViz);
		var word_input = thisViz.attr("data-word").split(" ");
		var embedding = thisViz.attr("data-embedding").split(" ");
		var ddc = thisViz.attr("data-ddc") !== "0";
		var maxn = thisViz.attr("data-maxn");
		if (maxn == null)
		{
			maxn = 25;
		}
		var width = thisViz.attr("data-width");
		var height = thisViz.attr("data-height");

		var content = '<div class="vizdiv"></div>';
		thisViz.html(content);

		generate_graph(word_input, embedding, ddc, maxn, width, height, thisViz.find('.vizdiv')[0]);
	});
});

