from collections import defaultdict
from mongoengine.fields import StringField
from server import db
from werkzeug.security import check_password_hash, generate_password_hash
import time

class Ingredient(db.EmbeddedDocument):
  id = db.IntField()
  name = db.StringField( max_length=36 )
  quantity = db.IntField()
  unit = db.StringField( max_length=20 )

class Recipe(db.Document):
  recipe_id = db.StringField( max_length=36, unique=True )
  name = db.StringField( max_length=50 )
  time_taken = db.StringField( max_length=50 )
  ingredients = db.EmbeddedDocumentListField( Ingredient, default=list )
  serving_size = db.IntField()
  instructions = db.ListField( StringField(), default=list )
  user_id = db.StringField( max_length=36 )
  image = db.StringField()

class User(db.Document):
  user_id = db.StringField( max_length=36, unique=True )
  username = db.StringField( max_length=50, unique=True )
  email = db.StringField( max_length=50 )
  password = db.StringField( max_length=255 )

  def verify_password(self, password):
    return check_password_hash(self.password, password)

  def set_password(self, password):
    self.password = generate_password_hash(password)


class Favourite(db.Document):
  user_id = db.StringField( max_length=36 )
  recipe_id = db.StringField( max_length=36 )