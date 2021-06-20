import http
import re
from sys import meta_path
import uuid
import jwt
from datetime import datetime, timedelta
from flask import jsonify, request, make_response
from flask_cors import cross_origin
from functools import wraps

from werkzeug.wrappers import response
from server import app
from .models import Favourite, User, Recipe

login_signup_kwargs = {
  "origins": "http://localhost:3000",
  "methods": ["GET", "POST"],
}

recipe_kwargs = {
  "origins": "http://localhost:3000",
  "methods": ["GET", "POST", "PATCH", "DELETE"],
}


# decorator for verifying JWT
def token_required(wrapped_func):
  @wraps(wrapped_func)
  def decorated(*args, **kwargs):
    token = None
    if not request.cookies.get("jwt"):
      return make_response("Token expired or no token provided", 401)
    
    token = request.cookies.get("jwt")
    token_payload = jwt.decode(token, app.config["SECRET_KEY"], algorithms="HS256")
    current_user = User.objects(user_id=token_payload["user_id"]).first()
    
    if not current_user:
      return make_response("Username or password incorrect", 403)

    return wrapped_func(current_user, *args, **kwargs)
  return decorated

@app.route('/api/login', methods=["GET", "POST"])
@cross_origin(**login_signup_kwargs, supports_credentials=True)
def login():
  if request.method == "POST":
    username = request.json.get("username")
    password = request.json.get("password")
    user = User.objects(username=username).first()

    if not user:
      return make_response("No such username!", 403)
    if not user.verify_password(password):
      return make_response("Incorrect password!", 403)

    token = jwt.encode({
      "user_id": user.user_id,
      "exp": datetime.utcnow() + timedelta(minutes=30)
    }, app.config["SECRET_KEY"], algorithm="HS256")

    resp = make_response(jsonify({ "username": username }), 200)
    resp.set_cookie("jwt", value=token, max_age=60*60, httponly=True, secure=True)
    return resp
  return make_response("Something went wrong!", 500)


@app.route('/api/signup', methods=["GET", "POST"])
@cross_origin(**login_signup_kwargs)
def signup():
  if request.method == "POST":
    username = request.json.get("username")
    password = request.json.get("password")
    if not username:
      return make_response("Username is missing!", 401)
    if not password:
      return make_response("Password is missng!", 401)

    users = User.objects(username=username).all()
    if users:
      return make_response("Username already in use!", 409)
    
    # save new user
    new_user = User(
      user_id=str(uuid.uuid4()),
      username=username,
    )

    # set hashed password
    new_user.set_password(password)
    new_user.save()
  return make_response("Registered successfully!", 201)

  
@app.route('/api/recipes', methods=["GET"])
@cross_origin(**login_signup_kwargs, supports_credentials=True)
def recipes():
  # i need to return an aggregation of recipes and if the recipe is favourited
  # by the current user
  if request.cookies.get('jwt'):
    token = request.cookies.get('jwt')
    token_payload = jwt.decode(token, app.config["SECRET_KEY"], algorithms="HS256")
    current_user = User.objects(user_id=token_payload["user_id"]).first()

    if not current_user:
      return make_response("Invalid token", 403)
    
    recipes = list(Recipe.objects().aggregate(*[
      {
          '$lookup': {
              'from': 'favourite', 
              'localField': 'recipe_id', 
              'foreignField': 'recipe_id', 
              'as': 'favourite'
          }
      }, {
          '$project': {
              'recipe_id': 1, 
              'name': 1, 
              'time_taken': 1, 
              'ingredients': 1, 
              'instructions': 1,
              'author': 1,
              'favourite': {
                  '$reduce': {
                      'input': '$favourite', 
                      'initialValue': False, 
                      'in': {
                          '$or': [
                              '$$value', {
                                  '$eq': [
                                      '$$this.user_id',
                                      current_user.user_id
                                  ]
                              }
                          ]
                      }
                  }
              }
          }
      }, {
          '$project': {
              '_id': 0
          }
      }
    ]))
    return make_response(jsonify(recipes), 200)

  recipes = Recipe.objects.all()
  return make_response(jsonify(recipes), 200)


