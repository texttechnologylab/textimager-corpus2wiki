<?php

/**
 * MediaWikiAnnotator Parser Functions
 *
 * @file
 * @ingroup Extensions
 */
class MediaWikiAnnotatorParserFunction {

    /**
     * Parser function handler for {{#tip-text: inline-text | tooltip-text | group_mark}}
     *
     * @param Parser $parser
     * @param string $arg
     *
     * @return string: HTML to insert in the page.
     */
    public static function mediaWikiAnnotator( $parser, $value /* arg2, arg3, */ ) {

        $args = array_slice( func_get_args(), 2 );
        $info = $args[0];
	      $morph = $args[1];

        //////////////////////////////////////////
        // BUILD HTML                           //
        //////////////////////////////////////////

        $info = str_replace(",", "</td></tr><tr><td><b>", $info);
        $info = str_replace(":", "</b></td><td>", $info);

        $html  = '<span class="simple-tooltip simple-tooltip-inline MORPH_' . $morph . '"';
        $html .= ' data-simple-tooltip="<table><tr><th colspan=2>'. $value. '</th></tr><tr><td><b>' . $info . '</td></tr></table>"';
        $html .= '>' . $value . '</span>';

        return array(
            $html,
            'noparse' => true,
            'isHTML' => true,
            "markerType" => 'nowiki'
        );
    }

}
