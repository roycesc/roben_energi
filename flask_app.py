from flask import Flask, render_template
from fetch_data import fetch_data, store_data
from models import Price
from extensions import db

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///prices.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

def init_db(app):
    db.init_app(app)

    with app.app_context():
        db.create_all()

init_db(app)

@app.route('/')
def landing_page():
    return render_template('index.html')

@app.route('/main')
def main_page():
    return render_template('main_page.html')

@app.route('/prices')
def get_prices():
    prices = Price.query.all()
    return render_template('prices.html', prices=prices)

if __name__ == '__main__':
    app.run()