from bs4 import BeautifulSoup
import re

class ExtractedObject:
    def __init__(self):
        self.__company__ = ""
        self.__job_title__ = ""
        self.__location__ = ""
        self.__description__ = []
    def set_company(self, company_name):
        self.__company__ = company_name
    def set_job_title(self, job_title):
        self.__job_title__ = job_title
    def set_location(self, location):
        self.__location__ = location
    def add_description(self, description):
        self.__description__.append(description)


def extract(html: str):
    # Parse the HTML and extract text
    result = ExtractedObject()
    soup = BeautifulSoup(html, 'html.parser')
    # find company name
    for tag in soup.find_all('div', src = re.compile(r'company|org|organization|employer')):
        company_name = tag.get_text(separator='')
        if company_name:
            result.set_company(company_name)
            break
    # find location
    for tag in soup.find_all('div', src = re.compile(r'location')):
        location = tag.get_text(separator='')
        if location:
            result.set_location(location)
            break
    
        
    job_text = soup.get_text(separator=' ')


