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
        <Tabs defaultActiveKey="upload" id="uncontrolled-tab-example">
          <Tab eventKey="upload" title="Upload">
            <div>Upload</div>
            <UserProfileForm {...this.props} />
          </Tab>
          <Tab eventKey="videos" title="My videos">
            <div>My videos</div>
            <RoomList />
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
  };
})(UserProfile);

const RoomList = () => {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <div>
      <Accordion>
        <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="0">
              Video1
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body>Video description 1</Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="1">
              Video2
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="1">
            <Card.Body>Video description 2</Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  );
}
