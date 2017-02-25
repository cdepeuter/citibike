
# coding: utf-8

# In[ ]:

import requests
import os
import requests, zipfile, io

def extract_zip_file(zip_file_url):
    r = requests.get(zip_file_url)
    z = zipfile.ZipFile(io.BytesIO(r.content))
    z.extractall()

years = range(2014,2017)
for year in years:
    for month in range(12):
        if year == 2014 and month <= 2:
            continue
        month_str = str(month+1).zfill(2)
        date_string = str(year) + month_str
        zip_file_url = 'https://s3.amazonaws.com/tripdata/{}-citibike-tripdata.zip'         .format(date_string)
        extract_zip_file(zip_file_url)
        #os.rename(os.listdir()[0], 'citibike-{}.csv'.format(date_string))
        print('Done with {}'.format(date_string))


# In[ ]:

for file in os.listdir():
    if file[-3:] == 'csv' and file[4] == '-':
        date_month = (i.replace('-', '')[:6])
        os.rename(file, '{}-citibike-tripdata.csv'.format(date_month))


# In[ ]:



