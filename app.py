'''
from pymongo import MongoClient

local = 'mongodb://localhost:27017/'
api = 'mongodb+srv://user:pass@cluster0.na7qpyn.mongodb.net/?retryWrites=true&w=majority'
client = MongoClient(api)
#database
db = client.flood_monitoring
#collections
updates = db.updates
reports = db.reports

#init live water level monitoring
inserted_id = None
if updates.count_documents({}) == 0:
    inserted_id = updates.insert_one({ "level": 10 }).inserted_id
else:
    cur = updates.find()
    for doc in cur:
        inserted_id = doc['_id']

print(inserted_id)
#func for updating water level
def update(level):
    updates.update_one({ "_id": inserted_id }, { "$set": { "level": level } })

#update(2)

def report(details):
    reports.insert_one(details)
    
#minor moderate major
#report({ "area_affected": "Brgy. 1", "water_level": 4, "severity": "minor", "recommendation": "Be alert and ready for evacuation!" })

#Twilio SMS here

from twilio.rest import Client 
account_sid = 'AC1909a6ba65cce2de58f28ae6552e3488'
auth_token = '5e742510f5cce49a86fa938f1d00f332'

client = Client(account_sid, auth_token) 

def sendSMS(to, msg):
    message = client.messages.create(  
        messaging_service_sid='MG1c36250d0cd6a04dfd0b64559658fdfd', 
        body=msg,      
        to=to
    ) 
 
    print(message.sid)

sendSMS('+639501399192', 'another test')
'''

## water  flow sensor starts here
import RPi.GPIO as GPIO
import time, sys
f=open('FlowMeterOutput.txt', 'a')

GPIO.setmode(GPIO.BOARD)
input = 13
GPIO.setup(input, GPIO.input)
minutes = 0
constant = 0.006
time_new = 0.0
rpt_int = 10

global rate_cnt, tot_cnt
rate_cnt = 0
tot_cnt = 0

def Pulse_cnt(inpt_pin):
    global rate_cnt, tot_cnt
    rate_cnt += 1
    tot_cnt +=1

GPIO.add_event_detect(input, GPIO.FAILING, callback=Pulse_cnt, bouncetime=10)

#MAIN
print('Water Flow - Approximate', str(time.asctime(time.localtime(time.time()))))
rpt_int = int(input('Input desired report interval in seconds: '))
print('Reports every ', rpt_int, ' seconds')
print('Control C to exit')
f.write('\nWater Flow - Approximate - Reports Every' + 
    str(rpt_int)+' Seconds '+
    str(time.asctime(time.localtime(time.time())))
    )

while True:
    time_new = time.time()+rpt_int
    rate_cnt = 0
    while time.time() <= time_new:
        try:
            None
            print(GPIO.input(input), end='')
        except:
            print('\nCTRL C - Exiting nicely')
            GPIO.cleanup()
            f.close()
            print('Done')
            sys.exit()
    
    minutes += 1
    LperM = round(((rate_cnt*constant)/(rpt_int/60)), 2)
    TotLit = round(tot_cnt*constant, 1)
    print('\nLiter / min ', LperM, '(',rpt_int,' seconds sample)')
    print('Total Liters ', TotLit)
    print('Time (min & clock) ', minutes, '\t',
        time.asctime(time.localtime(time.time()), '\n')
    )
    f.write('\nLiters / min' + str(LperM))
    f.write(' Total Liters' + str(TotLit))
    f.write( 'Time (min & clock) ', minutes, '\t',
        time.asctime(time.localtime(time.time())))
    f.flush()

GPIO.cleanup()
f.close()
print('Done')