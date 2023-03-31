from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
def landing_page():
    return render_template('index.html')

@app.route('/main')
def main_page():
    return render_template('main_page.html')

if __name__ == '__main__':
    app.run()
