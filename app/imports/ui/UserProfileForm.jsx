import React, {useState} from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import FileUpload from './FileUpload.js';
import VideoRecorder from 'react-video-recorder'
import VideoUpload from './VideoUpload.js';

const UserProfileForm = (props) => {
    console.log(props);
    const user = props.user;
    const userData = user && user.profile && user.profile.userData;
    console.log(userData)
    const name = userData && userData.name || "";
    const gender = userData && userData.gender || "man";
    const aboutme = userData && userData.aboutme || "";
    const lookingfor = userData && userData.lookingfor || "men";
    console.log(name)

    const [video, setVideo] = useState();
  
  if(!user){ // prevent loading formik with bad values
    return <div></div>
  }

  return (
  <div>
    <Formik
      initialValues={{ 
        name, 
        gender, 
        aboutme,
        lookingfor,
      }}
      validate={values => {
        return true;
      }}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        setTimeout(() => {
          Meteor.call('saveUserData', values);
          setSubmitting(false);
        }, 400);
      }}
    >
      {({ values, isSubmitting }) => (
        <Form>
          <div style={{width: "500px", margin: "15px"}} >
            <div>Record</div>
            <VideoRecorder 
              replayVideoAutoplayAndLoopOff={true}
              showReplayControls={true}
              onRecordingComplete={(videoBlob) => {
                // Do something with the video...
                setVideo(videoBlob);
                console.log('videoBlob', videoBlob)
              }} 
            />
          </div>
          <div style={{margin: "15px"}} >
            <VideoUpload video={video}/>
            -------------------
            <FileUpload setVideo={setVideo}/>
          </div>
          <div style={{margin: "15px"}} >
            <div>Uploaded video</div>
          </div>
          <div style={{width: "500px", margin: "15px"}} >
            {props.pitchVideo ? 
              <video style={{width: "500px"}} height="auto" controls="controls">
                <source src={`${props.pitchVideo}?play=true`} type={props.videoType} />
              </video>
              : ""
            }
          </div>
          <button type="submit" disabled={isSubmitting}>
            Save
          </button>
        </Form>
      )}
    </Formik>
  </div>
    );
}

export default UserProfileForm;