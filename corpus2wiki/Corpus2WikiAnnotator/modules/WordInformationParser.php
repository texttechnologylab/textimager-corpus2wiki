<?php
//include 'TooltipParser.php';

/**
 * Corpus2WikiAnnotator Parser Functions
 *
 * @file
 * @ingroup Extensions
 */
class WordInformationParser {

    /**
     * Parser function handler for {{#word: theWord | attribute:value,...}}
     *
     * @param Parser $parser
     * @param string $arg
     *
     * @return string: HTML to insert in the page.
     */
   public static function parseWordInfo( $parser, $value ) {

        $args = array_slice( func_get_args(), 2 );
        $info = $args[0];

        //////////////////////////////////////////
        // BUILD HTML                           //
        //////////////////////////////////////////

        $info = htmlspecialchars(Sanitizer::removeHTMLtags($info));
        $info = addslashes($info);
        $info = str_replace(array(":,", "::"), array(":&comma;", ":&colon;"), $info);

        $value = str_replace(array("\"", '"'), "&quot;", $value);

        $hilite_categories = "";
		$lemma = null;
		$pos = null;
        $parts = explode(",", $info);
        for($i=0; $i<sizeof($parts); $i++){
          $this_part = explode(":", $parts[$i]);
          // add lemma to class
          if($this_part[0] === "lemma"){
            $hilite_categories .= " " . $this_part[0] . "_" . $this_part[1];
			$lemma = $this_part[1];
          } else {
	          // Everything else with MARK_ so that it appears in the sidebar
    	      $hilite_categories .= " MARK_" . $this_part[0] . "_" . $this_part[1];
			  if ($this_part[0] === "pos") {
				  $pos = $this_part[1];
			  }
		  }
        }

        $html = TooltipParser::parseTooltip($value, $info, $value, $hilite_categories);
		if ($pos === "NNP") {
			$html = "<i>" . $html . "</i>";
		} else if (in_array($pos, ["NN", "LOCATION", "ORGANIZATION"])) {
			$html = "<a href=\"https://en.wikipedia.org/wiki/" . $lemma . "\">" . $html . "</a>";
		}

        return array(
            $html,
            'noparse' => true,
            'isHTML' => true,
            "markerType" => 'nowiki'
        );
    }

}
