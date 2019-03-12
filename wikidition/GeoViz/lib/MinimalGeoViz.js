var GeoViz = function(e) {
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
                minZoom: t.minZoom || 5,
                maxZoom: t.maxZoom || 18
            });
            const n = L.mapbox.tileLayer("mapbox.streets").addTo(this.mapInstance);
            t.multiLayers && L.control.layers({
                Map: n,
                Satellite: L.mapbox.tileLayer("mapbox.streets-satellite")
            }).addTo(this.mapInstance), t.minimap && new L.Control.MiniMap(L.mapbox.tileLayer("mapbox.streets"), {
                toggleDisplay: !0
            }).addTo(this.mapInstance), this.mapInstance.setView(t.initView || [50.108101, 8.68212], t.initZoom || 13)
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
    class s {
        static convertData(e) {
            return console.log(e), {
                Events: [{
                    Id: "id:2",
                    occurrences: [{
                        source: {
                            begin: 0,
                            end: 32
                        },
                        persons: ["id:0"]
                    }],
                    location: ["id:1"],
                    type: "point"
                }, {
                    Id: "id:999",
                    occurrences: [{
                        source: {
                            begin: 0,
                            end: 32
                        },
                        persons: ["id:0"]
                    }],
                    location: ["id:99"],
                    type: "point"
                }, {
                    Id: "id:4",
                    occurrences: [{
                        source: {
                            begin: 33,
                            end: 74
                        },
                        persons: ["id:0"]
                    }],
                    location: ["id:1", "id:3"],
                    type: "edge"
                }, {
                    Id: "id:8",
                    occurrences: [{
                        source: {
                            begin: 75,
                            end: 139
                        },
                        persons: ["id:0", "id:5", "id:6", "id:7"]
                    }],
                    location: ["id:3"],
                    type: "point"
                }],
                Locations: [{
                    Id: "id:1",
                    source: {
                        begin: 14,
                        end: 19
                    }
                }, {
                    Id: "id:3",
                    source: {
                        begin: 54,
                        end: 63
                    }
                }, {
                    Id: "id:99",
                    source: {
                        begin: 54,
                        end: 63
                    }
                }],
                Persons: [{
                    source: {
                        begin: 0,
                        end: 5
                    },
                    Id: "id:0",
                    displayName: "Pascal A.",
                    forname: "Pascal",
                    surname: "Adeberg"
                }, {
                    source: {
                        begin: 79,
                        end: 83
                    },
                    Id: "id:5",
                    displayName: "Pedro",
                    forname: "Pedro",
                    surname: void 0
                }, {
                    source: {
                        begin: 86,
                        end: 90
                    },
                    Id: "id:6",
                    displayName: "Lukas",
                    forname: "Lukas",
                    surname: void 0
                }, {
                    source: {
                        begin: 96,
                        end: 100
                    },
                    Id: "id:7",
                    displayName: "Robin",
                    forname: "Robin",
                    surname: void 0
                }],
                Context: [{
                    Id: "id:9",
                    reference: "id:1",
                    center: [50.23161452670807, 8.768849372863771],
                    type: "geoJson",
                    geoJson: {
                        type: "Polygon",
                        coordinates: [
                            [
                                [8.688465, 50.236651],
                                [8.817679, 50.1985329],
                                [8.8185946, 50.2114282],
                                [8.6969239, 50.2504603],
                                [8.688465, 50.236651]
                            ]
                        ]
                    }
                }, {
                    Id: "id:9",
                    reference: "id:3",
                    center: [50.12228407229906, 8.646154403686525],
                    type: "geoJson",
                    geoJson: {
                        type: "Polygon",
                        coordinates: [
                            [
                                [8.5994166, 50.1140381],
                                [8.6006126, 50.1120474],
                                [8.6038263, 50.1072348],
                                [8.6049185, 50.1056762],
                                [8.6081404, 50.1054894],
                                [8.612954, 50.1055512],
                                [8.6126594, 50.1066861],
                                [8.6158222, 50.1071152],
                                [8.6171373, 50.1077047],
                                [8.618812, 50.1075938]
                            ]
                        ]
                    }
                },{
                    Id: "id:9",
                    reference: "id:99",
                    center: [50.22228407229906, 9.746154403686525],
                    type: "geoJson",
                    geoJson: {
                        type: "Polygon",
                        coordinates: [
                            [
                                [8.7994166, 50.1140381],
                                [9.6006126, 50.1120474],
                                [9.6038263, 50.1072348],
                                [9.6049185, 50.1056762],
                                [9.6081404, 50.1054894],
                                [9.612954, 50.1055512],
                                [9.6126594, 50.1066861],
                                [9.6158222, 50.1071152],
                                [8.6171373, 50.1077047],
                                [8.618812, 50.1075938]
                            ]
                        ]
                    }
                }],
                Text: "Pascal ist in Karben aufgewacht. Von dort ist er nach Bockenheim gefahren. Mit Pedro, Lukas und Robin hat er anschließen etwas präsentiert."
            }
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
            for (const t of e.occurrences) {
                const e = i.createDetails(`${t.source.begin} - ${t.source.end}`),
                    o = document.createElement("div");
                for (const e of t.persons) {
                    const t = i.createDetails(e);
                    o.appendChild(t)
                }
                e.appendChild(o), n.appendChild(e)
            }
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
            this.htmlElement = document.createElement("div"), this.htmlElement.style.height = "100%", this.htmlElement.style.width = "70%", this.htmlElement.id = e + "map";
            const t = document.getElementById(e);
            t && t.appendChild(this.htmlElement)
        }
    }
    class r {
        constructor(e) {
            this.textcounter = 0, this.currentlyShowing = -1, this.loadedTexts = new Map, this.htmlElement = document.createElement("div"), this.customizeHtmlElements(e)
        }
        customizeHtmlElements(e) {
            this.htmlElement.style.height = "100%", this.htmlElement.style.width = "30%", this.htmlElement.id = e + "text";
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
            this.htmlElement.style.display = "flex", this.htmlElement.style.flexFlow = "row wrap", this.htmlElement.style.alignItems = "center", this.htmlTextElement = new r(e), this.htmlMapElement = new a(e), this.mapInstance = new o(e + "map", t), this.mapInstance.onMapClick(this.onMapClicked.bind(this))
        }
        displayData(e) {
            const t = s.convertData(e);
            this.htmlTextElement.addText(t.Text), console.log(t.Text), this.parseData(t)
        }
        onMapClicked(e) {
            this.htmlTextElement.deselectPhrase()
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
                            console.log("popup click", e.begin, e.end), this.htmlTextElement.selectPhrase(e.begin, e.end)
                        });
                        break;
                    case "point":
                        this.mapInstance.addMarker(s[0].center, {
                            color: "red"
                        }).bindPopup(i.createEventPopup(n), {
                            autoPan: !0,
                            maxHeight: 400
                        }).on("click", () => {
                            const e = n.occurrences[0].source;
                            console.log("popup click", e.begin, e.end), this.htmlTextElement.selectPhrase(e.begin, e.end)
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
//# sourceMappingURL=bundle.js.map
