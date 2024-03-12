import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { Toaster, toast } from 'react-hot-toast';
const socket = io('http://localhost:8080');
function App() {
  const [messages, setMessages] = useState<
    {
      message: string;
      id: string;
      username: string;
      time: string;
      date: string;
    }[]
  >([]);
  const message = useRef<string>('');
  const messageRef = useRef<HTMLInputElement>(null);
  const username = useRef<string>('');
  const roomID = useRef<string>('');

  const sendMessage = () => {
    if (!message.current) return;
    if (!username.current) {
      toast.error('Cannot send messages without username');
      document.getElementById('username')?.focus();
      return;
    }
    setMessages((messages) => [
      ...messages,
      {
        message: message.current,
        id: Date.now().toString(),
        username: username.current,
        time: new Date().toLocaleTimeString(),
        date: new Date().toLocaleDateString(),
      },
    ]);
    socket.emit('new_message', {
      message: message.current,
      id: Date.now().toString(),
      username: username.current,
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
    });
    messageRef!.current!.value = '';
  };
  useEffect(() => {
    socket.on('receive_message', (message) => {
      setMessages((messages) => [...messages, message]);
    });
  }, [socket]);
  return (
    <div className='h-dvh bg-gray-100 w-full p-3 md:w-1/3 gap-4 md:mx-auto flex flex-col'>
      <Toaster />
      <section className='flex flex-col md:flex-row justify-between gap-2 w-full'>
        <div className='flex gap-2 w-1/2'>
          <input
            id='username'
            className='input-primary w-full'
            placeholder='Enter Username...'
            onChange={(e) => (username.current = e.target.value)}
          />
        </div>

        <div className='flex gap-2 w-1/2'>
          <input
            className='flex-1 input-primary w-full  '
            placeholder='Room ID'
            onChange={(e) => (roomID.current = e.target.value)}
          />
          <button
            className='btn-primary rounded'
            onClick={() => socket.emit('join_room', roomID.current)}
          >
            Join
          </button>
        </div>
      </section>
      <section className='flex-1 bg-gray-50 h-full overflow-auto p-3 rounded-md shadow'>
        {messages.map((message) => (
          <div
            className={`flex flex-col flex-1 gap-1 ${
              message.username === username.current && 'items-end'
            }`}
            key={message.id}
          >
            <div className='text-gray-500 text-sm'> {message.username}</div>
            <div
              className={
                message.username === username.current
                  ? 'sender-message'
                  : 'reciever-message'
              }
            >
              {message.message}
            </div>
            <div className='text-xs text-gray-500'>
              {message.date} {message.time}
            </div>
          </div>
        ))}
      </section>
      <section className='h-10 rounded-md mt-auto bg-gray-200 flex gap-2'>
        <input
          autoFocus
          id='message'
          ref={messageRef}
          className='h-full bg-transparent flex-1 outline-none p-3'
          type='text'
          name='message'
          onChange={(e) => (message.current = e.target.value)}
          placeholder='Enter your message...'
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <button className='btn-primary' onClick={sendMessage}>
          Send
        </button>
      </section>
    </div>
  );
}

export default App;
