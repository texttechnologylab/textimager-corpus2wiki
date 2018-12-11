<?php

/**
 * MorphMarker Parser Functions
 *
 * @file
 * @ingroup Extensions
 */
class MorphMarkerParserFunction {

    /**
     * Parser function handler for {{#tip-text: inline-text | tooltip-text | group_mark}}
     *
     * @param Parser $parser
     * @param string $arg
     *
     * @return string: HTML to insert in the page.
     */
    public static function morphmarker( $parser, $value /* arg2, arg3, */ ) {

        $args = array_slice( func_get_args(), 2 );
        $title = $args[0];
	$morph = $args[1];

        //////////////////////////////////////////
        // BUILD HTML                           //
        //////////////////////////////////////////

        $html  = '<span class="simple-tooltip simple-tooltip-inline MORPH_' . $morph . '"';
        $html .= ' data-simple-tooltip="' . htmlspecialchars(Sanitizer::removeHTMLtags($title)) . '"';
        $html .= '>' . $value . '</span>';

        return array(
            $html,
            'noparse' => true,
            'isHTML' => true,
            "markerType" => 'nowiki'
        );
    }

}
