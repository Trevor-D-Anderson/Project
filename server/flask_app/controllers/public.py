from flask_app import app
from flask import render_template, redirect, session, request, flash, jsonify, abort, make_response
from flask_app.models.users import User
from flask_bcrypt import Bcrypt
from flask_cors import cross_origin
bcrypt = Bcrypt(app)

@app.errorhandler(404)
def resource_not_found(e):
    return jsonify(error=str(e)), 404

@app.route("/")
def index():
    return "here"

# @blueprint.after_request # blueprint can also be app~~
# def after_request(response):
#     header = response.headers
#     header['Access-Control-Allow-Origin'] = '*'
#     # Other headers can be added here if required
#     return response

@app.route("/create_user", methods=["POST", "OPTIONS"])
@cross_origin()
def create_users():
    if request.method == "OPTIONS": # CORS preflight
        return _build_cors_preflight_response()
    data = request.get_json()
    print(f"New user data: {data}")
    print(data["password"])
    pw_hash = bcrypt.generate_password_hash(data['password'])
    print(pw_hash)
    data2 = {
        "firstName": data['firstName'],
        "lastName": data['lastName'],
        "email": data['email'],
        "password": pw_hash
    }
    User.create_user(data2)
    user_in_db = User.get_by_email(data2)
    return jsonify(user_in_db), 201

@app.route('/login_user', methods=['POST', "OPTIONS"])
@cross_origin()
def login_user():
    if request.method == "OPTIONS": # CORS preflight
        return _build_cors_preflight_response()
    
    # see if the email provided exists in the database
    data = request.get_json()
    print(data)
    user_in_db = User.get_by_email(data)
    # user is not registered in the db
    pw_hash = bcrypt.generate_password_hash(data['password'])
    print(pw_hash)
    if not user_in_db:
        abort(404, description="Username does not exist")
    # if not bcrypt.check_password_hash(user_in_db['password'], pw_hash):
    #     # if we get False after checking the password
    #     abort(404, description="Invalid Username/Password")

    return jsonify(user_in_db), 200

def _build_cors_preflight_response():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add('Access-Control-Allow-Headers', "*")
    response.headers.add('Access-Control-Allow-Methods', "*")
    return response