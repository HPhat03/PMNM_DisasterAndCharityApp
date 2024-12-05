import concurrent.futures
import sys
from pathlib import Path

import requests
from tqdm import tqdm
from bs4 import BeautifulSoup

from .utils import create_dir, get_text_from_tag, init_output_dirs, read_file
from .models import CrawlArticle

FILE = Path(__file__).resolve()
ROOT = FILE.parents[1]  # root directory
if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))  # add ROOT to PATH


class Crawler:
    def __init__(self, num_workers=1, output_dpath="result", total_pages=1):
        self.num_workers = num_workers
        self.output_dpath = output_dpath
        self.total_pages = total_pages
        self.article_type_dict = {
            0: "thoi-su",
            1: "du-lich",
            2: "the-gioi",
            3: "kinh-doanh",
            4: "khoa-hoc",
            5: "giai-tri",
            6: "the-thao",
            7: "phap-luat",
            8: "giao-duc",
            9: "suc-khoe",
            10: "doi-song"
        }

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

        # some sport news have location-stamp child tag inside description tag
        description = (get_text_from_tag(p) for p in soup.find("p", class_="description").contents)
        paragraphs = (get_text_from_tag(p) for p in soup.find_all("p", class_="Normal"))

        figure_tag = soup.find("figure", class_="tplCaption")

        if figure_tag is None:
            return CrawlArticle(title, description, paragraphs, url, None)

        picture_tag = figure_tag.find("picture")

        if picture_tag is None:
            return CrawlArticle(title, description, paragraphs, url, None)

        img_tag = picture_tag.find("img")

        if img_tag is None:
            return CrawlArticle(title, description, paragraphs, url, None)

        img = img_tag["data-src"]

        return CrawlArticle(title, description, paragraphs, url, img)

    def write_content(self, url, output_fpath) -> bool:
        """
        From url, extract title, description and paragraphs then write in output_fpath
        @param url (str): url to crawl
        @param output_fpath (str): file path to save crawled result
        @return (bool): True if crawl successfully and otherwise
        """

        article = self.extract_content(url)

        if article is None:
            return False

        with open(output_fpath, "w", encoding="utf-8") as file:
            file.write(str(article))

        return True

    def get_urls_of_search_thread(self, search_query, page_number) -> list:
        """
        Fetch URLs of articles for a given search query and page number.

        @param search_query (str): The search query.
        @param page_number (int): The page number to crawl.

        @return articles_urls (list): List of article URLs from the search result page.
        """
        page_url = f"https://timkiem.vnexpress.net/?q={search_query}&media_type=text&fromdate=0&todate=0&latest=on&cate_code=&search_f=title,tag_list&date_format=all&page={page_number}"
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

    def crawl_urls(self, urls_fpath, output_dpath):
        """
        Crawling contents from a list of urls
        Returns:
            list of failed urls
        """
        print(f"Start crawling urls from {urls_fpath} file...")
        create_dir(output_dpath)
        urls = list(read_file(urls_fpath))
        num_urls = len(urls)
        # number of digits in an integer
        self.index_len = len(str(num_urls))

        args = ([output_dpath]*num_urls, urls, range(num_urls))
        with concurrent.futures.ThreadPoolExecutor(max_workers=self.num_workers) as executor:
            results = list(tqdm(executor.map(self.crawl_url_thread, *args), total=num_urls, desc="URLs"))

        print(f"Saving crawling result into {output_dpath} directory...")
        return [result for result in results if result is not None]

    def crawl_url_thread(self, output_dpath, url, index):
        """ Crawling content of the specific url """
        file_index = str(index + 1).zfill(self.index_len)
        output_fpath = "".join([output_dpath, "/url_", file_index, ".txt"])
        is_success = self.write_content(url, output_fpath)

        if not is_success:
            print(f"Crawling unsuccessfully: {url}")
            return url

    def crawl_search(self, search_query):
        """
        Crawls pages of search results for a given query, extracting article URLs from each page.
        """
        urls_dpath, results_dpath = init_output_dirs(self.output_dpath)

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
        results_type_dpath = "/".join([results_dpath, search_query])
        error_urls = self.crawl_urls(articles_urls_fpath, results_type_dpath)

        return error_urls

    def get_urls_of_search(self, search_query):
        articles_urls: list
        args = ([search_query]*self.total_pages, range(1, self.total_pages+1))
        with concurrent.futures.ThreadPoolExecutor(max_workers=self.num_workers) as executor:
            results = list(tqdm(executor.map(self.get_urls_of_search_thread, *args), total=self.total_pages, desc="Pages"))

        articles_urls = sum(results, [])
        articles_urls = list(set(articles_urls))

        return articles_urls
