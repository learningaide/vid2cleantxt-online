import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import express from 'express';
import '../common/collections';

const app = express();
app.set('json spaces', 2)
const bound = Meteor.bindEnvironment((callback) => {callback();});

app.get('/api/get_videos', (req, res) => {
    const email = req.query.email;
    const user = Users.findOne({"emails.0.address": email});
    const videoID = user.profile.pitchVideo;
    const file = Videos.findOne({_id: videoID});
    const videoUrl = file && file.link();
    res.status(200).json({videos: [
        {url: videoUrl, id: videoID}
    ]});
});

app.post('/api/update_transcription', (req, res) => {
    const transcription = req.body.transcription;
    const videoID = req.body.videoID;
    console.log(transcription)
    console.log(videoID)
    res.status(200).json({});
});

WebApp.connectHandlers.use(app);

