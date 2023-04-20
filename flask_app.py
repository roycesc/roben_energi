from flask import Flask, render_template
from models import Price
from extensions import db
from flask import Flask, render_template, request
from flask import jsonify, Response, make_response
from typing import Union, Tuple

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///nordpool_prices.db'
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

@app.route('/settings')
def settings():
    return render_template('settings.html')

@app.route('/prices', methods=['GET', 'POST'])
def get_prices() -> Union[Response, Tuple[Response, int]]:
    if request.method == 'POST':
        if request.json:
            selected_region = request.json.get('selectedRegion', None)
        else:
            selected_region = None

        if selected_region:
            # Store the selected region in the session or database as needed
            # (you'll need to implement this part based on your requirements)

            return jsonify(success=True)

        return jsonify(success=False), 400

    elif request.method == 'GET':
        selected_region = request.args.get('selectedRegion', None)

        if selected_region:
            prices = Price.query.filter_by(region=selected_region).all()
        else:
            prices = Price.query.all()

        rendered_template = render_template('prices.html', prices=prices)
        return make_response(rendered_template)

    else:
        return make_response("Invalid request method", 405)  # Add this line


@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'Price': Price}

if __name__ == '__main__':
    app.run(
        debug=True,
        port=8080)
