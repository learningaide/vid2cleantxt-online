import urllib.request
import requests

url = "https://vid2cleantxt-online.jonathanlehner.com/api/"
#url = "http://localhost:3000/api/"
my_email = "jonathanslehner@gmail.com"
x = requests.get(url+"get_videos"+"?email="+my_email)

for index, video in enumerate(x.json()['videos']):
    print("downloading "+video['url'])
    urllib.request.urlretrieve(video['url'], "./videos/"+str(index)+'.mp4') 

