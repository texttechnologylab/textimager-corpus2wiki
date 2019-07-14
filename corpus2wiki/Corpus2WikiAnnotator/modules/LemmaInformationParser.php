<?php

/**
 * Corpus2WikiAnnotator Lemma Information
 *
 * @file
 * @ingroup Extensions
 */
class LemmaInformationParser {

    /**
     * Parser function handler for {{#lemmainfo: foo:bar,foox:barx}}
     *
     * @param Parser $parser
     * @param string $arg
     *
     * @return string: HTML to insert in the page.
     */
   public static function parseLemmaInfo( $parser, $value) {

        $args = array_slice( func_get_args(), 1 );
        $info = $args[0];

        //////////////////////////////////////////
        // BUILD HTML                           //
        //////////////////////////////////////////

        $info = htmlspecialchars(Sanitizer::removeHTMLtags($info));
        $info = addslashes($info);

		$info = str_replace(":", "</td><td>", $info);
		$info = str_replace(",", "</td></tr><tr><td>", $info);
		$info = '<table class="textinformation">' .
			'<tr><th colspan="2">Lemma</th></tr>' .
			"<tr><td>" . $info . "</td></tr></table>";
		$info = str_replace("<tr><td></td></tr>", "", $info);
		// create wiktionary links
		$info = preg_replace("/<td>WIKTIONARY (\w+) (\w+)/i", '<td><a href="https://$1.wiktionary.org/wiki/$2">$2</a>', $info);

        return array(
            $info,
            'noparse' => false,
            'isHTML' => true,
            "markerType" => 'nowiki'
        );
    }

}
