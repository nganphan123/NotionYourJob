import re
import urllib.parse as urlparse
from urllib.parse import urlencode

from bs4 import BeautifulSoup
from .items import PreItem, SpiderRequest

import scrapy


class LinkedInSpider(scrapy.Spider):
    name = "linkedin"
    baseUrl = "https://www.linkedin.com/jobs/api/seeMoreJobPostings/search"

    # def __init__(self):
    #     self.page = request.page

    # def prepareUrl(self, pageIdx) -> str:
        # params from user input
        # linkedin groups jobs in batch of 25
        # params = {
        #     "keywords": self.jobTitle,
        #     "location": self.location,
        #     "start": pageIdx * 25,
        # }
        # encode params to url format
        # query = urlencode(params)
        # parse url
        # urlParts = urlparse.urlparse(self.baseUrl)
        # # construct final url
        # return urlParts._replace(query=query).geturl()

    def start_requests(self):
        # firstBatch = self.prepareUrl(self.page * 2)
        # secondBatch = self.prepareUrl(self.page * 2 + 1)
        # self.logger.info("Visited %s", firstBatch)
        # yield scrapy.Request(url=firstBatch, callback=self.parse)
        # self.logger.info("Visited %s", secondBatch)
        # yield scrapy.Request(url=secondBatch, callback=self.parse)
        yield scrapy.Request(url=self.baseUrl, callback=self.parse)

    def parse(self, response):
        for job in response.css("div.base-card"):
            nextPage = job.css("a.base-card__full-link::attr(href)").get()
            if nextPage:
                # remove query from url
                nextPage = urlparse.urljoin(nextPage, urlparse.urlparse(nextPage).path)
                yield scrapy.Request(url=nextPage, callback=self.parseJobDescrib)
            else:
                yield ({"error": "no job description found"})

    def parseJobDescrib(self, response):
        self.logger.info("Visited next page %s", response.url)

        def extract_part(htmlQuery):
            return response.css(htmlQuery).get(default="").strip()

        # extract listing items
        top_card_layout = response.css(
            "section.top-card-layout"
        ).get()
        soup = BeautifulSoup(top_card_layout, 'html.parser')
        text_string = soup.get_text('\n', strip=True)
        text_string = re.sub(' \n', '', text_string)
        yield {'item': text_string}
