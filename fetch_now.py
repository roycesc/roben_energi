from fetch_data import fetch_data, store_data
from flask_app import app
from extensions import db
from models import Price
import requests
import json
import re
import datetime
import pandas as pd



def fetch_data():
    url = "https://www.nordpoolgroup.com/api/marketdata/page/10"
    response = requests.get(url)
    data = json.loads(response.text)

    if 'data' not in data or 'Rows' not in data['data']:
        print("Unexpected API response format:")
        print(json.dumps(data, indent=2))
        return []

    # Extract the date from the DataStartdate attribute
    date_str = data['data']['DataStartdate']
    date = datetime.datetime.strptime(date_str, '%Y-%m-%dT%H:%M:%S').date()

    rows = data['data']['Rows']
    prices = {}

    for row in rows:
        hour = row['Name'].replace('&nbsp;', ' ').replace(' - ', '-')
        for column in row['Columns']:
            area_name = column['Name']
            price = float(column['Value'].replace(',', '.'))

            if area_name not in prices:
                prices[area_name] = {}

            prices[area_name][hour] = price

    df = pd.DataFrame(prices)
    df.index = [i.split('-')[0] for i in df.index]

    # Convert the DataFrame to a list of dictionaries
    data_list = []
    for region, hours in df.to_dict().items():
        for hour, price in hours.items():
            if not hour.isdigit():  # Skip non-numeric hours (min, max, average, etc.)
                continue

            data_list.append({
                'date': date,
                'region': region,
                'hour': int(hour),
                'price': price
            })

    return data_list


db.init_app(app)

def print_all_prices():
    prices = Price.query.all()
    for price in prices:
        print(price)

with app.app_context():
    db.create_all()
    data = fetch_data()
    print(f"Fetched data: {data}")
    if data:
        store_data(data)
        print("Data stored in the database.")
        print("Current records in the Price table:")  # Add this line
        print_all_prices()  # Add this line
    else:
        print("No data fetched.")
