import { useSelector, useDispatch } from "react-redux";
// import { getCurrentChat } from "../../../store/chat";
import { useState } from "react";
import "./chatbox.css";
import { _getCurrentUser } from "../../../store/session";
import {useParams} from 'react-router-dom'

import {fetchMessages, getAllMessages, addMessage } from '../../../store/messages'
import { useEffect } from "react";

function ChatBox() {

  const dispatch = useDispatch()

  const currentUser = useSelector(_getCurrentUser);
  // const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const {topicId} = useParams()
  const [authorNames, setAuthorNames] = useState({});
  const [timetoFetch, setTimetoFetch] = useState(true);
  const storeMessages = useSelector(getAllMessages());
  // const latestMessage = getLatestMessage(chatId)
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  };

  useEffect(() => {
     const timer = setInterval(() => {
      setTimetoFetch(true);
    }, 15000);

    return () => {
      clearInterval(timer);
    }

  }, [])

  useEffect(() => {
    const authorObj = {};
    authorObj[currentUser._id] = "You";
    let i = 1;
    for(let msg of storeMessages) {
      if(!authorObj[msg.sender]) {
        authorObj[msg.sender] = `User ${i}`;
        i += 1;
      }
    }
    setAuthorNames({...authorObj});


  }, [storeMessages.length])

  useEffect(()=>{
    if(timetoFetch) {
      dispatch(fetchMessages(topicId)).then(() => {
        setTimetoFetch(false);  
      })
 
    }

  setLoading(false);
    let objDiv = document.getElementById("chat-messages");
     objDiv.scrollTop = objDiv.scrollHeight;

  },[timetoFetch])

  useEffect(()=>{
      dispatch(fetchMessages(topicId)).then(() => {
        setTimetoFetch(false);   
    })

  setLoading(false);
    let objDiv = document.getElementById("chat-messages");
     objDiv.scrollTop = objDiv.scrollHeight;

  },[currentUser, topicId])


window.currentUser = currentUser;
window.loading = loading;
window.storeMessages = storeMessages;


  const handleClick = (e) => {
    if (e.type === 'keydown' && e.key === "Enter" && newMessage) {
 
     dispatch(addMessage(topicId, newMessage)).then(res => setTimetoFetch(true))
      
      setNewMessage("");
    } else if (e.type === 'click' && newMessage) {
      e.preventDefault();
     dispatch(addMessage(topicId, newMessage)).then((res) =>
       setTimetoFetch(true)
     );

      setNewMessage("");
    }
  };
let color;

  return (
    <>
        <div id="chat-messages">
          {storeMessages.map((message)=> {
              {message.sender === currentUser._id
                ? (color = "#FBD8B0")
                : (color = "#D5F1F3");}
           return (
             !!message._id && (
               <div className="chat-inner-container" style={{ backgroundColor: color }}>
                 <div
                   className="chat-message-user"
                   key={message._id}
                  //  style={{ color: color }}
                 >
                   {authorNames[message.sender]} said:
                 </div>
                 <div className="chat-message-body">{message.content}</div>
               </div>
             )
           );})
        }
        </div>
      <form
        className="chat-container"
        onKeyDown={handleClick}
        isRequired
        mt={3}
      >
        <textarea
          className="chat-text"
          variant="filled"
          bg="f8f8f8"
          placeholder="be heard..."
          onChange={typingHandler}
          value={newMessage}
        />
        <button
          className="chat-send-button"
          onClick={handleClick}
        >
          send
        </button>
      </form>
      </>
  );
}

export default ChatBox;
