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
    if request.environ.get('HTTP_X_FORWARDED_FOR') is None:
        ipaddr = request.environ['REMOTE_ADDR']
    else:
        ipaddr = request.environ.get('HTTP_X_FORWARDED_FOR')
    mongo.db.visiter.insert_one({"visit":ipaddr+'-'+timestamp})
    
    return render_template('index.html')


#@app.route('/echart',methods=['GET'])
#def echart():
#    """
#    this function is used to response data that echarts needed in front end
#    """
#    
#    #prapare data for viaualization
#    # 1 get date list
#    date_range = getYesterdays(10) # 10 days by default
#    # 2 get stock_name and stock_value in each day
#    final = {}
#    real_date_range = []
#    all_data = {}
#    all_data_top5 = {}
#    CopList_dict = {}
#
#    for date in date_range: 
#        temp1 = date+'-PM'
#        temp2 = date+'-AM'
#        if mongo.db.stock.find({"time_stamp":temp1}).count() > 0:
#
#            raw_data = list(mongo.db.stock.find({"time_stamp":temp1,"stock_value":{"$gt":0}},{"stock_name":1,"stock_area":1,"stock_value":1,"_id":0}))
#        else:
#            raw_data = list(mongo.db.stock.find({"time_stamp":temp2,"stock_value":{"$gt":0}},{"stock_name":1,"stock_area":1,"stock_value":1,"_id":0}))
#        if raw_data:
#            real_date_range.append(date)
#            out_raw = sorted(raw_data, key=lambda x : x['stock_value'], reverse=True)
#            out = out_raw[0:50] # get top 50
#            out_a = out_raw[0:5] # get top 5
#            random.shuffle(out) # break the order
#            out2 = [{"name":x['stock_name']+'-'+x['stock_area'],"value":x['stock_value']} for x in out]
#            out_a2 = [{"name":x['stock_name']+'-'+x['stock_area'],"value":x['stock_value']} for x in out_a]
#            #print(out2)
#            all_data[date] = out2
#            all_data_top5[date] = out_a2
#            CopList_dict[date] = [x['name'] for x in out2]
#    final['real_date_range'] = real_date_range
#    final['all_data'] = all_data
#    final['all_data_top5'] = all_data_top5
#    final['CopList_dict'] = CopList_dict
#    #print(final)
#    return (final)


@app.route('/rankindexcn',methods=['GET'])
def rankindexcn():
    latest_update_time = dict(list(mongo.db.accessory.find({},{"_id":0,"time_stamp":1}))[0])['time_stamp']
    total_visits = len(mongo.db.visiter.distinct("visit"))
    return render_template('rankdatacn.html',latest_update_time=latest_update_time,total_visits=total_visits)

@app.route('/rankindexus',methods=['GET'])
def rankindexus():
    latest_update_time = dict(list(mongo.db.accessory.find({},{"_id":0,"time_stamp":1}))[0])['time_stamp']
    total_visits = len(mongo.db.visiter.distinct("visit"))
    return render_template('rankdataus.html',latest_update_time=latest_update_time,total_visits=total_visits)

#@app.route('/rankdata',methods=['GET'])
#def rankdata():
#    
#    pagenum = int(request.args['page'])
#    #print("pagenum",pagenum)
#    items = mongo.db.stock_latest.find({"status_flag":1},{"stock_id":1,"stock_name":1,"stock_area":1,"stock_value":1,"_id":0}).sort("stock_value",-1).skip((pagenum-1)*20).limit(20) 
#    response_data = []
#    for item in items:
#        response_data.append([item['stock_id'],item['stock_name'],item['stock_value'],item['stock_area']])
#    return (str(response_data))



@app.route('/about',methods=['GET'])
def about():
    return render_template('about.html')


