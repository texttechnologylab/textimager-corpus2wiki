<?php
/**
 * GeoViz Extension
 * Currently just a demo of how to implement GeoViz as a MediaWiki extension
 *
 *
 * @file
 * @ingroup Extensions
 * @package MediaWiki
 *
 * @links https://github.com/texttechnologylab/textimager-wikidition Source code
 *
 * @author Alex Hunziker and Hasanagha Mammadov, 2019
 * @license http://opensource.org/licenses/mit-license.php The MIT License (MIT)
 */

//////////////////////////////////////////
// VARIABLES                            //
//////////////////////////////////////////

$dir         = dirname( __FILE__ );
$dirbasename = basename( $dir );


//////////////////////////////////////////
// CONFIGURATION                        //
//////////////////////////////////////////

$wgWGeoVizSubmitText = 'NEW';


//////////////////////////////////////////
// CREDITS                              //
//////////////////////////////////////////

$wgExtensionCredits['other'][] = array(
   'path'           => __FILE__,
   'name'           => 'GeoViz',
   'author'         => array( 'Alex Hunziker', 'Hasanagha Mammadov', 'Text Technology Lab, University of Frankfurt' ),
   'version'        => '0.1',
   'url'            => 'https://www.texttechnologylab.org',
   'descriptionmsg' => 'GeoViz-desc',
   'license-name'   => 'MIT'
);


//////////////////////////////////////////
// RESOURCE LOADER                      //
//////////////////////////////////////////

$wgResourceModules['ext.GeoViz'] = array(
   'scripts' => array(
      'lib/MinimalGeoViz.js'
   ),
   'styles' => array(
     // No styles
    ),
   'dependencies' => array(
      // No dependencies
   ),
   'localBasePath' => __DIR__,
   'remoteExtPath' => 'GeoViz',
);


//////////////////////////////////////////
// LOAD FILES                           //
//////////////////////////////////////////

// Register i18n
$wgMessagesDirs['GeoViz'] = $dir . '/i18n';
$wgExtensionMessagesFiles['GeoViz'] = $dir . '/GeoViz.i18n.php';
$wgExtensionMessagesFiles['GeoVizMagic'] = $dir . '/GeoViz.i18n.magic.php';

// Register files
$wgAutoloadClasses['GeoVizParser'] = $dir . '/module/GeoVizParser.php';

// Register hooks
$wgHooks['BeforePageDisplay'][] = 'GeoVizOnBeforePageDisplay';
$wgHooks['ParserFirstCallInit'][] = 'GeoVizOnParserFirstCallInit';



//////////////////////////////////////////
// HOOK CALLBACKS                       //
//////////////////////////////////////////

/**
* Add libraries to resource loader
*/
function GeoVizOnBeforePageDisplay( OutputPage &$out, Skin &$skin ) {

  // Add as ResourceLoader Module
  $out->addModules('ext.GeoViz');

  return true;
}

/**
* Register parser hooks
*
* See also http://www.mediawiki.org/wiki/Manual:Parser_functions
*/
function GeoVizOnParserFirstCallInit( &$parser ) {

  // Register parser functions
  $parser->setFunctionHook('geoviz', 'GeoVizParser::LocationParser');

  return true;
}
