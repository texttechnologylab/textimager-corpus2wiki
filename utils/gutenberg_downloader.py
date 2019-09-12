import os
import urllib.request  # the lib that handles the url stuff
import subprocess


def collectLinks(link, language, nDigits, startPos):
    data = urllib.request.urlopen(link)

    targetfiles = []
    lastfile = 0
    for t in data:
        try:
            t = t.decode("utf-8")
        except:
            continue
        isafile = True
        if len(t) > startPos+nDigits-1:
            for i in range(startPos,(startPos+nDigits)):
                if t[i]>"9" or t[i]<"0":
                    isafile = False
        else:
            isafile = False
        if isafile:
            lastfile = t[startPos:(startPos+nDigits)]
            if len(lastfile)<nDigits:
                print("File number is broken")
        if "Language: " + language in t:
            targetfiles.append(lastfile)
            print("Add to dowload queue: ", lastfile)
    return targetfiles

def getFiles(fileList):
    if not os.path.isdir("txt_downloads"):
        os.makedirs("txt_downloads");
    for file in fileList:
        dlpath = "http://eremita.di.uminho.pt/gutenberg/"
        for i in range(len(file)-1):
            dlpath += file[i] + "/"
        dlpath += file + "/" #+ file + ".txt"
        print(dlpath)
        #fileData = urllib.request.urlopen(dlpath)
        bashCommand = "wget " + dlpath + " -r -P txt_downloads -A .txt --no-parent"
        process = subprocess.Popen(bashCommand.split(), stdout=subprocess.PIPE)
        output, error = process.communicate()
        print("- " + str(output) + "E: " + str(error))
    flatten_commands = ["zip -r txt_dowloads.zip txt_downloads", "rm -r txt_downloads", "unzip -n -j txt_dowloads.zip", "rm txt_dowloads.zip"]
    for bashCommand in flatten_commands:
        process = subprocess.Popen(bashCommand.split(), stdout=subprocess.PIPE)
        output, error = process.communicate()
        print("- " + str(output) + "E: " + str(error))

def defineParameters():
    dllink = input("Enter URL from Gutenberg inedex text file: ")
    language = input("Enter language (e.g. German): ")
    nDigits = input("Enter lenght of ID numbers (usually 4 or 5): ")
    startPos = input("Enter ColNr ID number begin (usually between 70 and 75): ")
    return dllink, language, nDigits, startPos

params = defineParameters()
fileList = collectLinks(params[0], params[1], int(params[2]), int(params[3]))
#fileList = collectLinks("http://eremita.di.uminho.pt/gutenberg/GUTINDEX-2008", "German", 5, 73)
getFiles(fileList)
