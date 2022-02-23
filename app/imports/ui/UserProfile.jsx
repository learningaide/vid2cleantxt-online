import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import UserProfileForm from './UserProfileForm.jsx';
import Accordion from 'react-bootstrap/Accordion';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

class UserProfile extends Component {
  constructor(props){
    super(props);
    this.state = {}
  }

  render() {
    return (
      <div>
        <Tabs defaultActiveKey="videos" id="uncontrolled-tab-example">
          <Tab eventKey="videos" title="My videos">
            <div>My videos</div>
            <VideoList {...this.props}/>
          </Tab>
          <Tab eventKey="upload" title="Upload">
            <div>Upload</div>
            <UserProfileForm {...this.props}/>
          </Tab>
        </Tabs>
      </div>
    );
  }
}

export default StartupContainer = withTracker(() => {
  const user = Meteor.user();
  const fileID = user && user.profile && user.profile.profileImage;
  let fileUrl;
  let videoUrl;
  let videoType;
  let user_videos;
  if(user){
    user_videos = Videos.find({"meta.userId": user._id}).fetch();
    console.log(user_videos);
    user_videos = user_videos.map(video => {
      const obj = Videos.findOne({_id: video._id});
      fileUrl = obj && obj.link();
      video.url = fileUrl;
      return video;
    });
  }
  if(fileID){
    const file = Images.findOne({_id: fileID});
    fileUrl = file && file.link();
  }
  const videoID = user && user.profile && user.profile.pitchVideo;
  if(videoID){
    const file = Videos.findOne({_id: videoID});
    videoUrl = file && file.link();
    videoType = file && file.type;
  }
  return {
    user,
    profileImage: fileUrl,
    pitchVideo: videoUrl,
    videoType,
    user_videos
  };
})(UserProfile);

const VideoList = (props) => {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <div>
      <Accordion>
        {props.user_videos && props.user_videos.map((video, index) => {
          return(
            <Card key={index}>
              <Card.Header>
                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                  Video {index} - {video.name}
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="0">
                <Card.Body>
                  <div>name: {video.name}</div>
                  <div>created at: {JSON.stringify(video.meta.createdAt)}</div>
                  <div>processed: {JSON.stringify(video.meta.processed)}</div>
                  <div>transcription: {video.meta.transcription}</div>
                  <video style={{width: "500px"}} height="auto" controls="controls">
                    <source src={`${video.url}?play=true`} type={video.type} />
                  </video>
                  <div>
                    <button onClick={
                      ()=>{
                        if(confirm("Are you sure you want to delete?") == true){
                          console.log("deleting "+video._id)
                          Videos.remove({_id: video._id});
                        }
                      }
                    }>delete</button>
                  </div>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          )
        })}
      </Accordion>
    </div>
  );
}
