# [Chartie](https://www.mediawiki.org/wiki/Extension:Chartie)
## Description
MediaWiki extension which allows to add simple line charts to site pages. Based on [d3.js](https://github.com/d3/d3), renders image as SVG.
There you can see [example chart page](https://en.crystalls.info/Solubility_graph_(comparison)).

## Example
![example of line chart view](https://upload.wikimedia.org/wikipedia/mediawiki/f/ff/Chartie_extension.png "Chart example")

## Supported file extensions
CSV
* .csv

## Install
Download the latest snapshot and extract it to your extensions directory. Then include it in your [LocalSettings.php](https://www.mediawiki.org/wiki/Manual:LocalSettings.php) file as in the following example:
```php
wfLoadExtension( 'Chartie' );

$wgFileExtensions = array_merge(
  $wgFileExtensions, array(
      'csv'
  )
);

```
## Usage
### As Image Handler
```wiki
[[File:Data.csv|800x350px|legend_title=,x_title=,...]]
```

### As Parser function
```wiki
{{#chart:
Name;x_value1;y_value1
Name;x_value2;y_value2
...}}

or

{{#chart:Data.csv}}

with params:
{{#chart:Data.csv|width}}
{{#chart:Data.csv|width|height}}
...
{{#chart:Data.csv|width|height|legend_title|x_type|x_title|x_unit|x_null|y_type|y_title|y_unit|y_null|delimiter|style|class}}
```
Instead of uploaded filename you also can use an url for file located in external site.

### As Parser tag
```html
<chart data="Data.csv" width="" height="" ... ></chart>
or
<chart width="" height="" ... >Data.csv</chart>

or

<chart width="" height="" ... >
Name;x_value1;y_value1
Name;x_value2;y_value2
</chart>
```
You also can use url instead of short filename.

## Parameters
|Name         |Description                        |Default value|
|:------------|:----------------------------------|------------:|
|width        |Chart container width              |865          |
|height       |Chart container height             |360          |
|legend_title |Title of Legend block              |Solvents:    |
|x_type       |Type of x axis value               |temp         |
|x_title      |Title for x axis                   |Temperature  |
|x_unit       |Unit for x axis                    |C            |
|x_null       |If true, use 0 as begin of x axis  |false        |
|y_type       |Type of y axis value               |solub        |
|y_title      |Title for y axis                   |Solubility   |
|y_unit       |Unit for y axis                    |g/100g       |
|y_null       |If true, use 0 as begin of y axis  |false        |
|delimiter    |Delimiter for csv file             |;            |
|style        |Chart container CSS style          |             |
|class        |Chart container HTML class         |             |

Width and height can be set to _auto_, so size of container will be set according to user screen dimensions.

Type of axis defines available units list, that could be converted to each one.
If you want to use your own units, set axis type to 'general'.
If you want to no use unit convertationn at all, set axis type to 'no'.
By default, axis titles and units are automatically sets its value, based on type (as =type name and =first unit in list):

### Axis types and units
|Type    |Units                                              |
|:-------|:--------------------------------------------------|
|general |a,f,p,n,u,m,c,d, ,K,M,G,T,P (prefixes)             |
|time    |s,min,hour,day,month,year                          |
|mass    |mg,ct,g,oz,lb,kg,ton                               |
|length  |mm,cm,in,ft,yd,m,km,mile                           |
|area    |mm2,cm2,in2,dm2,ft2,yd2,m2,a,da,acre,ha,km2,mile2  |
|volume  |mm3,cm3,pt,qt,l,gal,br,m3,km3                      |
|speed   |mps,knot,mph,fps,kph,kps,c                         |
|temp    |C,K,F,Ra                                           |
|solub   |g/100g,%                                           |

### Localisations
For now, extension is also translated to Russian, so you can use localized units name (for example, 'кг' instead of 'kg').
Full list of localizations can be found at _i18n_ dir, they are named to langs.

### Configure
All default values can be changed in your [LocalSettings.php](https://www.mediawiki.org/wiki/Manual:LocalSettings.php) file:
```php
$wgChartie["width"]  = 865;
$wgChartie["height"] = 360;
...
$wgChartie["class"]  = 'someclass';
```

## Controls
|Controls                        |Action                                 |
|:-------------------------------|:--------------------------------------|
|Mouse over line, touch line     |Show tooltip with extrapolated value   |
|Mouse over line dots, touch dot |Show tooltip with exact value          |
|Click on axis title             |Show values from min / from zero       |
|Click on axis unit              |Convert values to new unit             |
|Double click at line            |Hide specified line                    |
|Click or touch legend item      |Hide/show specified line               |
|Click on legend title           |Hide/show all lines                    |
