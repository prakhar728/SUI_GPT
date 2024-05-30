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
  const [loading, setloading] = useState(false);


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
    setloading(true);

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
      ];

      setConversations([...conversations, ...converstaion]);
      setloading(false);
    })
    .catch(err => {
      console.log(err);
    })
    .finally(() => {
      setloading(false);
    })
  }


  function formatAnswer(rawString) {
    // Split the string into separate sections based on line breaks
    const sections = rawString.split(/\r?\n\n/);
  
    // Define an empty array to store the formatted answer parts
    const formattedAnswer = [];
  
    for (const section of sections) {
      // Check if the section contains a code block
      if (section.startsWith('```')) {
        // Extract the code block (everything between the opening and closing markers)
        const codeBlock = section.slice(3, section.length - 3);
  
        // Wrap the code block in a separate element (e.g., a div)
        formattedAnswer.push(<div className="code-block"><pre><code>{codeBlock}</code></pre></div>);
      } else {
        // If not a code block, treat it as regular text
        formattedAnswer.push(<p>{section}</p>);
      }
    }
  
    // Return the formatted answer as an array of React elements
    return formattedAnswer;
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
            
            <div ref={convo} className={`conversation ${currentChat.length ? 'active-chat': ''}` }>
              {conversations.map((conversation, index) => {
                if (conversation.author == 'user')
                  return <Human data={conversation.message} key={index}/>
                else
                  return <AI data={formatAnswer(conversation.message)} key={index}/>
              })}

            </div>
          </div>

          <div className="prompt-wrapper">
              <Input user={user} currentChat={currentChat} query={query} loading={loading} setloading={setloading}/>
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
