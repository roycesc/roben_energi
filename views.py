from flask import render_template
from flask_app import app
from models import Price

@app.route('/prices')
def show_prices():
    prices = Price.query.all()
    return render_template('prices.html', prices=prices)
