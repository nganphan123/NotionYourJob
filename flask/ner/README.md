### Initialize spaCy configuration files by copying from base_config to config.cfg
```python
python -m spacy init fill-config ./default_config.cfg ./config.cfg
```

### Train a spaCy NER model using the provided configuration and data
```python
python -m spacy train ./config.cfg  --output ./trained_models/output  --paths.train ./trained_models/train_data.spacy  --paths.dev ./trained_models/test_data.spacy
```