@app.route('/api/recipe', methods=["GET", "POST", "PATCH", "DELETE"])
@cross_origin(**recipe_kwargs, supports_credentials=True)
@token_required
def add_recipe(current_user):
  if request.method == "GET":
    return make_response("Get single recipe", 200)

  if request.method == "DELETE":
    recipe_id = request.json.get('recipe_id')
    recipe = Recipe.objects(recipe_id=recipe_id).first()
    recipe.delete()
    return make_response("Recipe deleted", 202)
      
  author = current_user.username
  name = request.json.get('name')
  time_taken = request.json.get('time_taken')
  ingredients = request.json.get('ingredients')
  instructions = request.json.get('instructions')

  if request.method == "POST":
    new_recipe = Recipe(
      recipe_id=str(uuid.uuid4()),
      name=name,
      time_taken=time_taken,
      ingredients=ingredients,
      instructions=instructions,
      author=author,
    )
    new_recipe.save()
    return make_response(jsonify(new_recipe), 201)
  
  # get desired recipe using passed recipe_id
  recipe_id = request.json.get('recipe_id')
  recipe = Recipe.objects(recipe_id=recipe_id).first()

  if request.method == "PATCH":
    if not recipe:
      return make_response("Recipe not found", 400)

    recipe.name = name
    recipe.time_taken = time_taken
    recipe.ingredient = ingredients
    recipe.instructions = instructions
    recipe.save()
    return make_response(f"{name} recipe updated", 204)


@app.route('/api/favourites', methods=["GET", "POST"])
@cross_origin(**login_signup_kwargs, supports_credentials=True)
@token_required
def favourite(current_user):

  # return list of favourite recipes of current user
  if request.method == "GET":
    # aggregation returns list of favourite recipes with index "fav_index"
    favourites = list( User.objects().aggregate(*[
        {
            '$lookup': {
                'from': 'favourite', 
                'localField': 'user_id', 
                'foreignField': 'user_id', 
                'as': 'fav_pair'
            }
        }, {
            '$unwind': {
                'path': '$fav_pair', 
                'preserveNullAndEmptyArrays': False
            }
        }, {
            '$lookup': {
                'from': 'recipe', 
                'localField': 'fav_pair.recipe_id', 
                'foreignField': 'recipe_id', 
                'as': 'fav_recipe'
            }
        }, {
            '$unwind': {
                'path': '$fav_recipe', 
                'preserveNullAndEmptyArrays': False
            }
        }, {
            '$match': {
                'user_id': current_user.user_id
            }
        }, {
            '$project': {
                'recipe_id': '$fav_recipe.recipe_id', 
                'name': '$fav_recipe.name', 
                'time_taken': '$fav_recipe.time_taken', 
                'ingredients': '$fav_recipe.ingredients', 
                'instructions': '$fav_recipe.instructions', 
                'author': '$fav_recipe.author', 
                # to allow React frontend to receive true value properly
                # if 'favourite': True is set manually, React doesn't receive
                # the favourite property at all 
                'favourite': {
                    '$eq': [
                        '1', '1'
                    ]
                }
            }
        }, {
            '$project': {
                '_id': 0
            }
        }
    ]))
    return make_response(jsonify(favourites), 200)

  # add or remove favourite recipe for current user
  if request.method == "POST":
    recipe_id = request.json.get('recipe_id')
    user_id = current_user.user_id
    set_as_favourite = request.json.get('favourite')

    if set_as_favourite:
      if Favourite.objects(recipe_id=recipe_id, user_id=user_id).first():
        return make_response("Favourite already exist", 400)

      Favourite(recipe_id=recipe_id, user_id=user_id).save()
      return make_response("Favourite created", 201)
    
    # remove favourite
    favourite = Favourite.objects(recipe_id=recipe_id, user_id=user_id).first()
    favourite.delete()
    return make_response("Favourite removed", 201)


@app.route('/api/logout', methods=["POST"])
@cross_origin(**login_signup_kwargs, supports_credentials=True)
@token_required
def logout(current_user):
  resp = make_response("Logout successfully", 204)
  resp.set_cookie("jwt", 'expired', max_age=0)
  return resp


# apis for testing and development purposes
@app.route('/cookie', methods=["GET"])
@cross_origin(**login_signup_kwargs)
def cookie():
  resp = make_response("Setting cookie", 200)
  resp.set_cookie("server", value="server set cookie", max_age=60, domain=".app.localhost")
  return resp


@app.route('/api/username-change', methods=["POST"])
@cross_origin(**login_signup_kwargs, supports_credentials=True)
@token_required
def change_username(current_user):
  new_username = request.json.get('username')
  check_existing_user = User.objects(username=new_username).first()
  if check_existing_user:
    return make_response("Username already taken. Try a different one!", 409)

  current_user.username = new_username
  current_user.save()
  return make_response("Username changed", 201)


@app.route('/api/password-change', methods=["POST"])
@cross_origin(**login_signup_kwargs, supports_credentials=True)
@token_required
def change_password(current_user):
  old_password = request.json.get('old_password')
  new_password = request.json.get('new_password')
  if not current_user.verify_password(old_password):
    return make_response("Incorrect password", 403)

  current_user.set_password(new_password)
  current_user.save()
  return make_response("Password changed", 201)