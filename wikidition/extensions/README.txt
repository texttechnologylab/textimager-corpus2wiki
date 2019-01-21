==Setup==
1.
Die .js Files müssen bei {wikipath}/resources/lib/selfmade rein.
Die .css Files müssen bei {wikipath}/resources/lib/selfmade/css rein.

2.
{wikipath}/resources/Resources.php bearbeiten:

----
	'tabs' => array(
		'scripts' => array(
			'resources/lib/selfmade/tab.js',
		),
		'styles' => 'resources/lib/selfmade/css/tab.css',

	),

	'tooltip' => array(
		'scripts' => array(
			'resources/lib/selfmade/wikifikation.js',
			'resources/lib/selfmade/tooltip.js',
			'resources/lib/selfmade/tab.js',
		),
		'styles' => 'resources/lib/selfmade/css/tooltip.css',
		'dependencies' => array(
			'tabs',
		),
	),
	...
----

3.
/index.php?title=MediaWiki:Common.js bearbeiten und extentions reinladen:

mw.loader.using('bipartite');
mw.loader.using('graph');
mw.loader.using('posMarker');
...


4.
Beispielwiki mit Extentions:
http://biofidwikidev3.hucompute.org/index.php?title=Main_Page
