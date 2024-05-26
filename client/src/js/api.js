import axios from 'axios';

const baseURL = 'http://127.0.0.1:5000/';

const api = axios.create({
    baseURL: baseURL,
    timeout: 1000,
    headers: {'X-Custom-Header': 'foobar'}
  });


  const getChat = (id) => {
    axios.get(`/chat/${id}`)
    .then(function (response) {
        // handle success
        console.log(response);

        return response;
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    });
  }


  const newChat = () => {
    axios.get('/chat/new')
    .then(function (response) {
        // handle success
        console.log(response);

        return response;
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    });
  }


  const getAllChats = () => {
    axios.get('/chats')
    .then(function (response) {
        // handle success
        console.log(response);

        return response;
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    });
  }


  const queryModel = (chatId, query) => {
    axios.get(`/query/${chatId}`, {
        "query": query
    })
    .then(function (response) {
        // handle success
        console.log(response);

        return response;
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    });
}