<?php
include 'TooltipParser.php'

/**
 * WikiditionAnnotator Parser Functions
 *
 * @file
 * @ingroup Extensions
 */
class WikiditionAnnotatorParserFunction {

    /**
     * Parser function handler for {{#word: theWord | attribute:value,...}}
     *
     * @param Parser $parser
     * @param string $arg
     *
     * @return string: HTML to insert in the page.
     */
   public static function parseWordInfo( $parser, $value ) {

        $args = array_slice( func_get_args(), 1 );
        $info = $args[0];

        //////////////////////////////////////////
        // BUILD HTML                           //
        //////////////////////////////////////////

        $info = htmlspecialchars(Sanitizer::removeHTMLtags($info));
        $info = addslashes($info);

        $hilite_categories = "";
        $parts = explode(",", $info);
        for($i=0; $i<sizeof($parts); $i++){
          $this_part = explode(":", $parts[$i]);
          if($this_part[0]=="lemma") continue;
          $hilite_categories .= " MARK_" . $this_part[0] . "_" . $this_part[1];
        }

        $html = TooltipParser::parseTooltip($value, $info, $value, $hilite_categories);

        return array(
            $html,
            'noparse' => true,
            'isHTML' => true,
            "markerType" => 'nowiki'
        );
    }

}
