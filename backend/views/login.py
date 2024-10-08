from flask import Blueprint, request, jsonify, session
# from models.user_model import db, User
from backend import db
from backend.models.user import User


login = Blueprint('login', __name__)

@login.route('/login', methods=['POST'])
def login_view():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'error': 'All fields are required'}), 400
    
    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        print(session)

        session['user_id'] = user.id
        print(session)

        print(f"Session after login: {session}")
        response = jsonify({'message': 'Login successful!', 'user_id': user.id})
        response.set_cookie('session', 'your_session_id', samesite='None', secure=True)
        return response, 200
    else:
        return jsonify({'error': 'Invalid email or password'}), 401
