from flask import Flask, request
from flask_cors import CORS, cross_origin
from main import Summarize300Client
import os

application = Flask(__name__)
cors = CORS(application)
application.config['CORS_HEADERS'] = 'Content-Type'

YANDEX_OAUTH = os.environ["YANDEX_OAUTH"]
YANDEX_COOKIE = os.environ["YANDEX_COOKIE"]

@application.route('/summarize/generate', methods=['POST'])
@cross_origin()
def generate():
    data = request.json
    url = data.get('content')

    if len(url) <= 300:
        url = url.split()

    else:
        url = [url]

    for match in url[:1]:
        print(f"Processing URL: {match}")
        summarizer = Summarize300Client(yandex_oauth_token=YANDEX_OAUTH, yandex_cookie=YANDEX_COOKIE)
        try:
            buffer = summarizer.summarize_url(match)
        except Exception as e:
            print(f"500 Internal server error: {e}")
            return {'error': f"500 Internal server error: {e}"}, 500

        for message in buffer.messages:
            print(f"Will be sending to len {len(message)}: {message}")

    return {
        'status': True,
        'content': buffer.messages[0]

    }

if __name__ == '__main__':
    if not YANDEX_OAUTH or not YANDEX_COOKIE:
        print("YANDEX_OAUTH or YANDEX_COOKIE environment variables not set.")
        # Handle this case as needed

    application.run(ssl_context=('./certs/fullchain.pem', './certs/privkey.pem'))
