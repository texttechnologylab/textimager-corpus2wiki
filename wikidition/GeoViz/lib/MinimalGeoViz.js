// This a modified version of the bundle.js from the GeoViz Project (16/17)
// It is intended as a proof of concept regarding the integration of GeoViz
// into the Wikidition Project

// Most funcitonality of GeoViz has been disabled, or, due to a lack of availability
// of data, not implemented for this version.

// For a fully fledged integration, this component needs to be refactored.


var GeoViz = function(e, data) {
    var t = {};

    function n(o) {
        if (t[o]) return t[o].exports;
        var s = t[o] = {
            i: o,
            l: !1,
            exports: {}
        };
        return e[o].call(s.exports, s, s.exports, n), s.l = !0, s.exports
    }
    return n.m = e, n.c = t, n.d = function(e, t, o) {
        n.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: o
        })
    }, n.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }, n.t = function(e, t) {
        if (1 & t && (e = n(e)), 8 & t) return e;
        if (4 & t && "object" == typeof e && e && e.__esModule) return e;
        var o = Object.create(null);
        if (n.r(o), Object.defineProperty(o, "default", {
                enumerable: !0,
                value: e
            }), 2 & t && "string" != typeof e)
            for (var s in e) n.d(o, s, function(t) {
                return e[t]
            }.bind(null, s));
        return o
    }, n.n = function(e) {
        var t = e && e.__esModule ? function() {
            return e.default
        } : function() {
            return e
        };
        return n.d(t, "a", t), t
    }, n.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }, n.p = "", n(n.s = 0)
}([function(e, t, n) {
    "use strict";
    n.r(t);
    class o {
        constructor(e, t) {
            t = t || {}, this.mapboxToken = "pk.eyJ1IjoiZGlya21leWVyIiwiYSI6ImNpa284YTgybTAwYWJ2cWxzdjB0bXk0eGoifQ.V_Iz6OIBEqZDf4rqVmsKAg", L.mapbox.accessToken = this.mapboxToken, this.mapInstance = L.mapbox.map(e, void 0, {
                minZoom: t.minZoom || 1,
                maxZoom: t.maxZoom || 18
            });
            const n = L.mapbox.tileLayer("mapbox.streets").addTo(this.mapInstance);
            t.multiLayers && L.control.layers({
                Map: n,
                Satellite: L.mapbox.tileLayer("mapbox.streets-satellite")
            }).addTo(this.mapInstance), t.minimap && new L.Control.MiniMap(L.mapbox.tileLayer("mapbox.streets"), {
                toggleDisplay: !0
            }).addTo(this.mapInstance), this.mapInstance.setView(t.initView || [50.108101, 8.68212], t.initZoom || 2)
        }
        addMarker(e, t) {
            return L.marker(e, {
                title: t.tooltip
            }).addTo(this.mapInstance)
        }
        addGeoJson(e, t) {
            return L.geoJson(e, t).addTo(this.mapInstance)
        }
        addCircle(e, t, n) {
            return console.log(e, t, n), L.circle(e, t, n).addTo(this.mapInstance)
        }
        addPolygon(e, t) {
            return L.polygon(e, t).addTo(this.mapInstance)
        }
        addLine(e, t) {
            return console.log("addLine", e, t), L.polyline(e, t).addTo(this.mapInstance)
        }
        onMapClick(e) {
            this.mapInstance.on("click", e)
        }
        showPopup(e, t) {
            return L.popup().setLatLng(e).setContent(t).openOn(this.mapInstance)
        }
    }
    class i {
        constructor() {
            this.htmlElement = document.createElement("html"), this.htmlElement.title = "Popup", this.htmlElement.innerText = "Test"
        }
        static createEventPopup(e) {
            const t = document.createElement("html");
            t.style.display = "inline-block";
            const n = document.createElement("body");
            n.style.height = "fit-content", n.style.width = "fit-content";
            console.log(e);
            const u = i.createDetails(`${e.text}`);
            n.appendChild(u);
            return t.appendChild(n), t
        }
        static createDetails(e) {
            const t = document.createElement("details"),
                n = document.createElement("summary");
            return n.innerText = e, t.appendChild(n), t
        }
        get element() {
            return this.htmlElement
        }
    }
    class a {
        constructor(e) {
            this.htmlElement = document.createElement("div"), this.htmlElement.style.height = "100%", this.htmlElement.style.width = "100%", this.htmlElement.id = e + "map";
            const t = document.getElementById(e);
            t && t.appendChild(this.htmlElement)
        }
    }
    class r {
        constructor(e) {
            this.textcounter = 0, this.currentlyShowing = -1, this.loadedTexts = new Map, this.htmlElement = document.createElement("div"), this.customizeHtmlElements(e)
        }
        customizeHtmlElements(e) {
            this.htmlElement.style.height = "100%", this.htmlElement.style.width = "0%", this.htmlElement.id = e + "text";
            const t = document.getElementById(e);
            t && t.appendChild(this.htmlElement)
        }
        addText(e) {
            this.textcounter++, this.loadedTexts.set(this.textcounter, e), this.currentlyShowing < 0 && this.showTextWithId(this.textcounter)
        }
        showTextWithId(e) {
            const t = this.loadedTexts.get(e);
            null != t ? (this.currentlyShowing = e, this.htmlElement.innerText = t) : console.warn("no text found with this id", e)
        }
        selectPhrase(e, t) {
            const n = this.loadedTexts.get(this.currentlyShowing);
            if (!n) return;
            let o = n.slice(0, e);
            o += "<mark>", o += n.slice(e, t), o += "</mark>", o += n.slice(t, n.length - 1), this.htmlElement.innerHTML = o
        }
        deselectPhrase() {
            const e = this.loadedTexts.get(this.currentlyShowing);
            e && (this.htmlElement.innerHTML = e)
        }
    }
    class c {
        constructor(e, t) {
            if (this.htmlElement = document.getElementById(e), null == this.htmlElement) throw `no html element with id '${e}' found`;
            this.htmlElement.style.display = "flex",
            this.htmlElement.style.flexFlow = "row wrap",
            this.htmlElement.style.alignItems = "center",
            //this.htmlTextElement = new r(e), // We don't want this in our demo
            this.htmlMapElement = new a(e),
            this.mapInstance = new o(e + "map", t),
            this.mapInstance.onMapClick(this.onMapClicked.bind(this))
        }
        displayData(e) {
            const t = mapData; //s.convertData(e);
            //this.htmlTextElement.addText(t.Text),
            //console.log(t.Text),
            this.parseData(t)
        }
        onMapClicked(e) {
            //this.htmlTextElement.deselectPhrase()
        }
        parseData(e) {
            const t = new Map;
            for (const n of e.Locations) {
                const [o] = e.Context.filter(e => e.reference === n.Id);
                if (o)
                    if (t.set(n.Id, o), "point" !== o.type && "area" !== o.type && "path" !== o.type || o.coordinates && o.coordinates.length) switch (o.type) {
                        case "point":
                            this.mapInstance.addCircle(o.coordinates[0], 100, {});
                            break;
                        case "area":
                            this.mapInstance.addPolygon(o.coordinates, {});
                            break;
                        case "path":
                            this.mapInstance.addLine(o.coordinates, {});
                            break;
                        case "geoJson":
                            if (!o.geoJson) {
                                console.warn("Context is missing geojson for location", n);
                                continue
                            }
                            this.mapInstance.addGeoJson(o.geoJson, {});
                            break;
                        default:
                            console.warn("Unknown location context type", o.type);
                            continue
                    } else console.warn(`No coordinates for location with context type ${o.type}`, n);
                    else console.warn("No context data available for location.", n)
            }
            for (const n of e.Events) {
                if (!n.location || !n.location.length) {
                    console.warn("Missing location for event", n);
                    continue
                }
                const [o] = e.Context.filter(e => e.reference === n.Id), s = n.location.map(n => t.get(n) || e.Context.filter(e => e.reference === n));
                switch (n.type) {
                    case "edge":
                        this.mapInstance.addLine(s.map(e => e.center), {
                            color: "red",
                            weight: 10
                        }).bindPopup(i.createEventPopup(n), {
                            autoPan: !0,
                            maxHeight: 400
                        }).on("click", () => {
                            const e = n.occurrences[0].source;
                            console.log("popup click", e.begin, e.end)//,
                            //this.htmlTextElement.selectPhrase(e.begin, e.end)
                        });
                        break;
                    case "point":
                        this.mapInstance.addMarker(s[0].center, {
                            color: "red"
                        }).bindPopup(i.createEventPopup(n), {
                            autoPan: !0,
                            maxHeight: 400
                        }).on("click", () => {

                            markText(n.text)
                        });
                        break;
                    default:
                        console.warn("Unknown event type", n.type)
                }
            }
        }
    }
    n.d(t, "MapTool", function() {
        return c
    })
}]);

