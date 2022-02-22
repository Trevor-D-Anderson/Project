from flask_app.config.mysqlconnection import connectToMySQL
from flask_app.models.users import User
from flask import flash

my_db = "freight_calculator_schema"

class Profile:

    @classmethod
    def create_profile(cls, data):
        query = "insert into freightProfiles (profileName, length, width, height, weight, numberOfPcs, dimensionType, weightType, users_id) values(%(profileName)s, %(length)s, %(width)s, %(height)s, %(weight)s, %(numberOfPcs)s, %(dimensionType)s, %(weightType)s, %(user_id)s)"
        return connectToMySQL(my_db).query_db(query, data)

    @classmethod
    def update_profile(cls, data):
        query = "update freightProfiles set profileName = %(profileName)s, length = %(length)s, width = %(width)s, height = %(height)s, weight = %(weight)s, numberOfPcs = %(numberOfPcs)s, dimensionType = %(dimensionType)s, weightType = %(weightType)s where id = %(id)s"
        return connectToMySQL(my_db).query_db(query, data)

    @classmethod
    def get_profiles(cls, data):
        query = "select * from freightprofiles where users_id = %(id)s"
        results = connectToMySQL(my_db).query_db(query,data)
        print(results)
        return results

    @classmethod
    def delete(cls, data):
        query = "delete from freightprofiles where id = %(id)s"
        results = connectToMySQL(my_db).query_db(query, data)
        return results, 200