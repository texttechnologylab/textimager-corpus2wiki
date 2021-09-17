from sys import argv
from os import makedirs, path, listdir
from cassis import Cas, load_typesystem, TypeSystem, load_dkpro_core_typesystem, merge_typesystems

"""
Writes text to XMI file.
Usage: python3 import.py <path to text file> <embedding id> <output path to xmi file>
"""

# UIMA types
UIMA_TYPE_META_DATA_STRING_FIELD = "de.tudarmstadt.ukp.dkpro.core.api.metadata.type.MetaDataStringField"

# build typesystem from dkpro base, merge with TextImager
typesystem_base = TypeSystem()
typesystem_dkpro = load_dkpro_core_typesystem()
with open("./TypeSystemValid.xml", "rb") as typesystem_xml:
    typesystem_textimager = load_typesystem(typesystem_xml)

typesystem = merge_typesystems(typesystem_base, typesystem_dkpro, typesystem_textimager)

def get_text_from_file(wpath, fname):
    """Given a path of a txt-file, return string containing all lines of that text file separated by newline.
    Args:
        path (str)

    Returns:
        str
    """
    try:
        f = open(path.join(wpath,fname), "rt")
        text = f.read()
    except:
        print("Error reading file at:", wpath)
    return text


def write_wiki_xmi(text, fname, embedding_id, output_path):
    """Given a string of text and an embedding_id, write it to XMI file at given output path."""
    
    cas = Cas(typesystem=typesystem)
    cas.sofa_mime = "text/plain"
    cas.sofa_string = text
    
    # get types
    UimaMetaDataStringField = cas.typesystem.get_type(UIMA_TYPE_META_DATA_STRING_FIELD)

    # create meta data(embedding id)
    embedding_id_field = UimaMetaDataStringField(
        begin=0,
        end=len(cas.sofa_string),
        key="embedding_id",
        value=embedding_id
    )
    cas.add_annotation(embedding_id_field)
        
    # write xmi file
    try:
        cas.to_xmi(path.join(output_path, fname.rstrip(".txt")), pretty_print=True)
    except:
        print("Error writing file at:", {output_path})


if __name__ == "__main__":
    wpath = argv[1]
    embedding_id = argv[2]
    files = [f for f in listdir(wpath) if path.isfile(path.join(wpath, f))]
    for f in files:
        text = get_text_from_file(wpath, f)
        write_wiki_xmi(text, f, embedding_id, wpath)
        