// New function to hilight according to lemma
var lastLemma = ""
function markText(lemma){
  var remove = document.querySelectorAll('[class*="lemma_'+lastLemma+'"]')
  for(var element of remove){
    element.style.backgroundColor = ""
  }
  lastLemma = lemma
  var hilight = document.querySelectorAll('[class*="lemma_'+lemma+'"]')
  for(var element of hilight){
    element.style.backgroundColor = "#ffaaaa"
  }
}

// Here we are building the data structure for GeoViz from the Data on the Wikidition Page

var locationString = document.getElementById("mapdata").innerText
var mapLocations = locationString.split(":")
document.getElementById("mapdata").innerText = ""

var mapData ={
    Events: [],
    Locations: [],
    Persons: [],
    Context: [],
    Text: "PLACEHOLDER"
}
for(var i=0; i<mapLocations.length; i++){
  mapData.Events.push({
      Id: "id:"+i,
      occurrences: [{
          source: {},
          persons: []
      }],
      location: ["id:"+i],
      type: "point",
      text: mapLocations[i].split(", ")[2]
  })
}
for(var i=0; i<mapLocations.length; i++){
  mapData.Locations.push({
          Id: "id:"+i,
          source: {},
      })
}
for(var i=0; i<mapLocations.length; i++){
  mapData.Context.push({
          Id: "id:"+i,
          reference: "id:"+i,
          center: mapLocations[i].split(", ").slice(0,2).map(x => parseFloat(x)),
          type: "geoJson",
          geoJson: {
              type: "Polygon",
              coordinates: [
                  []
              ]
          }
      })
}
console.log(mapData);
var geovizTool = new GeoViz.MapTool('map', mapData);
geovizTool.displayData(undefined, { multiLayers: true });
//# sourceMappingURL=bundle.js.map
