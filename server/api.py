from flask import Flask, request
from flask_restful import Resource, Api, reqparse
from bson.objectid import ObjectId

from Db import connect_to_db

app = Flask(__name__)
api = Api(app)

chat_collection = connect_to_db()


def new_chat(user_id):
    if user_id:
        chat = chat_collection.insert_one({
            'author': user_id,
            'title': 'Random_Title',
            'conversation': []
        })

        return chat.inserted_id


def insert_chat(user_type, author, chat_id, message):
    if user_type != 'model':
        chat = chat_collection.find_one({'_id': ObjectId(chat_id)})
        

        if chat['author'] == author:
            chat['conversation'].append({
                'author': 'user',
                'message': message
            })

            chat_collection.update_one({'_id': ObjectId(chat_id)}, {"$set": chat})

            return {'result': 'inserted'}, 200
    else:
        chat = chat_collection.find_one({'_id': ObjectId(chat_id)})
        print(chat, author)
        if chat['author'] == author:
            chat['conversation'].append({
                'author': 'ai',
                'message': message
            })

            chat_collection.update_one({'_id': ObjectId(chat_id)}, {"$set": chat})

            return {'result': 'inserted'}, 200


class Chats(Resource):
    def get(self):
        user_id = request.headers.get('user-id')
        
        titles = []
        for chats in chat_collection.find({'author': user_id}):
            titles.append(chats['title'])

        return {'chats': titles}


class ChatModel(Resource):
    def get(self, chat_id):
        user_id = request.headers.get('user-id')

        if chat_id == 'new':
            new_id = new_chat(user_id)

            return {'id': str(new_id)}
        
        if chat_id:
            chat = chat_collection.find_one({'_id': ObjectId(chat_id)})

            chat['_id'] = str(chat['_id'])
        return {'chat': chat}


class RAGModel(Resource):
    def get(self, chat_id):
        user_id = request.headers.get('user-id')

        parser = reqparse.RequestParser()
        parser.add_argument('query', type=str, required=True, help="Query can't be blank")
        args = parser.parse_args()

        query = args['query']

        insert_chat('user', user_id, chat_id, query)

        response = 'Hi I am a model'

        insert_chat('model', user_id, chat_id, response)
        
        return {'response': response}

api.add_resource(RAGModel, '/query/<string:chat_id>')
api.add_resource(ChatModel, '/chat/<string:chat_id>')
api.add_resource(Chats, '/chats')

if __name__ == '__main__':
    app.run(debug=True)