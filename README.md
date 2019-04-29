![Logo Corpus2Wiki](corpus2wiki/logo.png)

# Corpus2Wiki

Corpus2Wiki is based on MediaWiki and allows the vizualisation of word-, sentence-, paragraph- and text-information. It provides tooltips for all the information, supports graphical hilighting of word-based information, shows a histogram of POS-frequency and a map of the locations mentioned in the text.

![Screenshot](images/screenshot.png)

The text analysis is made by the TextImager service provided by the Text Technology Lab (University of Frankfurt). Corpus2Wiki currently supports POS, MORPH, DDC, Lemma and NE information in German and English texts.

An import form is provided for simple and automated document analysis and import.

## Installation:

1. Install [docker](https://www.docker.com/get-started) and [docker-compose](https://docs.docker.com/compose/install/)
2. Download this repo
3. Run installation, configuration and start containers by running `./corpus2wiki.sh` from the corpus2wiki directory (or alternatively `docker-compose -f stack.yml up`, if you want a newly compiled Corpus2Wiki container, add --build)

Corpus2Wiki is now set up on port 8080 (default) with the following parameters:

```
- MW_ADMIN_USER=admin
- MW_ADMIN_PASS=password
- MW_DB_NAME=wikidb
- MW_DB_USER=mediawiki
- MW_DB_PASS=wikidbpw
- MW_DB_INSTALLDB_USER=root
- MW_DB_INSTALLDB_PASS=wikiexporterpw
```

## Start Corpus2Wiki:
Start containers by running `./corpus2wiki.sh` (or alternatively `docker-compose -f stack.yml up`) from the corpus2wiki directory.

## Add Files to Wikitition:

<img align="right" src="images/import.png" alt="upload form" width="170">

1. Make sure the containers are running, then open your browser and go to localhost:8080/import (if accessing from remote, replace localhost with the appropiate ip-address/url)
2. Select all the files you want to be analized and added to the Corpus2Wiki and select the appropriate settings
3. Pressing the "Upload & Process"-Button will start the import procedure. Please keep the browser open until the process is finished.

## Access Results
Go to localhost:8080 (or ip-address/url if accessing from remote).

Visit "localhost/index.php/Special:AllPages" to see a list of links to your files - click on any of them to access the analyzed text and visualizations.

## Legal
(c)2018 [Text Technology Lab](https://www.texttechnologylab.org), Goethe University Frankfurt

Authors: Alex Hunziker, Hasanagha Mammadov, Eleanor Rutherford

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
