import re
import urllib.parse as urlparse
from urllib.parse import urlencode

from bs4 import BeautifulSoup
from .items import PreItem, SpiderRequest

import scrapy


class LinkedInSpider(scrapy.Spider):
    name = "linkedin"
    baseUrl = "https://www.linkedin.com/jobs/api/seeMoreJobPostings/search"

    def __init__(self, page):
        self.page = page

    def prepareUrl(self, pageIdx) -> str:
        # params from user input
        # linkedin groups jobs in batch of 25
        params = {
            "start": pageIdx * 25,
        }
        # encode params to url format
        query = urlencode(params)
        # parse url
        urlParts = urlparse.urlparse(self.baseUrl)
        # construct final url
        return urlParts._replace(query=query).geturl()

    def start_requests(self):
        # firstBatch = self.prepareUrl(self.page * 2)
        # secondBatch = self.prepareUrl(self.page * 2 + 1)
        # self.logger.info("Visited %s", firstBatch)
        # yield scrapy.Request(url=firstBatch, callback=self.parse)
        # self.logger.info("Visited %s", secondBatch)
        # yield scrapy.Request(url=secondBatch, callback=self.parse)
        yield scrapy.Request(url=self.prepareUrl(self.page), callback=self.parse)

    def parse(self, response):
        for job in response.css("div.base-card"):
            nextPage = job.css("a.base-card__full-link::attr(href)").get()
            if nextPage:
                # remove query from url
                path = urlparse.urlparse(nextPage).path
                if "/jobs/view/" not in path:
                    continue
                nextPage = urlparse.urljoin(nextPage, path)
                yield scrapy.Request(url=nextPage, callback=self.parseJobDescrib)
            else:
                yield ({"error": "no job description found"})

    def parseJobDescrib(self, response):
        self.logger.info("Visited next page %s", response.url)
        soup = BeautifulSoup(response.body, "html.parser")
        item = PreItem()
        item.error = []
        doc_text = []
        for s in soup.text.split("\n"):
            # remove extra spaces
            s = re.sub(" +", " ", s)
            if s == "" or s == " ":
                continue
            doc_text.append(s.strip())
        item.describ = ".".join(doc_text)
        item.role = soup.find("h1", class_="top-card-layout__title").get_text().strip()
        if item.role == "":
            item.error.append("No job title is found.")
        try:
            item.location = soup.select("span.topcard__flavor.topcard__flavor--bullet")[0].get_text().strip()
        except IndexError:
            item.error.append("No location is found.")
        item.company = soup.find("a", class_="topcard__org-name-link").get_text().strip()
        if item.company == "":
            item.error.append("No company is found.")
        yield item
