#!/usr/bin/env python3

from flask import Flask,redirect,abort,render_template,request
from flask_pymongo import PyMongo
import datetime
import random



app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False

# config mongodb
app.config["MONGO_URI"] = "mongodb://localhost:27017/stockdb"
mongo = PyMongo(app)


#function to get any date before today
def getYesterday(num): 
    today=datetime.date.today() 
    oneday=datetime.timedelta(days=num) 
    anyday=today-oneday  
    return anyday


@app.route('/index.html',methods=['GET'])
@app.route('/',methods=['GET'])
def index():
    items_length = mongo.db.stock_latest.find({"status_flag":1}).count()
    items = mongo.db.stock_latest.find({"status_flag":1},{"stock_id":1,"stock_name":1,"stock_area":1,"stock_value":1,"_id":0}).sort("stock_value",-1).skip(0).limit(20)
    latest_update_time = dict(list(mongo.db.accessory.find({},{"_id":0,"time_stamp":1}))[0])['time_stamp']
    if items_length%20 == 0:
        total_page = items_length//20
    else:
        total_page = items_length//20+1

    #prapare data for viaualization
    # 1 get date list
    date_range = [str(getYesterday(x)) for x in range(0,10)]
    # 2 get stock_name and stock_value in each day
    real_date_range = []
    all_data = {}
    all_data_top3 = {}
    CopList_dict = {}
    for date in date_range: 
        temp1 = date+'-PM'
        temp2 = date+'-AM'
        if mongo.db.stock.find({"time_stamp":temp1}).count() > 0:
            raw_data = list(mongo.db.stock.find({"time_stamp":temp1},{"stock_name":1,"stock_area":1,"stock_value":1,"_id":0}))
        else:
            raw_data = list(mongo.db.stock.find({"time_stamp":temp2},{"stock_name":1,"stock_area":1,"stock_value":1,"_id":0}))
        if raw_data:
            real_date_range.append(date)
            out_raw = sorted(raw_data, key=lambda x : x['stock_value'], reverse=True)
            out = out_raw[0:50] # get top 50
            out_a = out_raw[0:3] # get top 3
            random.shuffle(out) # break the order
            out2 = [{"name":x['stock_name']+'-'+x['stock_area'],"value":x['stock_value']} for x in out]
            out_a2 = [{"name":x['stock_name']+'-'+x['stock_area'],"value":x['stock_value']} for x in out_a]
            #print(out2)
            all_data[date] = out2
            all_data_top3[date] = out_a2
            CopList_dict[date] = [x['name'] for x in out2]
    #print(all_data)
    #print(CopList_dict)
    return render_template('index.html',items = items,total_page=total_page,latest_update_time=latest_update_time,real_date_range=real_date_range,CopList_dict=CopList_dict,all_data= all_data,all_data_top3=all_data_top3)


@app.route('/rank',methods=['GET'])
def fetch_pagenum():
    pagenum = int(request.args['page'])
    items = mongo.db.stock_latest.find({"status_flag":1},{"stock_id":1,"stock_name":1,"stock_area":1,"stock_value":1,"_id":0}).sort("stock_value",-1).skip((pagenum-1)*20).limit(20) 
    response = []
    for item in items:
        response.append([item['stock_id'],item['stock_name'],item['stock_value'],item['stock_area']])
    return (str(response))



