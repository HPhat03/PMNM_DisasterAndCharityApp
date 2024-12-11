import concurrent.futures
import sys
import urllib
from datetime import date
from pathlib import Path

import requests
from tqdm import tqdm
from bs4 import BeautifulSoup

from .utils import extract_location_status, get_text_from_tag, init_output_dirs, read_file
from .models import CrawlArticle
from ..models import Article, Location

FILE = Path(__file__).resolve()
ROOT = FILE.parents[1]  # root directory
if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))  # add ROOT to PATH


class Crawler:
    def __init__(self, num_workers=1, output_dpath="result", total_pages=1, init=False):
        self.num_workers = num_workers
        self.output_dpath = output_dpath
        self.total_pages = total_pages
        self.isInit = init

    def extract_content(self, url) -> CrawlArticle | None:
        """
        Extract title, description and paragraphs from url
        @param url (str): url to crawl
        @return title (str)
        @return description (generator)
        @return paragraphs (generator)
        """
        try:
            content = requests.get(url).content
        except Exception:
            return None
        soup = BeautifulSoup(content, "html.parser")

        title = soup.find("h1", class_="title-detail") 
        if title is None:
            return None
        title = title.text

        # Thứ bảy, 7/12/2024, 17:00 (GMT+7)
        article_date = soup.find('span', class_="date").text.split(", ")[1].split("/")
        article_date = list(map(int, article_date))
        article_date.reverse() # [2024, 12, 7]
        article_date = date(*article_date)

        # some sport news have location-stamp child tag inside description tag
        description = (get_text_from_tag(p) for p in soup.find("p", class_="description").contents)
        paragraphs = (get_text_from_tag(p) for p in soup.find_all("p", class_="Normal"))

        figure_tag = soup.find("figure", class_="tplCaption")
        if figure_tag is not None:

            picture_tag = figure_tag.find("picture")
            if picture_tag is not None:

                img_tag = picture_tag.find("img")
                if img_tag is not None:
                    img = img_tag["data-src"]
                    return CrawlArticle(title, description, paragraphs, url, img, article_date)

        return CrawlArticle(title, description, paragraphs, url, None, article_date)

    def write_content(self, article) -> bool:
        """
        From url, extract title, description and paragraphs then write in output_fpath
        @param url (str): url to crawl
        @param output_fpath (str): file path to save crawled result
        @return (bool): True if crawl successfully and otherwise
        """

        if article is None:
            return False


        a = Article(
            title=article.title,
            brief="\n".join(list(article.description)),
            content="\n".join(list(article.paragraphs)),
            real_path=article.src,
            img_url=article.img,
            created_date=article.date,
            updated_date=article.date,
        )
        a.save()

        location_status = extract_location_status("\n".join(list(article.paragraphs)))

        for location in location_status:
            Location.objects.create(
                location=location["city"],
                current_status=location["status"]
            )

        return True

    def get_urls_of_search_thread(self, search_query, page_number) -> list:
        """
        Fetch URLs of articles for a given search query and page number.

        @param search_query (str): The search query.
        @param page_number (int): The page number to crawl.

        @return articles_urls (list): List of article URLs from the search result page.
        """
        host = "https://timkiem.vnexpress.net"
        common_query = {
            "media_type": "text",
            "q": search_query,
            "cate_code": "thoi-su",
        }
        if self.isInit:
            query = {
                **common_query,
                "fromdate": 0,
                "todate": 0,
                "latest": "on",
                "search_f": "title,tag_list",
                "date_format": "all",
                "page": page_number
            }
        else:
            query = {
                **common_query,
                "search_f": "",
                "date_format": "day"
            }

        page_url = f"{host}/?{urllib.parse.urlencode(query)}"
        content = requests.get(page_url).content
        soup = BeautifulSoup(content, "html.parser")
        titles = soup.find_all(class_="title-news")

        if len(titles) == 0:
            print(f"Couldn't find any news in {page_url} \nMaybe you sent too many requests, try using less workers")

        articles_urls = list()

        for title in titles:
            link = title.find_all("a")[0]
            articles_urls.append(link.get("href"))

        return articles_urls

    def start_crawling(self, search_query):
        error_urls = self.crawl_search(search_query)
        print(f"The number of failed URL: {len(error_urls)}")

    def crawl_search(self, search_query):
        """
        Crawls pages of search results for a given query, extracting article URLs from each page.
        """
        urls_dpath = init_output_dirs(self.output_dpath)

        print(f"Crawl search results for query '{search_query}'...")
        error_urls: list

        # getting url
        print(f"Getting urls of query '{search_query}'...")
        articles_urls = self.get_urls_of_search(search_query)
        articles_urls_fpath = "/".join([urls_dpath, f"{search_query}.txt"])
        with open(articles_urls_fpath, "w") as urls_file:
            urls_file.write("\n".join(articles_urls))

        # crawling url
        print(f"Crawling from urls of query '{search_query}'...")
        error_urls = self.crawl_urls(articles_urls_fpath)

        return error_urls

    def crawl_urls(self, urls_fpath):
        """
        Crawling contents from a list of urls
        Returns:
            list of failed urls
        """
        print(f"Start crawling urls from {urls_fpath} file...")
        urls = list(read_file(urls_fpath))
        num_urls = len(urls)

        args = (urls, range(num_urls))
        with concurrent.futures.ThreadPoolExecutor(max_workers=self.num_workers) as executor:
            results = list(tqdm(executor.map(self.crawl_url_thread, *args), total=num_urls, desc="URLs"))

        return [result for result in results if result is not None]

    def crawl_url_thread(self, url, index):
        """ Crawling content of the specific url """
        article = self.extract_content(url)
        is_success = self.write_content(article)

        if not is_success:
            print(f"Crawling unsuccessfully: {url}")
            return url

    def get_urls_of_search(self, search_query):
        articles_urls: list
        args = ([search_query]*self.total_pages, range(1, self.total_pages+1))
        with concurrent.futures.ThreadPoolExecutor(max_workers=self.num_workers) as executor:
            results = list(tqdm(executor.map(self.get_urls_of_search_thread, *args), total=self.total_pages, desc="Pages"))

        articles_urls = sum(results, [])
        articles_urls = list(set(articles_urls))

        return articles_urls
