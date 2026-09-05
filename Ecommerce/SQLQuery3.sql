CREATE DATABASE ecommerce_dashboard_v2;
GO
USE ecommerce_dashboard_v2;
GO

CREATE TABLE products (
    sku VARCHAR(50) PRIMARY KEY,
    style VARCHAR(100),
    category VARCHAR(50),
    size VARCHAR(20),
    asin VARCHAR(50)
);

CREATE TABLE orders(
    order_id VARCHAR(50) PRIMARY KEY,
    order_date DATE,
    status_ VARCHAR(50),
    fulfilment VARCHAR(50),
    ship_city VARCHAR(50),
    ship_state VARCHAR(50),
    ship_postal_code VARCHAR(50),
    b2b BIT
);

CREATE TABLE order_items (
    item_id INT IDENTITY(1,1) PRIMARY KEY,
    order_id VARCHAR(50),
    sku VARCHAR(50),
    qty INT,
    amount DECIMAL(10,2),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (sku) REFERENCES products(sku)
);

SELECT o.ship_state, SUM(oi.amount) AS total_revenue
FROM orders o
inner JOIN order_items oi ON o.order_id = oi.order_id
GROUP BY o.ship_state
ORDER BY total_revenue DESC;


SELECT p.category, SUM(oi.amount) AS total_revenue
FROM products p
JOIN order_items oi ON p.sku = oi.sku
GROUP BY p.category
ORDER BY total_revenue DESC;




SELECT p.sku, p.category, SUM(oi.amount) AS total_revenue
FROM products p
JOIN order_items oi ON p.sku = oi.sku
GROUP BY p.sku, p.category
ORDER BY total_revenue DESC;



SELECT TOP 10 p.sku, p.category, SUM(oi.amount) AS total_revenue
FROM products p
JOIN order_items oi ON p.sku = oi.sku
GROUP BY p.sku, p.category
ORDER BY total_revenue DESC;



