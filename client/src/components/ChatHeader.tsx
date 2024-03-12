import React from 'react';

function ChatHeader({
  username,
  roomID,
  joinRoom,
}: {
  username: React.MutableRefObject<string>;
  roomID: React.MutableRefObject<string>;
  joinRoom: () => void;
}) {
  return (
    <section className='flex justify-between gap-2 w-full'>
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
        <button className='btn-primary rounded' onClick={joinRoom}>
          Join
        </button>
      </div>
    </section>
  );
}

export default ChatHeader;
