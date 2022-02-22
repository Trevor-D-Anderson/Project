from flask import Flask
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = "Content-Type"
app.secret_key = "My Super Project Attempt 2"