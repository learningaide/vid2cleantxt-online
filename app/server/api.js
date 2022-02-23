import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import express from 'express';
import '../common/collections';

const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.set('json spaces', 2)
const bound = Meteor.bindEnvironment((callback) => {callback();});

app.get('/api/get_videos', (req, res) => {
    bound(() => {
        const email = req.query.email;
        const user = Users.findOne({"emails.0.address": email});

        // TODO: in production we should only download unprocessed videos (processed: false)
        const user_videos = Videos.find({"meta.userId": user._id}).fetch();
        console.log(user_videos);
        const videos = user_videos.map(video => {
        const obj = Videos.findOne({_id: video._id});
        fileUrl = obj && obj.link();
        video.url = fileUrl;
        video.id = video._id;
        return video;
        });

        res.status(200).json({
            videos: videos
        });
    });
});

app.post('/api/update_transcription', (req, res) => {
    bound(()=>{
        console.log("req received "+JSON.stringify(req.body))
        const transcription = req.body.transcription;
        const videoID = req.body.videoID;
        console.log(transcription)
        console.log(videoID)
        Videos.update({_id: videoID},
            {$set: {
                "meta.processed": true,
                "meta.transcription": transcription
                }
            });
        res.status(200).json({});
    });
});

WebApp.connectHandlers.use(app);

