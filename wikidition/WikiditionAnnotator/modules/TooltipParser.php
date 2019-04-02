<?php

/**
 * WikiditionAnnotator Parser Functions
 *
 * @file
 * @ingroup Extensions
 */
class TooltipParser {

    /**
     * generates the tooltip <span> object, including the table with annotations
     *
     * @param string $value
     * @param string $info
     * @param string $title
     * @param string $hilite_categories
     *
     * @return string: HTML to insert in the page.
     */
     public static function parseTooltip( $value, $info, $title, $hilite_categories ) {

       $info = str_replace(",", "</td></tr><tr><td><b>", $info);
       $info = str_replace(":", "</b></td><td>", $info);

       $html  = '<span class="simple-tooltip simple-tooltip-inline ';
       $html .= $hilite_categories . '"';
       $html .= ' data-simple-tooltip="<table><tr><th colspan=2>';
       $html .= $title . '</th></tr><tr><td><b>' . $info . '</td></tr></table>"';
       $html .= '>' . $value . '</span>';

       return $html;

    }

}
