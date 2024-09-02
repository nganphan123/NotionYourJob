# Split the annotated data into training and testing sets
import json
from sklearn.model_selection import train_test_split
import spacy
from spacy.tokens import DocBin
from tqdm import tqdm

# Define a function to create spaCy DocBin objects from the annotated data
def get_spacy_doc(file, data):
  # Create a blank spaCy pipeline
  nlp = spacy.blank('en')
  db = DocBin()

  # Iterate through the data
  for annot in tqdm(data):
    text = annot[0]
    doc = nlp.make_doc(text)
    annot = annot[1:]

    ents = []
    entity_indices = []

    # Extract entities from the annotations
    for start, end, label in annot:
      skip_entity = False
      for idx in range(start, end):
        if idx in entity_indices:
          skip_entity = True
          break
      if skip_entity:
        continue

      entity_indices = entity_indices + list(range(start, end))
      try:
        span = doc.char_span(start, end, label=label, alignment_mode='strict')
      except:
        continue

      if span is None:
        # Log errors for annotations that couldn't be processed
        err_data = str([start, end]) + "    " + str(text) + "\n"
        file.write(err_data)
      else:
        ents.append(span)

    try:
      doc.ents = ents
      db.add(doc)
    except:
      pass

  return db

if __name__ == "__main__":
    # Load the annotated data from a JSON file
    cv_data = []
    for i in range(1, 21):
      file_data = json.load(open('../scrapes/output2/train{idx}.json'.format(idx=i),'r'))
      cv_data.extend(file_data)

    # Display the number of items in the dataset
    print("Data size", len(cv_data))

    # Display the first item in the dataset
    print("First item", cv_data[0])

    train, test = train_test_split(cv_data, test_size=0.2)

    # Display the number of items in the training and testing sets
    print("Train size", len(train), "\nTest size", len(test))

    # Open a file to log errors during annotation processing
    file = open('./anno_process_log.txt','w')

    # Create spaCy DocBin objects for training and testing data
    db = get_spacy_doc(file, train)
    db.to_disk('./trained_models/train_data.spacy')

    db = get_spacy_doc(file, test)
    db.to_disk('./trained_models/test_data.spacy')

    # Close the error log file
    file.close()