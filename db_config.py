from extensions import db

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///prices.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

def init_db(app):
    db.init_app(app)

    with app.app_context():
         db.create_all()
