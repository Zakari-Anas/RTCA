  import React, { useEffect } from 'react';
  import { useState,useRef  } from 'react';
  import '../sass/Post.scss';
  import {storage} from '../Firebase';
  import { auth } from '../Firebase';
  import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
  import { db } from '../Firebase';
  import {v4 as uuid} from 'uuid';
  import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'




  function Posts() {
    const [cameraStream, setCameraStream] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [data, setData] = useState([]);
    const videoRef = useRef(null);
   const [userImage,setuserImage] =useState('');

    useEffect(() => {
       if (auth.currentUser) {
        setuserImage(auth.currentUser.photoURL);
      }
      const getPosts = async () => {
        const docRef = collection(db, 'Posts');
        const docSnap = await getDocs(docRef);
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

        setData(PosData);
      };
        getPosts();
    }, [userImage,data]);

    const handleTitleClick = () => {
      // Mettez ici le code que vous souhaitez exécuter lorsque le titre est cliqué
      console.log('Titre cliqué !');
    };
    const [showEmojis, setShowEmojis] = useState(false); // État pour suivre l'affichage des emojis

  const handleVideo = (event) => {

    if (event.target.innerText === 'Vidéo en direct') {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          setCameraStream(stream);
          videoRef.current.srcObject = stream;
        })
        .catch((error) => {
          console.error('Erreur lors de l\'accès à la caméra :', error);
        });
    }
  }
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      // Handle the selected file (you can upload it or use it as needed)
      console.log('Selected file:', file);
      setSelectedFile(file);
    }
  };
    const handleEmojisClick = (event) => {
      event.preventDefault(); // Empêche le formulaire de se soumettre automatiquement
      setShowEmojis(!showEmojis);

    };
    function handleCloseClick() {
      const emojiContainer = document.querySelector('.emoji-container');
      emojiContainer.style.display = 'none';
    }
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef(null);
    const [emoji, setEmoji] = useState('');
    const [selectedEmoji, setSelectedEmoji] = useState('');

    const handleEmojiClick = (emoji) => {
      const currentInput = inputRef.current;
      const startPosition = currentInput.selectionStart;
      const endPosition = currentInput.selectionEnd;

      const newInputValue =
        inputValue.slice(0, startPosition) +
        emoji +
        inputValue.slice(endPosition);

      setSelectedEmoji('');
      setInputValue(newInputValue);
      currentInput.focus();

      const newCursorPosition = startPosition + emoji.length;
      currentInput.setSelectionRange(newCursorPosition, newCursorPosition);
    };
    const stopVideo = (e) => {
      e.preventDefault(); 
      if (videoRef.current) {
        const videoElement = videoRef.current;
        videoElement.pause();
        videoElement.srcObject = null;
      }
      setIsVideoPlaying(false);
    };

    const add = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        ajouter();
      }
    }

   const ajouter = async () => {
  const storageRef = ref(storage, `/Posts/${auth.currentUser.uid}/${uuid()}`);

  if (selectedFile) {
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);
    uploadTask.on(
      "state_changed",
     

      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        const postId = uuid();

        await setDoc(doc(db, "Posts", postId), {
          id: postId,
          userImage: auth.currentUser.photoURL,
          PostedBy: auth.currentUser.displayName,
          text: inputValue,
          img: downloadURL,
        });

        // Add the user's like to the likes subcollection of the specific post
        await addDoc(collection(db, `Posts/${postId}/likes`), {
          userId: auth.currentUser.uid,
        });
      }
    );
  } else {
    // Create the post document
    const postId = uuid();
    await setDoc(doc(db, "Posts", postId), {
      id: postId,
      userImage: auth.currentUser.photoURL,
      PostedBy: auth.currentUser.displayName,
      text: inputValue,
      img: "",
    });

    // Add the user's like to the likes subcollection of the specific post
    await addDoc(collection(db, `Posts/${postId}/likes`), {
          userId: auth.currentUser.uid,
        });
  }
};


  const add2 = (e, Post) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addComment(e, Post); // Pass the event 'e' to addComment
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

