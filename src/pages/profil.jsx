import React, { useState } from 'react';
import '../sass/Profile.scss';
import { auth, db } from '../Firebase';
import { useEffect } from 'react';
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import Posts from './Posts';
import {v4 as uuid} from 'uuid';
function Profil() {
  const [posts, setPosts] = useState([]);
  // const [newPost, setNewPost] = useState('');

      useEffect (()=>{
            const getPosts = async () => {
              if(auth.currentUser){
                 const docRef = collection(db, 'Posts');
                const spes=query(docRef, where('PostedBy', '==', auth.currentUser.displayName));
                const docSnap = await getDocs(spes);
                const PosData = [];
                 for (const doc of docSnap.docs) {
                    const postData = doc.data();
                    
                    // Query comments for the current post using the 'postId' field
                    const commentsRef = collection(db, 'Comments');
                    const commentsQuery = query(commentsRef, where('id', '==', postData.id));
                    const commentsSnap = await getDocs(commentsQuery);
                    const commentsData = commentsSnap.docs.map((commentDoc) => commentDoc.data());
                    postData.comments = commentsData;
                        // Query likes and dislikes count for the current post
                    const likesRef = collection(db, `Posts/${postData.id}/likes`);
                    const dislikesRef = collection(db, `Posts/${postData.id}/dislikes`);

                    const likesSnap = await getDocs(likesRef);
                    const dislikesSnap = await getDocs(dislikesRef);

                    postData.likesCount = likesSnap.size;
                    postData.dislikesCount = dislikesSnap.size;
                    PosData.push(postData);
                }

                  setPosts(PosData);
              }
       

       
      };
        getPosts();
      },[posts])



  const handleLike = async (postId) => {
  const userId = auth.currentUser.uid;
  const postRef = doc(db, 'Posts', postId);
  const likesRef = collection(postRef, 'likes');

  const likeDoc = doc(likesRef, userId);
  const likeDocSnap = await getDoc(likeDoc);

  if (!likeDocSnap.exists()) {
    await setDoc(likeDoc, { liked: true });

    // Update likes count
    const postIndex = posts.findIndex((post) => post.id === postId);
    if (postIndex !== -1) {
      const newData = [...posts];
      newData[postIndex].likesCount++;
     setPosts(newData);
    }
  } else {
    await deleteDoc(likeDoc);

    // Update likes count
    const postIndex = posts.findIndex((post) => post.id === postId);
    if (postIndex !== -1) {
      const newData = [...posts];
      newData[postIndex].likesCount--;
      setPosts(newData);
    }
  }
};

const handleDislike = async (postId) => {
  const userId = auth.currentUser.uid;
  const postRef = doc(db, 'Posts', postId);
  const dislikesRef = collection(postRef, 'dislikes');

  const dislikeDoc = doc(dislikesRef, userId);
  const dislikeDocSnap = await getDoc(dislikeDoc);

  if (!dislikeDocSnap.exists()) {
    await setDoc(dislikeDoc, { disliked: true, userId });

    // Update dislikes count
    const postIndex = posts.findIndex((post) => post.id === postId);
    if (postIndex !== -1) {
      const newData = [...posts];
      newData[postIndex].dislikesCount++;
      setPosts(newData);
    }
  } else {
    await deleteDoc(dislikeDoc);

    // Update dislikes count
    const postIndex = posts.findIndex((post) => post.id === postId);
    if (postIndex !== -1) {
      const newData = [...posts];
      newData[postIndex].dislikesCount--;
      setPosts(newData);
    }
  }
};
  const add2 = (e, Post) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addComment(e, Post); 
    }
  };

  const addComment = (e, Post) => {
    const commentText = e.target.value;

    if (commentText !== '') {
      setDoc(doc(db, 'Comments', uuid()), {
        id: Post.id,
        userImage: auth.currentUser.photoURL,
        PostedBy: auth.currentUser.displayName,
        text: commentText,
        img: '',
      });
    }
  };

  
  return (
    <div className='profile-container'>
      {/* {console.log(posts)} */}
      <div className='profile-header'>
        <img className='profile-cover' src='https://placekitten.com/1500/300' alt='Cover' />
        <img className='profile-picture' src={auth.currentUser? auth.currentUser.photoURL: ''} alt='Profile' />
        <div className='profile-info'>
          <h1>{auth.currentUser? auth.currentUser.displayName:"John Doe"}</h1>
          {/* <p>Web Developer</p> */}
        </div>
      </div>
      <div className='profile-content'>
        {/* <div className='post-form'>
          <textarea
            placeholder="What's on your mind?"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <button onClick={handlePostSubmit}>Post</button>
        </div> */}
        <div className='posts'>
         {posts.map((Post) => (
              <div key={Post.id} className='post'>
                <div className='post-details'>
                  <p className='posted-by'>{Post.PostedBy}</p>
                  <p className='post-text'>{Post.text}</p>
                </div>
                    <div className='like-dislike'>
                          <button className='lik' onClick={() => handleLike(Post.id)}>
                          <span role='img' aria-label='Like'>👍</span>{Post.likesCount}
                          </button>
                          <button className='dis' onClick={() => handleDislike(Post.id)}>
                          <span role='img' aria-label='Dislike' >👎</span> {Post.dislikesCount}
                          </button>
                    </div>
                {Post.img && <img src={Post.img} alt='Posted' className='posted-image' />}
                <input onKeyDown={(e) => add2(e, Post)} placeholder='Comment' className='input1' />
                
                {Post.comments && (
                  <div className='comments'>
                    {Post.comments.map((comment,id) => (
                      <div key={id} className='comment'>
                        <p className='commented-by'>{comment.PostedBy}</p>
                        <p className='comment-text'>{comment.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
      
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profil;
