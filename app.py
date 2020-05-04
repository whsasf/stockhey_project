#!/usr/bin/env python3

from flask import Flask,redirect,abort,render_template,request
from flask_pymongo import PyMongo
from flask_cors import CORS
import datetime
import random
import time


app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config['JSON_AS_ASCII'] = False

# config mongodb
app.config["MONGO_URI"] = "mongodb://localhost:27017/stockdb"
mongo = PyMongo(app)


#function to get any date before today
def getYesterdays(num):
    temp_days = []
    today=datetime.date.today()
    for day_num in range(0,num):
        oneday=datetime.timedelta(days=day_num)
        anyday=today-oneday
        if anyday.isoweekday() != 7:
            # do not get sunday ,since it's total closed
            temp_days.append(str(anyday))
    #print(temp_days)
    return temp_days


@app.route('/',methods=['GET'])
def index():
    # write client ip and timestamp into collection :visiter
    timestamp = datetime.datetime.now().strftime('%Y-%m-%d-%p')
    #get ip
    #print("timestamp:{0}".format(timestamp))
    if request.environ.get('HTTP_X_FORWARDED_FOR') is None:
        ipaddr = request.environ['REMOTE_ADDR']
    else:
        ipaddr = request.environ.get('HTTP_X_FORWARDED_FOR')
    mongo.db.visiter.insert_one({"visit":ipaddr+'-'+timestamp})

    return render_template('index.html')


@app.route('/rankindexcn',methods=['GET'])
def rankindexcn():
    latest_update_time = dict(list(mongo.db.accessory.find({},{"_id":0,"time_stamp":1}))[0])['time_stamp']
    cn_up_count = mongo.db.stock_latest.find({"stock_come": 'CN', "stock_percent": {"$gte": 0}},{"_id":0,"stock_id":1}).count()
    cn_total_count = mongo.db.stock_latest.find({"stock_come": 'CN'},{"_id":0,"stock_id":1}).count()
    #print(cn_up_count,cn_total_count)
    myhalFvCn = format(cn_up_count/cn_total_count,'.4f')
    #print(myhalFvCn)
    total_visits = len(mongo.db.visiter.distinct("visit"))
    return render_template('rankdatacn.html',latest_update_time=latest_update_time,total_visits=total_visits,myhalFvCn=float(myhalFvCn))

@app.route('/rankindexus',methods=['GET'])
def rankindexus():
    latest_update_time = dict(list(mongo.db.accessory.find({},{"_id":0,"time_stamp":1}))[0])['time_stamp']
    us_up_count = mongo.db.stock_latest.find({"stock_come": 'US', "stock_percent": {"$gte": 0}},{"_id":0,"stock_id":1}).count()
    us_total_count = mongo.db.stock_latest.find({"stock_come": 'US'},{"_id":0,"stock_id":1}).count()
    #print(us_up_count,us_total_count)
    myhalFvUs = format(us_up_count/us_total_count,'.4f')
    #print(myhalFvUs)
    total_visits = len(mongo.db.visiter.distinct("visit"))
    return render_template('rankdataus.html',latest_update_time=latest_update_time,total_visits=total_visits,myhalFvUs = float(myhalFvUs))


@app.route('/about',methods=['GET'])
def about():
    return render_template('about.html')
