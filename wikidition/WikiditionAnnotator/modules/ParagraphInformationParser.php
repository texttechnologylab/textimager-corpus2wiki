<?php
//Sinclude 'TooltipParser.php';

/**
 * WikiditionAnnotator Parser Functions
 *
 * @file
 * @ingroup Extensions
 */
class ParagraphInformationParser {

    /**
     * Parser function handler for {{#paragraph: sentence_id | START/END | attribute:value,...}}
     *
     * @param Parser $parser
     * @param string $arg
     *
     * @return string: HTML to insert in the page.
     */
    public static function parseParagraphInfo( $parser, $value ) {

        $args = array_slice( func_get_args(), 2 );
        $switch = $args[0];
	      $info = $args[1];

        //////////////////////////////////////////
        // BUILD HTML                           //
        //////////////////////////////////////////

        $html = "";

        if($switch == "END"){
          $html = '</span>';
        }

        if($switch == "START"){
          $info = htmlspecialchars(Sanitizer::removeHTMLtags($info));
          $info = addslashes($info);

          $tooltip_title  = "Paragraph ".$value;
          $value = '<span style="background-color:#ddf;">('.$value.')</span>';

          $html  = '<span class="PARAGRAPH_'.$value.'">';
          $html .= TooltipParser::parseTooltip($value, $info, $tooltip_title, "");
        }

        return array(
            $html,
            'noparse' => true,
            'isHTML' => true,
            "markerType" => 'nowiki'
        );
    }

}
