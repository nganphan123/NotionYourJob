from bs4 import BeautifulSoup
import re

def extract(html: str):
    # Parse the HTML and extract text
    soup = BeautifulSoup(html, 'html.parser')
    text_string = soup.get_text('\n')
    text_string = re.sub(' +', ' ', text_string)
    return text_string

html = ""
print(extract(html))