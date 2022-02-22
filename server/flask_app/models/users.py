from flask_app.config.mysqlconnection import connectToMySQL
from flask import flash
from flask_bcrypt import Bcrypt
import re	# the regex module
# create a regular expression object that we'll use later   
PASSWORD_REGEX = re.compile(r'^(?=.*\d)(?=.*[A-Z]).{2,16}$') 
EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$') 

my_db = "freight_calculator_schema"

class User:
    # def __init__(self, data):
    #     self.id = data['id']
    #     self.first_name = data['firstName']
    #     self.last_name = data['lastName']
    #     self.email = data['email']
    #     self.password = data['password']
    #     self.created_at = data['created_at']
    #     self.updated_at = data['updated_at']

    @classmethod
    def create_user(cls, data):
        query = "INSERT INTO users (firstName, lastName, email, password) VALUES(%(firstName)s, %(lastName)s, %(email)s, %(password)s)"
        return connectToMySQL(my_db).query_db(query,data)

    @classmethod
    def get_all(cls):
        query = "SELECT * FROM users;"
        results = connectToMySQL(my_db).query_db(query)
        return results

    @classmethod
    def delete_user(cls, id):
        query = "DELETE FROM users WHERE id=%(id)s"
        return connectToMySQL(my_db).query_db(query,id)
    
    @classmethod
    def show_user(cls, id):
        query = "SELECT * FROM users WHERE id=%(id)s"
        return connectToMySQL(my_db).query_db(query,id)

    @classmethod
    def edit_user(cls, data):
        query = "UPDATE users SET first_name = %(first_name)s, last_name = %(last_name)s, email = %(email)s where id =%(id)s"
        return connectToMySQL(my_db).query_db(query,data)

    @classmethod
    def get_by_email(cls,data):
        query = "SELECT * FROM users WHERE email = %(email)s;"
        result = connectToMySQL(my_db).query_db(query,data)
        if len(result) < 1:
            return False
        return result[0]

    @staticmethod
    def validate_user(user):
        is_valid = True
        if len(user['firstName']) <3:
            flash("First name must be at least 3 characters")
            is_valid = False
        if len(user['lastName']) <3:
            flash("Last name must be at least 3 characters")
            is_valid = False
        if len(user['password']) <8:
            flash("Password must be at least 8 characters")
            is_valid = False
        if not EMAIL_REGEX.match(user['email']): 
            flash("Invalid email address!")
            is_valid = False
        return is_valid
