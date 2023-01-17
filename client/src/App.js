import { useState } from 'react';
import './App.css';
import { UserList } from './components/userList/userList';
import { VideoContainer } from './components/videoContainer/videoContainer';

function App(props) {
  const { socket } = props;
  const [clients, setClients] = useState([]);
  const [isAlreadyCalling, setIsAlreadyCalling] = useState(false);
  const { RTCPeerConnection, RTCSessionDescription } = window;
  const peerConnection = new RTCPeerConnection();

  socket.on('connect', () => {
    console.log(socket.id);
  });
  
  socket.on('update-user-list', ({users}) => {
    setClients([...clients, ...users]);
  });

  socket.on('remove-user', ({socketId}) => {
    setClients(clients.filter(client => client !== socketId))
  });

  socket.on('call-made', async data => {
    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(data.offer)
    );
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(new RTCSessionDescription(answer));
    
    socket.emit('make-answer', {
      answer,
      to: data.socket
    });
  });

  socket.on('answer-made', async data => {
    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(data.answer)
    );
    
    if (!isAlreadyCalling) {
      callUser(data.socket);
      setIsAlreadyCalling(!isAlreadyCalling);
    }
   });

  const callUser = async (socketId) => {
    console.log('handle');
    try {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(new RTCSessionDescription(offer));
      console.log(offer);
      
      socket.emit('call-user', {
        offer,
        to: socketId
      })
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="App">
      <UserList list={clients} handleClick={callUser}/>
      <VideoContainer />
      {/* <Camera /> */}
    </div>
  );
}

export default App;
