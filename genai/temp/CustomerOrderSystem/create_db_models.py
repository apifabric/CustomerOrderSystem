# using resolved_model gpt-4o-2024-08-06# created from response, to create create_db_models.sqlite, with test data
#    that is used to create project
# should run without error in manager 
#    if not, check for decimal, indent, or import issues

import decimal
import logging
import sqlalchemy
from sqlalchemy.sql import func 
from logic_bank.logic_bank import Rule
from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey, Date, DateTime, Numeric, Boolean, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import relationship
from datetime import date   
from datetime import datetime

logging.getLogger('sqlalchemy.engine.Engine').disabled = True  # remove for additional logging

Base = declarative_base()  # from system/genai/create_db_models_inserts/create_db_models_prefix.py


class Customer(Base):
    __tablename__ = 'customer'

    description = 'This table contains customer information.'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)
    balance = Column(Integer, default=0)
    credit_limit = Column(Integer)


class Order(Base):
    __tablename__ = 'order'

    description = 'This table contains order information.'

    id = Column(Integer, primary_key=True, autoincrement=True)
    customer_id = Column(Integer, ForeignKey('customer.id'))
    date_shipped = Column(Date, nullable=True)
    notes = Column(String, nullable=True)
    amount_total = Column(Integer, default=0)


class Item(Base):
    __tablename__ = 'item'

    description = 'This table contains individual order items.'

    id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(Integer, ForeignKey('order.id'))
    product_id = Column(Integer, ForeignKey('product.id'))
    quantity = Column(Integer)
    amount = Column(Integer, default=0)
    unit_price = Column(Integer)


class Product(Base):
    __tablename__ = 'product'

    description = 'This table contains product information.'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)
    unit_price = Column(Integer)


# ALS/GenAI: Create an SQLite database
engine = create_engine('sqlite:///system/genai/temp/create_db_models.sqlite')
Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
session = Session()

# ALS/GenAI: Prepare for sample data

from datetime import date

customer1 = Customer(id=1, name='Alice', balance=150, credit_limit=200)
customer2 = Customer(id=2, name='Bob', balance=250, credit_limit=300)
customer3 = Customer(id=3, name='Charlie', balance=100, credit_limit=150)
customer4 = Customer(id=4, name='Diana', balance=350, credit_limit=400)

order1 = Order(id=1, customer_id=1, date_shipped=None, notes='Urgent delivery', amount_total=150)
order2 = Order(id=2, customer_id=2, date_shipped=date(2023, 1, 10), notes='Gift order', amount_total=250)
order3 = Order(id=3, customer_id=3, date_shipped=None, notes='Office supplies', amount_total=100)
order4 = Order(id=4, customer_id=4, date_shipped=date(2023, 2, 20), notes='Monthly subscription', amount_total=350)

product1 = Product(id=1, name='Laptop', unit_price=1000)
product2 = Product(id=2, name='Phone', unit_price=500)
product3 = Product(id=3, name='Headphones', unit_price=150)
product4 = Product(id=4, name='Monitor', unit_price=300)

item1 = Item(id=1, order_id=1, product_id=1, quantity=1, amount=1000, unit_price=1000)
item2 = Item(id=2, order_id=2, product_id=2, quantity=2, amount=1000, unit_price=500)
item3 = Item(id=3, order_id=3, product_id=3, quantity=2, amount=300, unit_price=150)
item4 = Item(id=4, order_id=4, product_id=4, quantity=1, amount=300, unit_price=300)


session.add_all([customer1, customer2, customer3, customer4, order1, order2, order3, order4, product1, product2, product3, product4, item1, item2, item3, item4])
session.commit()
