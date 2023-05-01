import os
from flask import Flask, render_template, request, session, jsonify
from fetch_data import fetch_data, store_data
from models import Price
from extensions import db
from collections import defaultdict
from dotenv import load_dotenv
from flask_session import Session
from datetime import datetime, time, timedelta
from sqlalchemy import and_, or_

load_dotenv('.env')

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///prices.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SESSION_FILE_DIR'] = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'flask_session')
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', "47b379fca119a5610d4c3fbac5967f29")
app.config['SESSION_TYPE'] = 'filesystem'

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

@app.route('/settings', methods=['GET', 'POST'])
def settings():
    if request.method == 'POST':
        selected_region = request.form.get('selectedRegion')
        session['selected_region'] = selected_region
        return jsonify({'status': 'success'})
    else:
        return render_template('settings.html')

@app.route('/prices', methods=['GET', 'POST'])
def prices():
    if request.method == 'POST':
        selected_region = request.get_json().get('selectedRegion', 'SYS')
        session['selected_region'] = selected_region
    else:
        selected_region = request.args.get('selectedRegion', session.get('selected_region', 'SYS'))

    price_data = Price.query.filter(Price.region == selected_region).order_by(Price.date, Price.hour).all()
    grouped_data = defaultdict(list)

    for price in price_data:
        grouped_data[price.date].append(price)

    # Sort the grouped_data by date in descending order
    sorted_grouped_data = dict(sorted(grouped_data.items(), key=lambda x: x[0], reverse=True))

    return render_template('prices.html', grouped_data=sorted_grouped_data)

from datetime import datetime, timedelta

from datetime import datetime, timedelta

from datetime import datetime, timedelta

from datetime import datetime, timedelta

@app.route('/chart_data', methods=['GET'])
def chart_data():
    region = request.args.get('region', 'SYS')

    # Get the latest date and hour available in the database for the given region
    latest_entry = Price.query.filter(Price.region == region).order_by(Price.date.desc(), Price.hour.desc()).first()
    latest_datetime = datetime.combine(latest_entry.date, time(latest_entry.hour))

    # Calculate the start date and hour
    start_datetime = latest_datetime - timedelta(hours=47)

    # Query the data between start and end datetime
    prices = Price.query.filter(
        Price.region == region,
        and_(
            or_(
                Price.date > start_datetime.date(),
                and_(Price.date == start_datetime.date(), Price.hour >= start_datetime.hour),
            ),
            or_(
                Price.date < latest_datetime.date(),
                and_(Price.date == latest_datetime.date(), Price.hour <= latest_datetime.hour),
            ),
        )
    ).order_by(Price.date, Price.hour).all()

    price_data = [
        {
            'date': price.date.strftime('%Y-%m-%d'),
            'hour': price.hour,
            'price': price.price
        }
        for price in prices
    ]

    return jsonify(price_data)

if __name__ == '__main__':
    Session(app)
    app.run()
