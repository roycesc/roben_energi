import requests
import datetime
from app import db
from models import Price

# Replace this function with the actual data extraction logic
def fetch_data():
    # Fetch the data from the API or source
    # Then parse the data and return it as a list of dictionaries
    return [
        {'region': 'SYS', 'hour': 0, 'price': 4.65},
        {'region': 'SYS', 'hour': 1, 'price': 4.75},
        # ... Add more data points
    ]

def store_data(data):
    for entry in data:
        price_entry = Price(region=entry['region'], hour=entry['hour'], price=entry['price'])
        db.session.add(price_entry)
    db.session.commit()

if __name__ == '__main__':
    data = fetch_data()
    store_data(data)
