from server import db
from werkzeug.security import check_password_hash, generate_password_hash

class Recipe(db.Document):
  recipe_id = db.IntField( unique=True )

class User(db.Document):
  user_id = db.StringField( max_length=36, unique=True )
  username = db.StringField( max_length=50, unique=True )
  email = db.StringField( max_length=50)
  password = db.StringField( max_length=255 )

  def verify_password(self, password):
    return check_password_hash(self.password, password)

  def set_password(self, password):
    self.password = generate_password_hash(password)


class Favourite(db.Document):
  favourite_id = db.IntField( unique=True )