from flask import Flask, request, jsonify, send_file, send_from_directory
import sqlite3

app = Flask(__name__)

def init_db():
    conn = sqlite3.connect('library.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS borrows (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            book TEXT,
            due_date TEXT
        )
    ''')
    conn.commit()
    conn.close()

@app.after_request
def add_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response

@app.route('/')
def home():
    return send_file('index.html')

@app.route('/style.css')
def style():
    return send_file('style.css')

@app.route('/script.js')
def script():
    return send_file('script.js')

@app.route('/images/<path:filename>')
def images(filename):
    return send_from_directory('images', filename)

@app.route('/pdf/<path:filename>')
def pdf(filename):
    return send_from_directory('pdf', filename)

@app.route('/borrow', methods=['POST', 'OPTIONS'])
def borrow():
    if request.method == 'OPTIONS':
        return jsonify({"message": "OK"})

    data = request.json

    conn = sqlite3.connect('library.db')
    c = conn.cursor()

    # Check if the same email already borrowed the same book
    c.execute(
        "SELECT * FROM borrows WHERE email = ? AND book = ?",
        (data['email'], data['book'])
    )
    existing = c.fetchone()

    if existing:
        conn.close()
        return jsonify({
            "message": "You have already borrowed this book."
        }), 400

    c.execute(
        "INSERT INTO borrows (name, email, book, due_date) VALUES (?, ?, ?, ?)",
        (data['name'], data['email'], data['book'], data['due_date'])
    )

    conn.commit()
    conn.close()

    return jsonify({"message": "Borrowing request saved successfully!"})

@app.route('/history', methods=['GET'])
def history():
    conn = sqlite3.connect('library.db')
    c = conn.cursor()
    c.execute("SELECT name, email, book, due_date FROM borrows")
    rows = c.fetchall()
    conn.close()

    return jsonify(rows)

if __name__ == '__main__':
    init_db()
    app.run(host="0.0.0.0", port=5000, debug=True)
