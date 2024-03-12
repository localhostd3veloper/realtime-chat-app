import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { Toaster, toast } from 'react-hot-toast';
import { IMessage } from './interfaces/message.interface';

//components
import TypeMessage from './components/TypeMessage';
import MessageList from './components/MessageList';
import ChatHeader from './components/ChatHeader';
import { getMessageWithMetaData } from './utils/common';

const socket = io('http://localhost:8080');

function App() {
  // global state for messages
  const [messages, setMessages] = useState<IMessage[]>([]);

  // refs
  const message = useRef<string>('');
  const messageRef = useRef<HTMLInputElement>(null);
  const username = useRef<string>('');
  const roomID = useRef<string>('');

  /**
   * Function to send a message.
   */
  const sendMessage = () => {
    if (!message.current) return;
    if (!username.current) {
      toast.error(
        'Cannot send messages without username, please enter username first',
        {
          position: 'bottom-center',
        }
      );
      document.getElementById('username')?.focus();
      return;
    }
    const newMsg: IMessage = getMessageWithMetaData(
      message.current,
      username.current
    );

    // update messages global state
    setMessages((messages) => [...messages, newMsg]);

    // emit message to server
    socket.emit('new_message', { message: newMsg, roomID: roomID.current });

    // clear input
    messageRef!.current!.value = '';
  };

  // socket listeners
  useEffect(() => {
    // receive message
    socket.on('receive_message', (message: IMessage) => {
      setMessages((messages) => [...messages, message]);
    });

    // When a user joins
    socket.on('user_joined', (username) => {
      toast(`${username} joined the room!`);
      setMessages((messages) => [
        ...messages,
        {
          message: `${username} joined the room!`,
          type: 'join',
          date: new Date().toISOString(),
          id: Date.now().toString(),
          username,
        },
      ]);
    });

    return () => {
      socket.off('receive_message');
      socket.off('user_joined');
    };
  }, [socket]);
  /**
   * Function to join a room and emit a 'join_room' event.
   */
  const joinRoom = () => {
    socket.emit('join_room', {
      roomID: roomID.current,
      username: username.current,
    });
    setMessages((messages) => [
      ...messages,
      {
        message: `You've Joined Room ${roomID.current}`,
        type: 'join',
        date: new Date().toISOString(),
        id: Date.now().toString(),
        username: username.current,
      },
    ]);
  };
  return (
    <div className='h-dvh bg-gray-100 w-full p-3 md:max-w-[350px] gap-4 md:mx-auto flex flex-col'>
      <Toaster />
      <ChatHeader username={username} roomID={roomID} joinRoom={joinRoom} />
      <MessageList messages={messages} username={username} roomID={roomID} />
      <TypeMessage
        message={message}
        messageRef={messageRef}
        sendMessage={sendMessage}
      />
    </div>
  );
}

export default App;
