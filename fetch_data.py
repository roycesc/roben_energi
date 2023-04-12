import requests
import json
import re
import datetime
from models import Price
from extensions import db

def fetch_data():
    url = "https://www.nordpoolgroup.com/api/marketdata/page/10"
    response = requests.get(url)
    data = json.loads(response.text)

    if 'data' not in data or 'PageTitle' not in data['data']:
        print("Unexpected API response format:")
        print(json.dumps(data, indent=2))
        return []

    # Extract the date from the page title
    page_title = data['data']['PageTitle']
    date_match = re.search(r'\d{2}\.\d{2}\.\d{4}', page_title)
    if date_match:
        date_str = date_match.group(0)
        date = datetime.datetime.strptime(date_str, '%d.%m.%Y').date()
    else:
        raise ValueError("Could not extract date from API response")

    rows = data['data']['Rows']
    prices = []

    for row in rows:
        hour = row['Name'].replace('&nbsp;', ' ').replace(' - ', '-')
        for column in row['Columns']:
            area_name = column['Name']
            price = float(column['Value'].replace(',', '.'))

            prices.append({
                'date': date,
                'region': area_name,
                'hour': hour,
                'price': price
            })

    return prices


def store_data(data):
    for entry in data:
        price_entry = Price(date=entry['date'], region=entry['region'], hour=entry['hour'], price=entry['price'])
        db.session.add(price_entry)
    db.session.commit()

if __name__ == '__main__':
    data = fetch_data()
    store_data(data)
