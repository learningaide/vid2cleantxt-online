
// common collections
Users = Meteor.users;
Rooms = new Mongo.Collection('rooms');

import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';
import _ from 'lodash';

var Dropbox, Request, bound, client, fs = {};

if (Meteor.isServer) {
  Dropbox = require('dropbox').Dropbox;
  Request = require('request');
  const fetch = require("node-fetch");

  bound = Meteor.bindEnvironment(function(callback) {
    return callback();
  });
  
  client = new Dropbox({
    accessToken: process.env.DropboxToken,  // Use your token here
    fetch: fetch
  });
  // account of milliwayszh
}

request = require('request');
fs = require('fs');
var fetch = require('isomorphic-fetch'); // or another library of choice.

Images = null;

Videos = new FilesCollection({
  debug: false,  // Change to `true` for debugging
  storagePath: 'assets/app/uploads/uploadedVideos',
  collectionName: 'uploadedVideos',
  allowClientCode: false,
  onAfterUpload: function(fileRef){
    // In onAfterUpload callback we will move file to DropBox
    console.log("onAfterUpload "+fileRef._id)
    try{
      var self = this;
      var makeUrl = function(path, fileRef, version){
        client.sharingCreateSharedLink({path: path, short_url: false}).then(function(response){
          bound(function(){
            const url = response.url.replace('dl=0','raw=1');
            var upd = {
              $set: {}
            };
            upd['$set']["versions." + version + ".meta.pipeFrom"] = url;
            upd['$set']["versions." + version + ".meta.pipePath"] = path;
            upd['$set']["meta.processed"] = false;
            upd['$set']["meta.status"] = "queued";
            upd['$set']["meta.aiversion"] = "";
            upd['$set']["meta.createdAt"] = new Date();
            upd['$set']["meta.transcription"] = "";

            self.collection.update({
              _id: fileRef._id
            }, upd,
            function(error){
              if(error){
                return console.error(error);
              }
              // Unlink original files from FS after successful upload to DropBox
              self.unlink(self.collection.findOne(fileRef._id), version);
            });
          });
        }).catch(function(error){
          console.error(error);
        });
      };

      var writeToDB = function(fileRef, version, data){
        // DropBox already uses random URLs
        // No need to use random file names
        client.filesUpload({path: '/' + fileRef._id + "-" + version + "." + fileRef.extension, contents: data, autorename:false}).then(function(response){
          bound(function(){
            // The file was successfully uploaded, generating a downloadable link
            makeUrl(response.path_display, fileRef, version);
          });
        }).catch(function(error){
          bound(function(){
            console.error(error);
          });
        });
      };

      var readFile = function(fileRef, vRef, version){
        fs.readFile(vRef.path, function(error, data){
          bound(function(){
            if(error){
              return console.error(error)
            }
            writeToDB(fileRef, version, data);
          });
        });
      };

      var sendToStorage = function(fileRef){
        _.each(fileRef.versions, function(vRef, version){
          readFile(fileRef, vRef, version);
        });
      };

      sendToStorage(fileRef);
    } catch(error){
      // There was an error while uploading the file to Dropbox, displaying the concerned file
      console.log('The following error occurred while removing '+ fileRef.path);
      // Removing the file from the file system
      fs.unlink(fileRef.path, function(error){
        if(error){
          console.error(error);
        }
      });
      // Removing the file from the collection
      Collections.files.remove({
        _id: fileRef._id
      }, function(error){
        if(error){
          console.error(error);
        }
      });
    }
  },
  onBeforeRemove: function(cursor){
    return false;
  },
  interceptDownload: function(http, fileRef, version){
    // Files are stored in Dropbox, intercepting the download to serve the file from Dropbox
    var path, ref, ref1, ref2;
    path = (ref = fileRef.versions) != null ? (ref1 = ref[version]) != null ? (ref2 = ref1.meta) != null ? ref2.pipeFrom : void 0 : void 0 : void 0;
    if(path){
      // If file is moved to DropBox
      // We will pipe request to DropBox
      // So, original link will stay always secure
      request({
        url: path,
        headers: _.pick(http.request.headers, 'range', 'accept-language', 'accept', 'cache-control', 'pragma', 'connection', 'upgrade-insecure-requests', 'user-agent')
      }).on('response', function(response){
        if(response.statusCode == 200){
          response.headers = _.pick(response.headers, 'accept-ranges', 'cache-control', 'connection', 'content-disposition', 'content-length', 'content-type', 'date', 'etag');
          response.headers['Cache-control'] = "only-if-cached, public, max-age=2592000";
        }
      }).pipe(http.response);
      return true;
    } else{
      // While file is not yet uploaded to DropBox
      // We will serve file from FS
      return false;
    }
  }
});


if (Meteor.isServer){
  // Intercept File's collection remove method to remove file from DropBox

  var _origRemove = Videos.remove;  // Catching the original remove method to call it after
  Videos.remove = function(search){
      var cursor = this.collection.find(search);
      cursor.forEach(function(fileRef){
      _.each(fileRef.versions, function(vRef){
          var ref;
          if (vRef != null ? (ref = vRef.meta) != null ? ref.pipePath : void 0 : void 0){
          client.filesDeleteV2({path: vRef.meta.pipePath}).catch(function(error){
              bound(function(){
              console.error(error);
              });
          });
          }
      });
      });
      // Call original method
      _origRemove.call(this, search);
  };
}