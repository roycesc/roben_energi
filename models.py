from extensions import db

class Price(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    region = db.Column(db.String(80), nullable=False)
    hour = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)

    def __repr__(self):
        return f'<Price {self.region} - {self.date} - Hour {self.hour}: {self.price}>'

