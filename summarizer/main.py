import time
import requests
import logging


logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.DEBUG
)

class MessageBuffer:
    MAX_LIMIT = 8192 # Telegram one message character limit

    def __init__(self) -> None:
        self.messages = []
        self.current = None

    def __iter__(self):
        self.index = 0
        return self

    def __next__(self):
        if self.index <= self.current:
            result = self.messages[self.index]
            self.index += 1
            return result
        else:
            raise StopIteration

    def add(self, message: str) -> None:
        if self.current is None:
            self.messages.append("")
            self.current = 0
        elif len(self.messages[self.current]) + len(message) > MessageBuffer.MAX_LIMIT:
            self.messages.append("")
            self.current += 1

        self.messages[self.current] += message

class Summarize300Client:
    ENDPOINT = 'https://300.ya.ru/api/generation'
    MAX_RETRIES = 100

    def __init__(self, yandex_oauth_token, yandex_cookie) -> None:
        self.headers = {'Authorization': f'OAuth {yandex_oauth_token}]',
                    'Cookie' : yandex_cookie,
                    "Content-Type": "application/json",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5845.967 YaBrowser/23.9.1.967 Yowser/2.5 Safari/537.36",
                    "Referer": f'https://300.ya.ru/summary',
                    "Origin": f'https://300.ya.ru',
                    "pragma": "no-cache",
                    "cache-control": "no-cache",
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Accept-Language":"en,ru;q=0.9,tr;q=0.8",
                    "Cache-Control": "no-cache",
                    "Content-Length": "59",
                    "Content-Type": "application/json" }
        self.buffer = MessageBuffer()

    def __send_request(self, json):
        response = requests.post(
            Summarize300Client.ENDPOINT,
            json = json,
            headers = self.headers
        )

        print(response.status_code)

        return response

    def __parse_article_summarization_json(self, url, data) -> None:
        if not "thesis" in data:
            logging.error("{url}: there's no 'thesis' in response body")
            raise Exception
        self.buffer.add(f"{data['title']}\n\n")
        for keypoint in data['thesis']:
            self.buffer.add(f"\t• {keypoint['content']}")
            if "link" in keypoint:
                self.buffer.add(f"<a href=\"{keypoint['link']}\">Link</a>")
            self.buffer.add("\n")
        self.buffer.add("\n")

    def __parse_video_summarization_json(self, url, data) -> None:
        if 'error_code' in data:
            msg = f"{url} is not supported, Yandex API returned error_code {data['error_code']}"
            logging.error(msg)
            self.buffer.add(msg)
            return
        if not "keypoints" in data:
            logging.error(f"{url}: there's no 'keypoints' in response")
            raise Exception
        self.buffer.add(f"{data['title']}\n")
        for keypoint in data['keypoints']:
            self.buffer.add(f'<a href="{url}&t={keypoint['start_time']}">{int(int(keypoint['start_time'])/60/60 % 60):02}:{int(int(keypoint['start_time'])/60 % 60):02}:{int(int(keypoint['start_time']) % 60):02}</a> {keypoint['content']}\n')
            for thesis in keypoint['theses']:
                self.buffer.add(f"\t• {thesis['content']}\n")
            self.buffer.add("\n")
    
    def __parse_text_summarization_json(self, url, data) -> None:
        if not "thesis" in data:
            logging.error("{url}: there's no 'thesis' in response body")
            raise Exception
        self.buffer.add(f"{data['title']}\n\n")
        for keypoint in data['thesis']:
            self.buffer.add(f"\t• {keypoint['content']}")
        self.buffer.add("\n")

    def summarize_url(self, url) -> None:
        json_payload = {}
        if "youtu" in url:
            json_payload['video_url'] = url
            parse_selector = self.__parse_video_summarization_json
        else:
            json_payload['article_url'] = url
            parse_selector = self.__parse_article_summarization_json

        if len(url) > 300:
            json_payload['text'] = url
            parse_selector = self.__parse_text_summarization_json


        counter = 0
        status_code = None
        while(( status_code != 0 and status_code != 2) and counter < Summarize300Client.MAX_RETRIES):
            counter += 1
            print(counter)
            response = self.__send_request(json=json_payload)
            response_json = response.json()
            logging.debug(response_json)

            if 'status_code' not in response_json:
                logging.error(f"{url} backend error: {response_json}")
                self.buffer.add("Yandex API is not available, try again later")
                return self.buffer
            status_code = response_json['status_code']

            if status_code >= 3:
                logging.error(f"{url} returned status_code > 2")
                self.buffer.add(f"Yandex API returned status_code {status_code} when processing {url}, the link is not supported by Yandex backend")
                return self.buffer
            
            if 'poll_interval_ms' in response_json:
                poll_interval_ms = response_json['poll_interval_ms']
                time.sleep(poll_interval_ms/1000)

            if 'session_id' not in json_payload:
                session_id = response_json['session_id']
                json_payload['session_id'] = session_id

        parse_selector(url, response_json)

        return self.buffer
