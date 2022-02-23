import urllib.request
import requests
import vid2cleantxt
import os

url = "https://vid2cleantxt-online.jonathanlehner.com/api/"
#url = "http://localhost:3000/api/"
my_email = "jonathanslehner@gmail.com"
x = requests.get(url+"get_videos"+"?email="+my_email)

print("there are "+str(len(x.json()['videos']))+" videos")
for index, video in enumerate(x.json()['videos']):
    #if(index > 0): # limit the number of downloaded videos for testing
    #    continue
    print("downloading "+video['url'])
    urllib.request.urlretrieve(video['url'], "./videos/"+str(index)+'.mp4') 

    vid2cleantxt.transcribe.transcribe_dir("./videos")
    folder = "./videos/v2clntxt_transcriptions/results_SC_pipeline"
    for file in os.listdir(folder):
        if file.startswith(str(index)+"_"):
            full_path = os.path.join(folder, file)
            print("retrieving results from "+full_path)
            with open(full_path) as f:
                transcription = f.read()

                myobj = {
                    'transcription': transcription,
                    'videoID': video['id'],
                }

                y = requests.post(url+"update_transcription", data = myobj)
                print(y.text)

