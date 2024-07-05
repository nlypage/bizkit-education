from flask import Flask, request
from main import Summarize300Client
import os

app = Flask(__name__)

@app.route('/generate', methods=['POST'])
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
    YANDEX_OAUTH = os.environ["YANDEX_OAUTH"]
    YANDEX_COOKIE = os.environ["YANDEX_COOKIE"]

    if not YANDEX_OAUTH or not YANDEX_COOKIE:
        print("YANDEX_OAUTH or YANDEX_COOKIE environment variables not set.")
        # Handle this case as needed
    
    app.run(ssl_context=('./certs/fullchain.pem', './certs/privkey.pem'))