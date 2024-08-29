import argparse
from enum import Enum, unique
# from scrapes import IndeedSpider, LinkedInSpider
from scrapes.spiders import LinkedInSpider


@unique
class Provider(Enum):
    LINKEDIN = "linkedin"
    INDEED = "indeed"


def get_provider_handler(provider):
    """Get spider based on provider enum"""
    mapper = {
        # Provider.INDEED: IndeedSpider,
        Provider.LINKEDIN: LinkedInSpider,
    }
    return mapper[provider]


def get_provider(provider):
    """Return enum values of provider string"""
    print("provider ", provider)
    provider = provider.strip().lower()
    for member in Provider:
        if member.value == provider:
            return member


def get_arg_parser():
    parser = argparse.ArgumentParser(
        description="Find application job postings based on keywords.",
    )
    parser.add_argument(
        "-p", "--provider", default=Provider.LINKEDIN.value, help="Job Posting Sites"
    )
    parser.add_argument(
        "-lp", "--linkedin", default = 1
    )
    parser.add_argument(
        "--page", default=0
    )
    return parser
