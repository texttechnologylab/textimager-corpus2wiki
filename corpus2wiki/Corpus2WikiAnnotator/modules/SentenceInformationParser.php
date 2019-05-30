<?php
//include 'TooltipParser.php';

/**
 * Corpus2WikiAnnotator Parser Functions
 *
 * @file
 * @ingroup Extensions
 */
class SentenceInformationParser {

    /**
     * Parser function handler for {{#sentence: sentence_id | START/END | attribute:value,...}}
     *
     * @param Parser $parser
     * @param string $arg
     *
     * @return string: HTML to insert in the page.
     */
    public static function parseSentenceInfo( $parser, $value ) {

        $args = array_slice( func_get_args(), 2 );
        $switch = $args[0];
        $info = count($args) > 1 ? $args[1] : "";

        //////////////////////////////////////////
        // BUILD HTML                           //
        //////////////////////////////////////////

        $html = "";

        if($switch == "START"){
          $html = '<span class="SENTENCE_'.$value.'">';
        }

        if($switch == "END"){
          $info = htmlspecialchars(Sanitizer::removeHTMLtags($info));
          $info = addslashes($info);

          $tooltip_title  = "Sentence #".$value;
          $value = "<sup>".$value."</sup>";

          $html  = TooltipParser::parseTooltip($value, $info, $tooltip_title, "");
          $html .= "</span>";
        }

        return array(
            $html,
            'noparse' => true,
            'isHTML' => true,
            "markerType" => 'nowiki'
        );
    }

}