const handleLike = async (postId) => {
  const userId = auth.currentUser.uid;
  const postRef = doc(db, 'Posts', postId);
  const likesRef = collection(postRef, 'likes');

  const likeDoc = doc(likesRef, userId);
  const likeDocSnap = await getDoc(likeDoc);

  if (!likeDocSnap.exists()) {
    await setDoc(likeDoc, { liked: true });

    // Update likes count
    const postIndex = data.findIndex((post) => post.id === postId);
    if (postIndex !== -1) {
      const newData = [...data];
      newData[postIndex].likesCount++;
      setData(newData);
    }
  } else {
    await deleteDoc(likeDoc);

    // Update likes count
    const postIndex = data.findIndex((post) => post.id === postId);
    if (postIndex !== -1) {
      const newData = [...data];
      newData[postIndex].likesCount--;
      setData(newData);
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
    const postIndex = data.findIndex((post) => post.id === postId);
    if (postIndex !== -1) {
      const newData = [...data];
      newData[postIndex].dislikesCount++;
      setData(newData);
    }
  } else {
    await deleteDoc(dislikeDoc);

    // Update dislikes count
    const postIndex = data.findIndex((post) => post.id === postId);
    if (postIndex !== -1) {
      const newData = [...data];
      newData[postIndex].dislikesCount--;
      setData(newData);
    }
  }
};

    return (
      <div className='Container'>
        {/* <div className='AjouterPost'> */}
          <form className='Form-Container' type='submit'>
          {/* <div aria-label="Créer une publication" className='pub'  role="region"> */}
            {/* <div className="x1cy8zhl x78zum5 x1iyjqo2 xs83m0k xh8yej3"> */}
            <div className="users_image">
                    <a href="#"  onClick={handleTitleClick}>
                              <img
                                height="4"
                                width="4"
                                alt=""
                                className='profile'
                                src={userImage}
                          
                              />
                              </a>
            </div>
                              <input
                                ref={inputRef}
                                type='text'
                                className='inp'
                                placeholder="What's on your mind, Anas"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={add}
                              />
                    
     <div className=" x78zum5 xl56j7k x1rfph6h x6ikm8r x10wlt62">
               <video ref={videoRef}  muted autoPlay  />
               {/* <div className="close-button" onClick={stopVideo}> 
    </div> */}
    
    {/* <a href="#" className="x1" onClick={handleTitleClick}>
                              <img
                                height="16"
                                width="14"
                                alt=""
                                className='im4'
                                src="https://static.xx.fbcdn.net/rsrc.php/v3/yd/r/Y4mYLVOhTwq.png?_nc_eui2=AeE3OiHIcB4fLBpJ_rHbxxEbvPIN-OmHLJy88g346YcsnOnN58MWG55A_Gr-bVLFSXyGn13mMkgo-dhEwIFmvX8-"
                          
                              />
                              </a> */}
              <div className='vid'>
                      <span className='video' onClick={handleVideo}>
                        Vidéo en direct
                      </span>
              </div>

  </div>

                  
                          <div className=" x78zum5 xl56j7k x1rfph6h x6ikm8r x10wlt62">
                            {/* <span className=" x1c4vz4f x2lah0s x1emribx">
                              <img
                                height="14"
                                width="14"
                                alt=""
                                className='im2'
                                src="https://static.xx.fbcdn.net/rsrc.php/v3/y7/r/Ivw7nhRtXyo.png?_nc_eui2=AeHOJV2F7UbRmAQwzgtkYvvLPL4YoeGsw5I8vhih4azDkljhMu9Y3PK_PRhJZ4Wqo1M-x3PlUexizUoXf_D8aCRq"
                              />
                            </span> */}
                        
                            <div>
                    {/* <label htmlFor="fileInput" className="photo">
                      Photo / vidéo
                    </label> */}
                    <label className='video' htmlFor="fileInput">
        Photo / vidéo
      </label>
      <input
        type="file"
        id="fileInput"
        accept=".jpg, .jpeg, .png, .gif, .bmp, .webp, .mp4, .avi, .mkv, .mov"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      {selectedFile && (
        <div>
          <p>Selected File: {selectedFile.name}</p>
          {selectedFile.type.startsWith("image") ? (
            <img src={URL.createObjectURL(selectedFile)} alt="Selected File Preview" />
          ) : (
            <video controls>
              <source src={URL.createObjectURL(selectedFile)} type={selectedFile.type} />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      )}
  </div>

  </div>

                      <div className='span1'>
                          <div className=" x78zum5 xl56j7k x1rfph6h x6ikm8r x10wlt62">
                            <div className='im1'><span className=" x1c4vz4f x2lah0s x1emribx">
                              <img
                                height="14"
                                width="14"
                                alt=""
                              
                                src="https://static.xx.fbcdn.net/rsrc.php/v3/yd/r/Y4mYLVOhTwq.png?_nc_eui2=AeE3OiHIcB4fLBpJ_rHbxxEbvPIN-OmHLJy88g346YcsnOnN58MWG55A_Gr-bVLFSXyGn13mMkgo-dhEwIFmvX8-"
                              />
                            </span></div>
                            </div>
                            <span className="humour" onClick={handleEmojisClick}>
                Humeur / activité
              </span>
                </div>
                
                {showEmojis && (
                  
                  <div className="emoji-container">
  
  <button className="close-button1" onClick={handleCloseClick}>❌</button>
    <span role="img" aria-label="Emoji 1" onClick={() => handleEmojiClick('😀')}>😀</span>
    <span role="img" aria-label="Emoji 2" onClick={() => handleEmojiClick('😂')}>😂</span>
    <span role="img" aria-label="Emoji 3" onClick={() => handleEmojiClick('😃')}>😃</span>
    <span role="img" aria-label="Emoji 4" onClick={() => handleEmojiClick('😄')}>😄</span>
    <span role="img" aria-label="Emoji 5" onClick={() => handleEmojiClick('😅')}>😅</span>
    <span role="img" aria-label="Emoji 6" onClick={() => handleEmojiClick('😆')}>😆</span>
    <span role="img" aria-label="Emoji 7" onClick={() => handleEmojiClick('😉')}>😉</span>
    <span role="img" aria-label="Emoji 8" onClick={() => handleEmojiClick('😊')}>😊</span>
    <span role="img" aria-label="Emoji 9" onClick={() => handleEmojiClick('😋')}>😋</span>
    <span role="img" aria-label="Emoji 10" onClick={() => handleEmojiClick('😎')}>😎</span>
    <span role="img" aria-label="Emoji 11" onClick={() => handleEmojiClick('😍')}>😍</span>
    <span role="img" aria-label="Emoji 12" onClick={() => handleEmojiClick('😘')}>😘</span>
    <span role="img" aria-label="Emoji 13" onClick={() => handleEmojiClick('🥰')}>🥰</span>
    <span role="img" aria-label="Emoji 14" onClick={() => handleEmojiClick('😗')}>😗</span>
    <span role="img" aria-label="Emoji 15"onClick={() => handleEmojiClick('😙')}>😙</span>
    <span role="img" aria-label="Emoji 16"onClick={() => handleEmojiClick('😀')}>😚</span>
    <span role="img" aria-label="Emoji 17" onClick={() => handleEmojiClick('🤗')}>🤗</span>
    <span role="img" aria-label="Emoji 17" onClick={() => handleEmojiClick('👰‍♀️')}>👰‍♀️</span>
    <span role="img" aria-label="Emoji 1" onClick={() => handleEmojiClick('👰‍♀️')}>👰</span>
    <span role="img" aria-label="Emoji 2" onClick={() => handleEmojiClick('👨‍🦲')}>👨‍🦲</span>
    <span role="img" aria-label="Emoji 3" onClick={() => handleEmojiClick('👨‍🚀')}>👨‍🚀</span>
    <span role="img" aria-label="Emoji 4" onClick={() => handleEmojiClick('🦄')}>🦄</span>
    <span role="img" aria-label="Emoji 5" onClick={() => handleEmojiClick('🐴')}>🐴</span>
    <span role="img" aria-label="Emoji 6" onClick={() => handleEmojiClick('🐗')}>🐗</span>
    <span role="img" aria-label="Emoji 7" onClick={() => handleEmojiClick('🐺')}>🐺</span>
    <span role="img" aria-label="Emoji 8" onClick={() => handleEmojiClick('🐠')}>🐠</span>
    <span role="img" aria-label="Emoji 9" onClick={() => handleEmojiClick('🐡')}>🐡</span>
    <span role="img" aria-label="Emoji 10" onClick={() => handleEmojiClick('🌩️')}>🌩️</span>
    <span role="img" aria-label="Emoji 11" onClick={() => handleEmojiClick('⛈️')}>⛈️</span>
    <span role="img" aria-label="Emoji 12" onClick={() => handleEmojiClick('🌧️')}>🌧️</span>
    <span role="img" aria-label="Emoji 13" onClick={() => handleEmojiClick('🌦️')}>🌦️</span>
    <span role="img" aria-label="Emoji 14" onClick={() => handleEmojiClick('🐚')}>🐚</span>
    <span role="img" aria-label="Emoji 15"onClick={() => handleEmojiClick('🌷')}>🌷</span>
    <span role="img" aria-label="Emoji 16"onClick={() => handleEmojiClick('🌹')}>🌹</span>
    <span role="img" aria-label="Emoji 17" onClick={() => handleEmojiClick('🐣')}>🐣</span>

    <span role="img" aria-label="Emoji 1" onClick={() => handleEmojiClick('🐦')}>🐦</span>
    <span role="img" aria-label="Emoji 2" onClick={() => handleEmojiClick('🐸')}>🐸</span>
    <span role="img" aria-label="Emoji 3" onClick={() => handleEmojiClick('🐽')}>🐽</span>
    <span role="img" aria-label="Emoji 4" onClick={() => handleEmojiClick('🐷')}>🐷</span>
    <span role="img" aria-label="Emoji 5" onClick={() => handleEmojiClick('🐮')}>🐮</span>
    <span role="img" aria-label="Emoji 6" onClick={() => handleEmojiClick('🦁')}>🦁</span>
    <span role="img" aria-label="Emoji 7" onClick={() => handleEmojiClick('🐯')}>🐯</span>
    <span role="img" aria-label="Emoji 8" onClick={() => handleEmojiClick('🐨')}>🐨</span>
    <span role="img" aria-label="Emoji 9" onClick={() => handleEmojiClick('🐻‍❄️')}>🐻‍❄️</span>
    <span role="img" aria-label="Emoji 10" onClick={() => handleEmojiClick('🐼')}>🐼</span>
    <span role="img" aria-label="Emoji 11" onClick={() => handleEmojiClick('🐻')}>🐻</span>
    <span role="img" aria-label="Emoji 12" onClick={() => handleEmojiClick('🦊')}>🦊</span>
    <span role="img" aria-label="Emoji 13" onClick={() => handleEmojiClick('🐰')}>🐰</span>
    <span role="img" aria-label="Emoji 14" onClick={() => handleEmojiClick('🐹')}>🐹</span>
    <span role="img" aria-label="Emoji 15"onClick={() => handleEmojiClick('🐭')}>🐭</span>
    <span role="img" aria-label="Emoji 16"onClick={() => handleEmojiClick('🐱')}>🐱</span>
    <span role="img" aria-label="Emoji 17" onClick={() => handleEmojiClick('🐶')}>🐶</span>
    <span role="img" aria-label="Emoji 17" onClick={() => handleEmojiClick('🐺')}>🐺</span>
    <span role="img" aria-label="Emoji 1" onClick={() => handleEmojiClick('🐗')}>🐗</span>
    <span role="img" aria-label="Emoji 2" onClick={() => handleEmojiClick('🐴')}>🐴</span>
    <span role="img" aria-label="Emoji 3" onClick={() => handleEmojiClick('🦄')}>🦄</span>
    <span role="img" aria-label="Emoji 4" onClick={() => handleEmojiClick('🐝')}>🐝</span>
    <span role="img" aria-label="Emoji 5" onClick={() => handleEmojiClick('🐛')}>🐛</span>
    <span role="img" aria-label="Emoji 6" onClick={() => handleEmojiClick('🦋')}>🦋</span>
    <span role="img" aria-label="Emoji 7" onClick={() => handleEmojiClick('🐌')}>🐌</span>
    <span role="img" aria-label="Emoji 8" onClick={() => handleEmojiClick('🐞')}>🐞</span>
    <span role="img" aria-label="Emoji 9" onClick={() => handleEmojiClick('🐜')}>🐜</span>
    <span role="img" aria-label="Emoji 10" onClick={() => handleEmojiClick('🦗')}>🦗</span>
    <span role="img" aria-label="Emoji 11" onClick={() => handleEmojiClick('🕷️')}>🕷️</span>
    <span role="img" aria-label="Emoji 12" onClick={() => handleEmojiClick('🦂')}>🦂</span>
    <span role="img" aria-label="Emoji 13" onClick={() => handleEmojiClick('🦟')}>🦟</span>
    <span role="img" aria-label="Emoji 14" onClick={() => handleEmojiClick('🦠')}>🦠</span>
    <span role="img" aria-label="Emoji 15"onClick={() => handleEmojiClick('🌸')}>🌸</span>
    <span role="img" aria-label="Emoji 16"onClick={() => handleEmojiClick('💐')}>💐</span>
    <span role="img" aria-label="Emoji 17" onClick={() => handleEmojiClick('🌹')}>🌹</span>
    <span role="img" aria-label="Emoji 17" onClick={() => handleEmojiClick('🌺')}>🌺</span>
    <span role="img" aria-label="Emoji 1" onClick={() => handleEmojiClick('🌻')}>🌻</span>
    <span role="img" aria-label="Emoji 2" onClick={() => handleEmojiClick('🌼')}>🌼</span>
    <span role="img" aria-label="Emoji 3" onClick={() => handleEmojiClick('🌷')}>🌷</span>
    <span role="img" aria-label="Emoji 4" onClick={() => handleEmojiClick('🌱')}>🌱</span>
    <span role="img" aria-label="Emoji 5" onClick={() => handleEmojiClick('🌲')}>🌲</span>
    <span role="img" aria-label="Emoji 6" onClick={() => handleEmojiClick('🌳')}>🌳</span>
    <span role="img" aria-label="Emoji 7" onClick={() => handleEmojiClick('🌴')}>🌴</span>
    <span role="img" aria-label="Emoji 8" onClick={() => handleEmojiClick('🌵')}>🌵</span>
    <span role="img" aria-label="Emoji 9" onClick={() => handleEmojiClick('🌾')}>🌾</span>
    <span role="img" aria-label="Emoji 10" onClick={() => handleEmojiClick('🌿')}>🌿</span>
    <span role="img" aria-label="Emoji 11" onClick={() => handleEmojiClick('☘️')}>☘️</span>
    <span role="img" aria-label="Emoji 12" onClick={() => handleEmojiClick('🍀')}>🍀</span>
    <span role="img" aria-label="Emoji 13" onClick={() => handleEmojiClick('🍁')}>🍁</span>
    <span role="img" aria-label="Emoji 14" onClick={() => handleEmojiClick('🍂')}>🍂</span>
    <span role="img" aria-label="Emoji 15"onClick={() => handleEmojiClick('🍃')}>🍃</span>
    <span role="img" aria-label="Emoji 16"onClick={() => handleEmojiClick('🍄')}>🍄</span>
    <span role="img" aria-label="Emoji 17" onClick={() => handleEmojiClick('🌰')}>🌰</span>
    <span role="img" aria-label="Emoji 17" onClick={() => handleEmojiClick('🦀')}>🦀</span>
    <span role="img" aria-label="Emoji 1" onClick={() => handleEmojiClick('🦞')}>🦞</span>
    <span role="img" aria-label="Emoji 2" onClick={() => handleEmojiClick('🦐')}>🦐</span>
    <span role="img" aria-label="Emoji 3" onClick={() => handleEmojiClick('🦑')}>🦑</span>
    <span role="img" aria-label="Emoji 4" onClick={() => handleEmojiClick('🦪')}>🦪</span>
     

  
  </div>
                )}
                      {/* </div>
                    </div> */}
                  {/* </div> */}
            
          </form>
        {/* </div> */}

  <div className='Posts'>
    {data.map((Post) => (
      <div key={Post.id} className='post'>
        <div className='post-details'>
          <p className='posted-by'>{Post.PostedBy}</p>
          <p className='post-text'>{Post.text}</p>
        </div>
            <div className='like-dislike'>
                  <button onClick={() => handleLike(Post.id)}>
                    Like ({Post.likesCount})
                  </button>
                  <button onClick={() => handleDislike(Post.id)}>
                    Dislike ({Post.dislikesCount})
                  </button>
            </div>
        {Post.img && <img src={Post.img} alt='Posted' className='posted-image' />}
        <input onKeyDown={(e) => add2(e, Post)} placeholder='Comment' />
        
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
    );
  }

  export default Posts