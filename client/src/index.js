import { io } from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

const socket = io('http://localhost:1337', {
  transports: ['websocket']
});

root.render(
  <App socket={socket}/>
);
