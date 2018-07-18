<?php

/**
 * SimpleTooltip Parser Functions
 *
 * @file
 * @ingroup Extensions
 */
class SimpleTooltipParserFunction {

    /**
     * Parser function handler for {{#tip-text: inline-text | tooltip-text }}
     *
     * @param Parser $parser
     * @param string $arg
     *
     * @return string: HTML to insert in the page.
     */
    public static function inlineTooltip( $parser, $value /* arg2, arg3, */ ) {

        $args = array_slice( func_get_args(), 2 );
        $title = $args[0];

        //////////////////////////////////////////
        // BUILD HTML                           //
        //////////////////////////////////////////

	//MODIFIED CODE HERE: checks if the tooltip contains any of the verb tags and if so, adds a 		style element to it - namely, colours the text blue. 
	//$tags = array();

	if (preg_match("~\bVBD\b~",$title)) {
		$html  = '<span class="simple-tooltip simple-tooltip-inline"';
        	$html .= ' data-simple-tooltip="' . htmlspecialchars($title) . '"';
        	$html .= ' style="color:blue">' . htmlspecialchars($value) . '</span>';
	}
	else if(preg_match("~\bVB\b~",$title)){	
        	$html  = '<span class="simple-tooltip simple-tooltip-inline"';
        	$html .= ' data-simple-tooltip="' . htmlspecialchars($title) . '"';
        	$html .= ' style="color:blue">' . htmlspecialchars($value) . '</span>';
	}
	else if (preg_match("~\bVBG\b~",$title)) {
		$html  = '<span class="simple-tooltip simple-tooltip-inline"';
        	$html .= ' data-simple-tooltip="' . htmlspecialchars($title) . '"';
        	$html .= ' style="color:blue">' . htmlspecialchars($value) . '</span>';
	}
	else if(preg_match("~\bVBN\b~",$title)){	
        	$html  = '<span class="simple-tooltip simple-tooltip-inline"';
        	$html .= ' data-simple-tooltip="' . htmlspecialchars($title) . '"';
        	$html .= ' style="color:blue">' . htmlspecialchars($value) . '</span>';
	}
	else if(preg_match("~\bVBP\b~",$title)){	
	        $html  = '<span class="simple-tooltip simple-tooltip-inline"';
	        $html .= ' data-simple-tooltip="' . htmlspecialchars($title) . '"';
        	$html .= ' style="color:blue">' . htmlspecialchars($value) . '</span>';
	}
	else if(preg_match("~\bVBZ\b~",$title)){	
        	$html  = '<span class="simple-tooltip simple-tooltip-inline"';
        	$html .= ' data-simple-tooltip="' . htmlspecialchars($title) . '"';
        	$html .= ' style="color:blue">' . htmlspecialchars($value) . '</span>';
	}
	else {	
        	$html  = '<span class="simple-tooltip simple-tooltip-inline"';
        	$html .= ' data-simple-tooltip="' . htmlspecialchars($title) . '"';
        	$html .= '>' . htmlspecialchars($value) . '</span>';
	}
	

	/*
	ORIGINAL CODE - now just in the else
	$html  = '<span class="simple-tooltip simple-tooltip-inline"';
        $html .= ' data-simple-tooltip="' . htmlspecialchars($title) . '"';
        $html .= '>' . htmlspecialchars($value) . '</span>';*/
	

        return array(
            $html,
            'noparse' => true,
            'isHTML' => true,
            "markerType" => 'nowiki'
        );
    }
 	

    /**
     * Parser function handler for {{#tip-info: tooltip-text }}
     *
     * @param Parser $parser
     * @param string $arg
     *
     * @return string: HTML to insert in the page.
     */
    public static function infoTooltip( $parser, $value /* arg2, arg3, */ ) {

        //////////////////////////////////////////
        // BUILD HTML                           //
        //////////////////////////////////////////

        $html = '<span class="simple-tooltip simple-tooltip-info"';
        $html .= ' data-simple-tooltip="' . htmlspecialchars($value) . '"></span>';

        return array(
            $html,
            'noparse' => true,
            'isHTML' => true,
            "markerType" => 'nowiki'
        );
    }

    /**
     * Parser function handler for {{#tip-img: image-url | tooltip-text }}
     *
     * @param Parser $parser
     * @param string $arg
     *
     * @return string: HTML to insert in the page.
     */
    public static function imgTooltip( $parser, $value /* arg2, arg3, */ ) {

        $args = array_slice( func_get_args(), 2 );
        $title = $args[0];
        $imgUrl = htmlspecialchars($value);

        //////////////////////////////////////////
        // BUILD HTML                           //
        //////////////////////////////////////////

        $html  = '<img class="simple-tooltip simple-tooltip-img"';
        $html .= ' data-simple-tooltip="' . htmlspecialchars($title) . '"';
        $html .= ' src="' . $imgUrl . '"></img>';

        return array(
            $html,
            'noparse' => true,
            'isHTML' => true,
            "markerType" => 'nowiki'
        );
    }

}
