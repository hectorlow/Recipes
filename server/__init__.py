# this init file allows you to import other files from the server directory

from flask import Flask
from .config import Config
from flask_mongoengine import MongoEngine

app = Flask(__name__)

# set flask app config from object
app.config.from_object(Config)

db = MongoEngine()
db.init_app(app)

# import api routes from routes.py
from server import routes
