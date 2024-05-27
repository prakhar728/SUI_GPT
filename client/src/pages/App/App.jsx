import { useEffect, useRef, useState } from 'react'

import './App.css';
import Header from '../../components/Header/Header';
import NewChat from '../../components/NewChat/NewChat';
import ChatTitle from '../../components/ChatTitle/ChatTitle';
import Human from '../../components/Conversation/Human';
import AI from '../../components/Conversation/AI';
import Input from '../../components/Input/Input';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../js/auth';
import SignIn from '../../components/SignIn/SignIn';
import { getAllChats, getChat, newChat, queryModel } from '../../js/api';

function App() {

  const convo = useRef(null);
  const [user, setUser] = useState(null);
  const [currentChat, setcurrentChat] = useState("");
  const [chatTitles, setChatTitles] = useState([]);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);


  useEffect(() => {
    if (user) {
      populateData();
    } else {
      setChatTitles([]);
      setConversations([]);
      setcurrentChat([]);
    }
  }, [user]);


  useEffect(() => {
    if (currentChat) {
      fetchConversation();
    }
  }, [currentChat]);


  const populateData = async () => {
    getAllChats(user.uid)
    .then(res => {
      setChatTitles(res.data.chats);
    })
    .catch(err => {
      console.log(err);
    });
  }


  const getNewChat = async () => {
    if (user)
      newChat(user.uid)
      .then(res => {
        setcurrentChat(res.data.id);
      })
      .catch(err => {
        console.log("Error while trying to create a new chat", err);
      })
  }

  const scrollToBottom = () => {
    if (convo.current) {
      convo.current.scrollTop = convo.current.scrollHeight;
    }
  }


  const fetchConversation = async () => {
    if (user) {
      getChat(user.uid, currentChat)
      .then(res => {
        setConversations(res.data.chat.conversation);
        scrollToBottom();
      })
      .catch(err => {
        console.log("Error while trying to fetch chat", err);
      })
    }
  }


  const query = async (query) => {
    queryModel(user.uid, currentChat, query)
    .then(res => {
      let converstaion = [{
        'author': 'user',
        'message': query
      }, 
      {
        'author': 'model',
        'message': res.data.response
      }
    ]

      setConversations([...conversations, ...converstaion]);
    })
    .catch(err => {
      console.log(err);
    })
  }


  return (
    <>
      <div className={`app ${user ? '' : 'blur'}` }>
        <div className="all-chats">
          <NewChat onClick={getNewChat} user={user}  currentChat={currentChat} setcurrentChat={setcurrentChat}/>

          <div className="previous-chats">

            {chatTitles.map((chat, index) => 
              <ChatTitle chat={chat} key={index} currentChat={currentChat} setcurrentChat={setcurrentChat}/>
            )}
            
          </div>
        </div>
        <div className="chat-screen">
          <div className="current-conversation">
            <Header user={user}/>
            
            <div ref={convo} className='conversation'>
              {conversations.map((conversation, index) => {
                if (conversation.author == 'user')
                  return <Human data={conversation.message} key={index}/>
                else
                  return <AI data={conversation.message} key={index}/>
              })}

            </div>
          </div>

          <div className="prompt-wrapper">
              <Input user={user} currentChat={currentChat} query={query}/>
          </div>
        </div>

      </div>
        {!user &&
        <SignIn />
        }
      </>
  )
}

export default App
