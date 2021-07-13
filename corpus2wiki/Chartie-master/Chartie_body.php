<?php
 global $wgChartie;
 $wgChartie_ = $wgChartie;
 unset ($wgChartie);

 global $wgChartie;
 $wgChartie                 = [];
 $wgChartie["data"]         = '';
 $wgChartie["width"]        = isset($wgChartie_["width"]       ) ? $wgChartie_["width"]        : 865;
 $wgChartie["height"]       = isset($wgChartie_["height"]      ) ? $wgChartie_["height"]       : 360;
 $wgChartie["legend_title"] = isset($wgChartie_["legend_title"]) ? $wgChartie_["legend_title"] : '' ;
 $wgChartie["x_type"]       = isset($wgChartie_["x_type"]      ) ? $wgChartie_["x_type"]       : '' ;
 $wgChartie["x_title"]      = isset($wgChartie_["x_title"]     ) ? $wgChartie_["x_title"]      : '' ;
 $wgChartie["x_unit"]       = isset($wgChartie_["x_unit"]      ) ? $wgChartie_["x_unit"]       : '' ;
 $wgChartie["x_null"]       = isset($wgChartie_["x_null"]      ) ? $wgChartie_["x_null"]       : '' ;
 $wgChartie["y_type"]       = isset($wgChartie_["y_type"]      ) ? $wgChartie_["y_type"]       : '' ;
 $wgChartie["y_title"]      = isset($wgChartie_["y_title"]     ) ? $wgChartie_["y_title"]      : '' ;
 $wgChartie["y_unit"]       = isset($wgChartie_["y_unit"]      ) ? $wgChartie_["y_unit"]       : '' ;
 $wgChartie["y_null"]       = isset($wgChartie_["y_null"]      ) ? $wgChartie_["y_null"]       : '' ;
 $wgChartie["delimiter"]    = isset($wgChartie_["delimiter"]   ) ? $wgChartie_["delimiter"]    : ';';
 $wgChartie["style"]        = isset($wgChartie_["style"]       ) ? $wgChartie_["style"]        : '' ;
 $wgChartie["class"]        = 'chart-container'.
                             (isset($wgChartie_["class"])        ? ' '.$wgChartie_["class"]    : '');

 class Chartie extends ImageHandler {
	public static function onBeforePageDisplay ( OutputPage $out){
	    global $wgChartie, $wgLanguageCode;

  		if (strpos($out->getHTML(),'class="'.$wgChartie["class"]) !== false){
  			$locale = __DIR__."/i18n/".$wgLanguageCode.".js";
        $locale = @file_get_contents($locale);
        if ($locale !== false) $out->addInlineScript($locale);
        $out->addModules('ext.Chartie');
  		}
		}

	static public function onParserFirstCallInit( Parser &$parser ) {
  		$parser->setFunctionHook( "chart", "Chartie::parseChartFunc" );
  		$parser->setHook('chart', "Chartie::parseChartTag");
  		return true;
	}

	static public function onParserMakeImageParams($title, $file, &$params, Parser $parser ) {
	    global $wgChartie;

      if ($file) {
        if (self::check_file($file)) {
                $tmp = [];
                parse_str(str_replace(array(','), array('&'), $params["frame"]["caption"]), $tmp);
                foreach($wgChartie as $param => $value) {
                    if (isset($tmp[$param])) $params["handler"][$param] = $tmp[$param];
                }
                return false;
        }
      }

		  return true;
	}

	static public function parseChartTag($input, array $args, Parser $parser, PPFrame $frame ) {
	    global $wgChartie;

      $params = array_merge($wgChartie, $args);
      $params["style"] = $wgChartie["style"].' '.$params["style"];
      $params["class"] = $wgChartie["class"].' '.$params["class"];
      $params["data" ] =(isset($args["data"]) ?  $params["data" ]: trim($input));

      $f = Title::newFromText( $params["data"], NS_FILE );
      if ($f) {
        $f = wfFindFile( $f->getBaseText() );
      }
  		if ($f) {
  		    $params["data"] = $f->getCanonicalUrl();
  		}

      $par = [];
      foreach($params as $key=>$value){
        if ($value !== '') {
          $par[$key]=$value;
        }
      }

  		$elem = Html::element('div', $par, "");

  		return [ $elem, 'noParse'=> true, 'isHTML'=> 'true' ];
	}

	static public function parseChartFunc( Parser &$parser ) {
	    global $wgChartie;
  		$args = func_get_args();
  		array_shift( $args );

      $f = Title::newFromText( trim($args[0]), NS_FILE );
      if ($f) {
        $f = wfFindFile( $f->getBaseText() );
      }
      if ($f) {
          $args[0] = ($f->getCanonicalUrl());
      }

      $i=0;
  		foreach($wgChartie as $param=>$value) {
  		    if (isset($args[$i])) {
  		        $args[$i] = $param."=".$args[$i];
  		    } else {
  		        $args[$i] = $param."=".$value;
  		    }
  		    $i++;
      }

  		$params = [];
  		parse_str( implode( "&", $args ), $params );
  		$params = array_merge($wgChartie, $params );
      $params["style"] = $wgChartie["style"].' '.$params["style"];
      $params["class"] = $wgChartie["class"].' '.$params["class"];

      $par = [];
      foreach($params as $key=>$value){
        if ($value !== '') {
          $par[$key]=$value;
        }
      }

  		$elem = Html::element('div', $par, "");

  		return [ $elem, 'noParse'=> true, 'isHTML'=> 'true' ];
	}

	public static function onImageOpenShowImageInlineBefore( $imagepage, $out ){
      global $wgChartie;
      
      if ($imagepage->getDisplayedFile()) {
        if (self::check_file($imagepage->getDisplayedFile())) {
              $params=$wgChartie;
              $params["data"] = $imagepage->getDisplayedFile()->getCanonicalUrl();

              $par = [];
              foreach($params as $key=>$value){
                if ($value !== '') {
                  $par[$key]=$value;
                }
              }

              $out->addHtml(Html::element('div', $par, ""));
              $out->addModules('ext.Chartie');
        }
      }
	}

    public static function onImageBeforeProduceHTML (&$dummy, &$title, &$file, &$frameParams, &$handlerParams, &$time, &$res) {
        global $wgChartie;

        if ($file) {
          if (self::check_file($file)) {
              $params=array_merge($wgChartie, $handlerParams);
              $params["data"] = $file->getCanonicalUrl();

              $par = [];
              foreach($params as $key=>$value){
                if ($value !== '') {
                  $par[$key]=$value;
                }
              }

              $res = Html::element('div', $par, "");
              return false;
          }
        }

		    return true;
    }

	function doTransform( $image, $dstPath, $dstUrl, $params, $flags = 0){
    //is compulsory for ImageHandler
	}

  public static function check_file($file){
    global $wgChartie;

    $text  = file_get_contents($file->getCanonicalUrl());
    $delim = $wgChartie["delimiter"];
    $match_format = (preg_match("/([^".$delim."]*)".$delim."([\\d\\.\\,]+)".$delim."([\\d\\.\\,]+)/ui", $text) !== 0);

    return ($file->getMimeType() === "text/csv" && $match_format);
  }
}
