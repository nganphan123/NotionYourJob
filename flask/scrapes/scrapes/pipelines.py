# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
import re
from scrapy.exceptions import DropItem
from bs4 import BeautifulSoup
from itemadapter import ItemAdapter

from .spiders.items import PreItem

class ScrapesPipeline:
    ner_tags = {"job": "JOB", "location":"LOCATION", "company":"COMPANY"}
    def find_entities(self, substring, full_text, ner_tag):
        return [[match.start(), match.start() + len(substring), self.ner_tags[ner_tag]] for match in re.finditer(substring, full_text)]
    def process_item(self, item: PreItem, spider):
        entities = [item.describ]
        entities.extend(self.find_entities(item.company, item.describ, "company"))
        entities.extend(self.find_entities(item.location, item.describ, "location"))
        entities.extend(self.find_entities(item.role, item.describ, "job"))
        return {"result":entities}
