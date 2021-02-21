from flask import Flask, send_from_directory, jsonify, request, make_response
import os
from flask_restful import Resource, Api, reqparse
from database import user_list

app = Flask(__name__)


# removes the console error saying there is no favicon found.
@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')


# default location when local host is opened (127.0.0.0:5000)
@app.route('/')
def main_application():
    return app.send_static_file('users.html')


# points to css for the web page
@app.route('/css/<file>')
def send_css(file):
    return app.send_static_file('css/' + file)


# points to the js for the web page
@app.route('/js/<file>')
def send_js(file):
    return app.send_static_file('js/' + file)


@app.route('/api/users', methods=['GET'])
def get_users():
    page_num = int(request.args['page']) - 1
    user_slice = user_list[page_num * 6:(page_num + 1) * 6]
    return jsonify({
        "per_page": 6,
        "page": page_num + 1,
        "total": len(user_list),
        "total_pages": (len(user_list) + 5) // 6,
        "data": user_slice
    })


@app.route('/api/users/user<user_id>', methods=['GET'])
def get_single_user(user_id):
    for user in user_list:
        if str(user_id) == str(user['user_id']):
            return user


@app.route('/api/users', methods=['POST'])
def new_user():
    parser = reqparse.RequestParser()

    parser.add_argument('email', required=True)
    parser.add_argument('first_name', required=True)
    parser.add_argument('last_name', required=True)
    parser.add_argument('avatar', required=True)

    args = parser.parse_args()

    user = {
        # 'user_id': args['user_id'],
        'email': args['email'],
        'first_name': args['first_name'],
        'last_name': args['last_name'],
        'avatar': args['avatar']
    }

    user_list.append(user)

    for i in range(len(user_list)):
        user_list[i]['user_id'] = i + 1

    return user, 201


@app.route('/api/users/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    for user in user_list:
        if str(user_id) == str(user['user_id']):
            user_list.remove(user)

            for i in range(len(user_list)):
                user_list[i]['user_id'] = i + 1

            return 'User removed', 204


@app.route('/api/users/<user_id>', methods=['PUT'])
def edit_user(user_id):
    for i in user_list:
        if str(user_id) == str(i['user_id']):
            user = i

    user_index = user_list.index(user)

    parser = reqparse.RequestParser()
    parser.add_argument('email', required=True)
    parser.add_argument('first_name', required=True)
    parser.add_argument('last_name', required=True)
    parser.add_argument('avatar', required=True)

    args = parser.parse_args()

    user = {
        'user_id': user_id,
        'email': args['email'],
        'first_name': args['first_name'],
        'last_name': args['last_name'],
        'avatar': args['avatar']
    }

    user_list[user_index] = user

    return user, 200


if __name__ == '__main__':
    app.run()
