import spacy


def main():
    nlp = spacy.load("./trained_models/output/model-last")
    test_file = open("./test_data/file0.txt", 'r')
    doc = nlp(test_file.read())
    # Iterate through the named entities (entities) recognized by the model
    for ent in doc.ents:
        # Print the recognized text and its corresponding label
        print(ent.text, "  ->>>>  ", ent.label_)
if __name__ == "__main__":
    main()