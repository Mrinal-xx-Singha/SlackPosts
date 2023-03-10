
import { Button,Input } from '@mui/material'
import React, { useState } from 'react'
import { storage,db } from '../firebase';
import firebase from 'firebase/compat/app';
import './ImageUpload.css'



const ImageUpload = ({username}) => {
    const[image,setImage] = useState(null);
    const[progress,setProgress] = useState(0);
    const [caption,setCaption] = useState("");

    const handleChange =(e) => {
        if(e.target.files[0]) {
            setImage(e.target.files[0])
        }
    };

    // complicated thing


    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                console.log(snapshot)
                // progress logic
                const progress = Math.round(
                    (snapshot.bytesTransferred/snapshot.totalBytes)* 100
                );
                setProgress(progress);
            },
            (error) => {
                // Error Function...

                console.log(error);
                alert(error.message);
            },
            () =>{
                // complete function
                storage.ref("images")
                .child(image.name)
                .getDownloadURL()
                .then((url) => {
                    db.collection("posts")
                    .add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption:caption,
                        imageUrl:url,
                        username:username,
                    })

                    .then(() =>{
                    setProgress(0);
                    setCaption("");
                    setImage(null)
                    })
                    .catch((error) =>{
                        console.log(error);
                        alert(error.message)
                    });
                });
            }
        )

    }



  return (
    <div className='imageupload'>
        <progress className='imageupload__progress' value={progress} max="100" />
      <Input type="text" placeholder='Enter a caption....' onChange={event =>setCaption(event.target.value)} value={caption} />
      <Input type='file' onChange={handleChange} />
      <Button onClick={handleUpload}>
        Upload
      </Button>
    </div>
  )
}


export default ImageUpload

