# E-Commerce Sales Analytics Dashboard

An end-to-end data analytics project that turns raw Amazon sales data into a live, interactive business dashboard — from cleaning and database design to a working Flask API and frontend.

**Author:** Jana Islam ([@janaislam22](https://github.com/janaislam22))

## Overview

This project takes a real Amazon Sale Report dataset (India, March–June 2022) and builds a complete data pipeline:

```
Raw CSV → Python/Pandas cleaning → SQL Server database → SQL analysis → Flask API → Interactive dashboard
```

## Features

- **Data cleaning**: handled missing values, inconsistent state names, duplicate detection, and date parsing on a 128,000+ row dataset
- **Relational database design**: normalized schema with 3 tables (`products`, `orders`, `order_items`) linked by foreign keys
- **SQL analysis**: revenue breakdowns by state and category, top-selling products, using JOINs and aggregations
- **REST API**: Flask endpoints serving live query results as JSON
- **Interactive dashboard**: KPI cards, bar and doughnut charts (Chart.js), a searchable product table, and a light/dark theme toggle

## Tech Stack

- **Data processing**: Python, Pandas
- **Database**: Microsoft SQL Server
- **Backend**: Flask, pyodbc
- **Frontend**: HTML, CSS, JavaScript, Chart.js

## Dashboard KPIs & Analytics

- Total Revenue
- Total Orders
- Average Order Value
- Revenue by State
- Revenue by Category
- Top 10 Products

## Database Schema

**products**
| Column | Type |
|---|---|
| sku (PK) | VARCHAR |
| style | VARCHAR |
| category | VARCHAR |
| size | VARCHAR |
| asin | VARCHAR |

**orders**
| Column | Type |
|---|---|
| order_id (PK) | VARCHAR |
| order_date | DATE |
| status_ | VARCHAR |
| fulfilment | VARCHAR |
| ship_city | VARCHAR |
| ship_state | VARCHAR |
| ship_postal_code | VARCHAR |
| b2b | BIT |

**order_items**
| Column | Type |
|---|---|
| item_id (PK) | INT, auto-increment |
| order_id (FK) | VARCHAR → orders.order_id |
| sku (FK) | VARCHAR → products.sku |
| qty | INT |
| amount | DECIMAL |

## Folder Structure

```
Ecommerce/
├── app.py                  # Flask app + API endpoints
├── cleaned_amazon_sales.csv # Cleaned dataset
├── templates/
│   └── index.html          # Dashboard page
└── static/
    ├── style.css            # Dashboard styling (light/dark themes)
    └── script.js            # Fetches API data, renders charts
```

## Key Business Insights

- Two product categories (Set and Kurta) account for over 75% of total revenue
- Maharashtra, Karnataka, and Telangana are the top three states by revenue
- Average order value is approximately ₹695
- About 9% of orders were cancelled

## Running Locally

1. Install dependencies:
   ```
   pip install flask pyodbc pandas
   ```
2. Set up a SQL Server database named `ecommerce_dashboard_v2` with the schema above
3. Run the app:
   ```
   python app.py
   ```
4. Open `http://127.0.0.1:5000` in your browser

## Future Improvements

- Add date-range filtering to the dashboard
- Add an admin login and product management (CRUD)
- Deploy the app online with a cloud-hosted database

Dataset
The dataset used in this project was obtained from Kaggle.
Due to its size, the dataset is provided as a compressed ZIP file. Extract ecommerce_data.zip before running the data cleaning and analysis scripts.
Source: Kaggle 
