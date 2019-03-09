# Wikidition Annotator

WikiditionAnnotator is a MediaWiki extension that can be used to Annotate Words, Sentences, Paragraphs and Texts with key-value pairs. It provides the following features:

- Tool-tips with information about Words, Sentences and Paragraphs in tabular form
- Info-box with information about the text
- Function to mark Words based on their annotations

The Extension is based on the [MediaWiki Extension](https://www.mediawiki.org/wiki/Extension:SimpleTooltip).


## Registered Hooks

The following hooks are registered by the extension and can be used with the shown syntax:

- `{{#word: MyWord | attribute1:value1,attribute2:value2,...}}`
- `{{#sentence: Nr | START}}`
- `{{#sentence: Nr |END | attribute1:value1,attribute2:value2,...}}`
- `{{#paragraph: Id |START | attribute1:value1,attribute2:value2,...}}`
- `{{#paragraph: Id |END }}`
- `{{#paragraph: Id |END }}`
- `{{#textinfo: attribute1:value1,attribute2:value2,...}}`

## Generated HTML
The tags/hooks and their comprised information are converted to HTML for display.

The generated HTML is for all information kinds (except text information) a <span>-Object which encloses the text displayed and also contains the table which is displayed in the tool-tip.

The textinfo is just converted to a HTML table, that is displayed on the right side of the MediaWiki page.

The paragraph and sentence hooks open, respectively, close a separate <span>-object, which have a distinct class name. This is done to keep the hierarchical structure, and thereby enclosing all the elements that belong to the sentence/paragraph.

## Copyright

Copyright (c) 2015 Simon Heimler for the original Tooltip Extension
Copyright (c) 2019 [Text Technlogy Lab](https://www.texttechnologylab.org/"), Universitaet Frankfurt for the modifications

## The MIT License (MIT)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
