import json
from args import get_provider, get_provider_handler, get_arg_parser
from scrapy.crawler import CrawlerProcess
from scrapy.signalmanager import dispatcher
from scrapy import signals
from scrapy.utils.project import get_project_settings


def crawl_job():
    results = []  # scraped items
    options = get_arg_parser().parse_args()
    platform = options.provider

    def store_crawler_item(item):
        results.append(item)

    # store new scraped item to results
    dispatcher.connect(store_crawler_item, signal=signals.item_scraped)
    process = CrawlerProcess(settings=get_project_settings())
    # for platform in platforms:
    spider = get_provider_handler(get_provider(platform))
    process.crawl(spider, int(options.linkedin))
    process.start()
    # TODO: take train file index input
    file = open('./output2/train{idx}.json'.format(idx=options.page), 'w')
    # file = open('../ner/test_data/file{idx}.txt'.format(idx=0), 'a')
    results = [result["result"] for result in results]
    # for result in results:
    #     file.write(str(result)+'\n')
    json.dump(results, file)
    file.close()

if __name__ == "__main__":
    crawl_job()
