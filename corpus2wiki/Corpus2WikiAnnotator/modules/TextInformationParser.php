<?php

/**
 * Corpus2WikiAnnotator Document Information
 *
 * @file
 * @ingroup Extensions
 */
class TextInformationParser {

    /**
     * Parser function handler for {{#textinfo: foo:bar,foox:barx}}
     *
     * @param Parser $parser
     * @param string $arg
     *
     * @return string: HTML to insert in the page.
     */
   public static function parseTextInfo( $parser, $value) {

        $args = array_slice( func_get_args(), 1 );
        $info = $args[0];

        //////////////////////////////////////////
        // BUILD WIKITEXT                       //
        //////////////////////////////////////////

        $info = htmlspecialchars(Sanitizer::removeHTMLtags($info));
        $info = addslashes($info);

		// create a wiki table
		$wiki = "{| class=\"textinformation\"
			!colspan=\"2\"|Text Information
			|-
			|<b>" . $info . "
			|}";
		$wiki = str_replace([",", ":"], ["</b>\n|-\n|", "\n|"], $wiki);

		// create wiki links from categories
        $wiki = preg_replace("/(\d+)(_[^<]+)/", "[[:Category:DDC$1|$1$2]]", $wiki);

        return array(
            $wiki,
            'noparse' => false,
            'isHTML' => false,
            "markerType" => 'nowiki'
        );
    }

}
