from flask import Flask, jsonify, request, render_template
import sys
import requests


app = Flask(__name__)


###########
### APP ###
###########
@app.route('/')
def index():
    return "hi this is the index"


@app.route("/map")
def map():
    city = request.args.get('city')

    if city == "dc":
        return render_template('dc_test.html')
    elif city == "nyc":
        return render_template('nyc_test.html')
    elif city == "reactnyc":
        return render_template('index-nyc.html')
    elif city == "leaflet":
        return render_template('leaflet.html')

    return "specify a city"


if __name__ == "__main__":
    #app.run(debug=True) # for dev
    app.run() # for prod