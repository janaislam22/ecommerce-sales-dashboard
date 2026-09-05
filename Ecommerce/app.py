from flask import Flask, render_template
import pyodbc

app = Flask(__name__)

def get_connection():
    conn = pyodbc.connect(
        'DRIVER={ODBC Driver 17 for SQL Server};'
        'SERVER=.;'
        'DATABASE=ecommerce_dashboard_v2;'
        'Trusted_Connection=yes;'
    )
    return conn

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/total-revenue')
def total_revenue():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT SUM(amount) FROM order_items")
    result = cursor.fetchone()
    conn.close()
    return {"total_revenue": float(result[0])}

@app.route('/api/total-orders')
def total_orders():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(DISTINCT order_id) FROM order_items")
    result = cursor.fetchone()
    conn.close()
    return {"total_orders": int(result[0])}

@app.route('/api/revenue-by-state')
def revenue_by_state():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT o.ship_state, SUM(oi.amount) AS total_revenue
        FROM orders o
        JOIN order_items oi ON o.order_id = oi.order_id
        GROUP BY o.ship_state
        ORDER BY total_revenue DESC
    """)
    results = cursor.fetchall()
    conn.close()
    return {"revenue_by_state": [{"state": row[0], "revenue": float(row[1])} for row in results]}

@app.route('/api/revenue-by-category')
def revenue_by_category():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT p.category, SUM(oi.amount) AS total_revenue
        FROM products p
        JOIN order_items oi ON p.sku = oi.sku
        GROUP BY p.category
        ORDER BY total_revenue DESC
    """)
    results = cursor.fetchall()
    conn.close()
    return {"revenue_by_category": [{"category": row[0], "revenue": float(row[1])} for row in results]}

@app.route('/api/top-products')
def top_products():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT TOP 10 p.sku, p.category, SUM(oi.amount) AS total_revenue
        FROM products p
        JOIN order_items oi ON p.sku = oi.sku
        GROUP BY p.sku, p.category
        ORDER BY total_revenue DESC
    """)
    results = cursor.fetchall()
    conn.close()
    return {"top_products": [{"sku": row[0], "category": row[1], "revenue": float(row[2])} for row in results]}

if __name__ == '__main__':
    app.run(debug=True)