import React, {useState,useEffect} from 'react'
import  './Posts.css';
import { Avatar } from '@mui/material';
import { db } from '../firebase';
import firebase from 'firebase/compat/app';



// props and destructure

const Posts = ({ postId, user ,username,caption,imageUrl }) => {
  
  const [comments, setComments] = useState([]);
  const [comment,setComment] = useState("");

  useEffect(() => {
    let unsubscribe;
    if(postId){
     unsubscribe = db
    .collection("posts")
    .doc(postId)
    .collection("comments")
    .orderBy('timestamp','desc')
    .onSnapshot((snapshot) => {
      setComments(snapshot.docs.map((doc) => doc.data()));
    });
  }
    return () => {
      unsubscribe();
    };
  }, [postId]);
  // variable is used as dependency


  // Post comment function to submit comment to the data base 

  const postComment = (event) => {
    event.preventDefault();

    db.collection("posts").doc(postId).collection("comments").add({
      text:comment,
      username:user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    setComment('');

  }

  return (
    <div className='post'>
      <div className='post__header'>
      <Avatar
      className='post_avatar'
      alt={username}
      src="/static/images/avatar/1.jpg"/>
        <h3>{username}</h3>
      </div>
        <img className='post__image' src={imageUrl} alt='' />
    
      {/* header -> avatar + userName */}

      {/* image */}
      <h4 className='post__text'>
        <strong>{ username }</strong>
        { caption }
        </h4>
        <div className='post__comments'>
          {comments.map((comment) => (
            <p>
              <strong>{comment.username}</strong>{comment.text}
            </p>
          ))}
        </div>
        {user &&(
    
      <form className='post__commentBox'>
        <input
        className='post__input'
        text="text"
        placeholder='Add a comment...'
        value={comment}
        onChange = {(e) =>setComment(e.target.value)}
         />
         <button
         className='post__button'
         disabled={!comment}
         type="submit"
         onClick={postComment}
         >Post</button>
      </form>
        )}
    </div>
  );
}

export default Posts
