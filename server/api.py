from flask import Flask, request
from flask_restful import Resource, Api, reqparse
from Db import connect_to_db

app = Flask(__name__)
api = Api(app)

collection = connect_to_db()

class ChatModel(Resource):
    def get(self, chat_id):
        parser = reqparse.RequestParser()
        parser.add_argument('data', type=str, required=True, help="Query can't be blank")
        args = parser.parse_args()




class RAGModel(Resource):
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('data', type=str, required=True, help="Query can't be blank")
        args = parser.parse_args()

        print(args)
        return {'hello': 'world'}

api.add_resource(RAGModel, '/')

if __name__ == '__main__':
    app.run(debug=True)