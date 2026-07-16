from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
import string
import random
import sqlite3
from urllib.parse import urlparse
app = Flask(__name__)
CORS(app)
conn = sqlite3.connect("urls.db", check_same_thread=False)
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS urls (
    code TEXT PRIMARY KEY,
    original_url TEXT NOT NULL,
    clicks INTEGER DEFAULT 0
)
""")

conn.commit()


def generate_code(length=6):
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(length))

def is_valid_url(url):
    parsed = urlparse(url)
    return all([parsed.scheme, parsed.netloc])

@app.route("/shorten", methods=["POST"])
def shorten_url():
    data = request.json
    original_url = data.get("url")

    if not original_url:
        return jsonify({"error": "URL required"}), 400

    if not is_valid_url(original_url):
        return jsonify({"error": "Please enter a valid URL"}), 400
    
    cursor.execute(
    "SELECT code FROM urls WHERE original_url = ?",
    (original_url,)
)

    existing = cursor.fetchone()

    if existing:
     return jsonify({
        "short_url": f"https://url-shortener-backend-omgk.onrender.com/{existing[0]}"
    })
    short_code = generate_code()

    cursor.execute(
        "INSERT INTO urls (code, original_url) VALUES (?, ?)",
        (short_code, original_url)
    )
    conn.commit()

    short_url = f"https://url-shortener-backend-omgk.onrender.com/{short_code}"

    return jsonify({
    "short_url": short_url,
    "clicks": 0
})
@app.route("/<code>")
def redirect_url(code):
    cursor.execute(
        "SELECT original_url FROM urls WHERE code = ?",
        (code,)
    )

    result = cursor.fetchone()

    if result:
     cursor.execute(
        "UPDATE urls SET clicks = clicks + 1 WHERE code = ?",
        (code,)
    )
    conn.commit()

    return redirect(result[0])

    return jsonify({"error": "URL not found"}), 404
@app.route("/clicks/<code>")
def get_clicks(code):
    cursor.execute(
        "SELECT clicks FROM urls WHERE code = ?",
        (code,)
    )

    result = cursor.fetchone()

    if result:
        return jsonify({"clicks": result[0]})

    return jsonify({"error": "URL not found"}), 404


if __name__ == "__main__":
   app.run(host="0.0.0.0", port=5000)