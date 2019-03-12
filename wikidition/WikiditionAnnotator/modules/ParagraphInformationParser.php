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
          $html = '</span><br>';
        }

        if($switch == "START"){
          $info = htmlspecialchars(Sanitizer::removeHTMLtags($info));
          $info = addslashes($info);

          $tooltip_title  = "Paragraph ".$value;
          $value_txt = '<span style="background-color:#ddd;">('.$value.')</span>';

          $html  = '<span class="PARAGRAPH_'.$value.'">';
          $html .= TooltipParser::parseTooltip($value_txt, $info, $tooltip_title, "");
        }

        return array(
            $html,
            'noparse' => true,
            'isHTML' => true,
            "markerType" => 'nowiki'
        );
    }

}
