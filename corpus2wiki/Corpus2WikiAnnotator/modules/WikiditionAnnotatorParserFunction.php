<?php

/**
 * Corpus2WikiAnnotator Parser Functions
 *
 * @file
 * @ingroup Extensions
 */
class Corpus2WikiAnnotatorParserFunction {

    /**
     * Parser function handler for {{#tip-text: inline-text | tooltip-text | group_mark}}
     *
     * @param Parser $parser
     * @param string $arg
     *
     * @return string: HTML to insert in the page.
     */
    public static function corpus2WikiAnnotator( $parser, $value /* arg2, arg3, */ ) {

        $args = array_slice( func_get_args(), 2 );
        $info = $args[0];
	      $tip_type = $args[1];

        //////////////////////////////////////////
        // BUILD HTML                           //
        //////////////////////////////////////////

        $info = htmlspecialchars(Sanitizer::removeHTMLtags($info));
        $info = addslashes($info);

        $hilite_categories = "";
        if($tip_type == "word"){
          $parts = explode(",", $info);
          for($i=0; $i<sizeof($parts); $i++){
            $this_part = explode(":", $parts[$i]);
            if($this_part[0]=="lemma") continue;
            $hilite_categories .= " MARK_" . $this_part[0] . "_" . $this_part[1];
          }
        }

        $info = str_replace(",", "</td></tr><tr><td><b>", $info);
        $info = str_replace(":", "</b></td><td>", $info);

        $tooltip_title  = ($tip_type=="sentence" ? "Sentence #" : "");
        $tooltip_title .= $value;

        $value = ($tip_type=="sentence") ? "<sup>".$value."</sup>" : $value;

        $html  = '<span class="simple-tooltip simple-tooltip-inline ' . $hilite_categories . '"';
        $html .= ' data-simple-tooltip="<table><tr><th colspan=2>'. $tooltip_title . '</th></tr><tr><td><b>' . $info . '</td></tr></table>"';
        $html .= '>' . $value . '</span>';

        return array(
            $html,
            'noparse' => true,
            'isHTML' => true,
            "markerType" => 'nowiki'
        );
    }

}
