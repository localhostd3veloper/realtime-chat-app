import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { Toaster, toast } from 'react-hot-toast';
import { IMessage } from './interfaces/message.interface';

//components
import TypeMessage from './components/TypeMessage';
import MessageList from './components/MessageList';

// modals
import UserInviteModal from './components/UserInviteModal';
import CreateRoomModal from './components/CreateRoomModal';

import { getMessageWithMetaData } from './utils/common';

// socket
const socket = io('http://localhost:8080');

function App() {
  // global state for messages
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [createRoomModal, setCreateRoomModal] = useState(false);
  const [userInviteModal, setUserInviteModal] = useState(false);

  // refs
  const message = useRef<string>('');
  const messageRef = useRef<HTMLInputElement>(null);
  const username = useRef<string>('');
  const roomID = useRef<string>('');
  const paramsRoomID = new URLSearchParams(window.location.search).get(
    'room-id'
  );
  const paramsUsername = new URLSearchParams(window.location.search).get(
    'username'
  );
  // Join Room using room id
  useEffect(() => {
    // if username and room id are present in url
    if (paramsUsername && paramsRoomID) {
      username.current = paramsUsername;
      roomID.current = paramsRoomID;
      joinRoom();
      return;
    }

    // if username is not present in url, he/she is invited
    if (paramsRoomID) {
      roomID.current = paramsRoomID;
      if (!username.current) {
        setUserInviteModal(true);
      } else {
        joinRoom();
      }
    }

    // if both username and room id are not present in url
    if (!paramsRoomID && !paramsUsername) {
      setCreateRoomModal(true);
    }
  }, [paramsRoomID]);

  // socket listeners
  useEffect(() => {
    // receive message
    socket.on('receive_message', (message: IMessage) => {
      console.log(message);
      setMessages((messages) => [...messages, message]);
    });

    // When a user joins
    socket.on('user_joined', (username) => {
      toast.success(`${username} joined the room!`);
      setMessages((messages) => [
        ...messages,
        {
          message: `${username} just arrived! Say hi!`,
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
        message: `You've Joined Room ${roomID.current}, Say hi!`,
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
      <section className='flex justify-between'>
        <button
          className='btn-primary rounded py-2 font-semibold'
          onClick={() => setCreateRoomModal(true)}
        >
          + Create Room
        </button>
        <button
          className='btn-primary rounded py-2 font-semibold'
          onClick={() => {
            navigator.clipboard.writeText(
              window.location.href.split('?')[0] + '?room-id=' + roomID.current
            );
            toast.success('Room Link Copied!', {
              position: 'top-right',
            });
          }}
        >
          Copy Link
        </button>
      </section>
      <MessageList messages={messages} username={username} roomID={roomID} />
      <TypeMessage
        message={message}
        messageRef={messageRef}
        sendMessage={sendMessage}
      />
      <UserInviteModal
        joinRoom={joinRoom}
        roomID={roomID.current}
        isOpen={userInviteModal}
        username={username}
        closeModal={() => setUserInviteModal(false)}
      />
      <CreateRoomModal
        username={username}
        roomID={roomID}
        isOpen={createRoomModal}
        closeModal={() => setCreateRoomModal(false)}
      />
    </div>
  );
}

export default App;
