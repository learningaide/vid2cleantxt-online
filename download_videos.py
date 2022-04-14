import urllib.request
import requests
import vid2cleantxt
import os
import time

url = "https://vid2cleantxt-online.jonathanlehner.com/api/"
url = "http://localhost:3000/api/"
while True:
    x = requests.get(url+"get_new_videos")

    print("there are "+str(len(x.json()['videos']))+" videos")
    videos = x.json()['videos']

    print(videos)
    os.system("rm -r ./videos/*")
 
    for index, video in enumerate(videos):
        #if(index > 0): # limit the number of downloaded videos for testing
        #    continue
        print(str(index)+"downloading "+video['url'])
        success = False
        while success == False:
            try:
                urllib.request.urlretrieve(video['url'], "./videos/"+str(index)+video['extensionWithDot']) 
            except Exception as e:
                print(e)
            success = True

        #try:
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
                        'aiversion': "0.0.1"
                    }

                    y = requests.post(url+"update_transcription", data = myobj)
                    print(y.text)

                os.system("rm "+full_path)
        '''except Exception as e:
            print("Exception: "+str(e))
            myobj = {
                'transcription': "Exception: "+str(e),
                'videoID': video['id'],
                'aiversion': "0.0.1"
            }

            y = requests.post(url+"update_transcription", data = myobj)
            print(y.text)'''

    time.sleep(1)

