<?php

/**
 * GeoViz Parser Functions
 *
 * @file
 * @ingroup Extensions
 */
class GeoVizParser {

    /**
     * Parser function handler for {{#sentence: sentence_id | START/END | attribute:value,...}}
     *
     * @param Parser $parser
     * @param string $arg
     *
     * @return string: HTML to insert in the page.
     */
    public static function LocationParser( $parser, $value ) {

      $args = array_slice( func_get_args(), 1 );
      $info = $args[0];

      //////////////////////////////////////////
      // BUILD HTML                           //
      //////////////////////////////////////////

      $info = htmlspecialchars(Sanitizer::removeHTMLtags($info));
      $info = addslashes($info);

      $html  = '
      <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.3.1/dist/leaflet.js"></script>
    <script src="https://api.mapbox.com/mapbox.js/v3.1.1/mapbox.js"></script>
    <link href="https://api.mapbox.com/mapbox.js/v3.1.1/mapbox.css" rel="stylesheet" />
    <script type="text/javascript" src="../lib/MinimalGeoViz.js"></script>

    <div id="map" style="height: 600px; width: 800px; display: block;"></div>
    Kleine Html-Seite zum testen des GeoViz Tools.

    <script type="text/javascript">
        console.log(this);
        var geovizTool = new GeoViz.MapTool("map");
        geovizTool.displayData(undefined, { multiLayers: true });
    </script>
<script type="text/javascript" src="bundle.js"></script>
      ';

      return array(
          $html,
          'noparse' => true,
          'isHTML' => true,
          "markerType" => 'nowiki'
      );

    }

}
