from app import application
import os

if __name__ == "__main__":
    # application.config["YANDEX_COOKIE"] = os.environ["YANDEX_COOKIE"]
    # application.config["YANDEX_OAUTH"] = os.environ["YANDEX_OAUTH"]

    application.run(ssl_context=('./certs/fullchain.pem', './certs/privkey.pem'))
