# textimager-wikidition

## Installation:

1. Install [docker](https://www.docker.com/get-started) and [docker-compose](https://docs.docker.com/compose/install/)
2. Download this repo
3. Runn installation, configuration and start containers using docker-compose -f stack.yml up (if you want a newly compiled wikidition container, add --build)
3. Open your browser and go to localhost:8080 

Mediawiki is now set up with the following parameters:

```
- MW_ADMIN_USER=admin
- MW_ADMIN_PASS=password
- MW_DB_NAME=wikidb
- MW_DB_USER=mediawiki
- MW_DB_PASS=wikidbpw
- MW_DB_INSTALLDB_USER=root
- MW_DB_INSTALLDB_PASS=wikiexporterpw
```

## Add Files to Wikitition:

1. Make sure the containers are running, then open your browser and go to localhost:8080/import
2. Select all the files you want to be analized and added to the Wikidition and select the appropriate settings
3. Pressing the "Upload & Process"-Button will start the import procedure. Please keep the browser open until the process is finished.

## Access Results
visit localhost:8080 (or the adress that is indicated in the terminal during service startup - This needs to be fixed), visit "localhost/index.php/Special:AllPages" and you should see a list of links to your files - click on any one of them and your text (with grammatical infos as tool tips) will be visible.
 
## Legal
(c)2018 [Text Technology Lab](https://www.texttechnologylab.org), Goethe University Frankfurt

Authors: Alex Hunziker, Hasanagha Mammadov, Eleanor Rutherford

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. 
