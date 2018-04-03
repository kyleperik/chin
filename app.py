from flask import Flask, render_template, request, redirect
from flask_socketio import SocketIO, emit

import globals

import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@app.route('/')
def index():
    chat = open('chat.txt').read()
    return render_template('index.html', chat=chat, watchers=globals.watchers)

@socketio.on('connect')
def connect():
    globals.watchers += 1
    emit('watchers', globals.watchers, broadcast=True)

@socketio.on('disconnect')
def disconnect():
    globals.watchers -= 1
    emit('watchers', globals.watchers, broadcast=True)

@socketio.on('message')
def postchat(message):
    print('messaged: ', message)
    open('chat.txt', 'a').write(message + '\n')
    emit('chat', message, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5678)
