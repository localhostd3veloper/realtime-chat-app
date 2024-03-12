import React from 'react';
import { getFormattedTime } from '../utils/time';
import { IMessage } from '../interfaces/message.interface';

function MessageList({
  messages,
  username,
  roomID,
}: {
  messages: IMessage[];
  username: React.MutableRefObject<string>;
  roomID: React.MutableRefObject<string>;
}) {
  return (
    <section
      id='messages'
      className='flex-1 bg-gray-50 h-full overflow-auto p-3 rounded-md shadow'
    >
      {roomID.current && (
        <div className='text-gray-500 text-sm font-semibold'>
          Room ID: {roomID.current}
        </div>
      )}
      {messages.map((item) => {
        if (item.type === 'join')
          return (
            <div
              className='text-gray-500 text-sm font-medium text-center'
              key={item.id}
            >
              {item.message}
            </div>
          );
        else
          return (
            <div
              className={`flex flex-col flex-1 gap-1 ${
                item.username === username.current
                  ? 'sender-message-animate items-end'
                  : 'reciever-message-animate items-start'
              }`}
              key={item.id}
            >
              <div className='text-gray-500 text-sm font-semibold'>
                {item.username}
              </div>
              <div
                className={
                  item.username === username.current
                    ? 'sender-message'
                    : 'reciever-message'
                }
              >
                {item.message}
              </div>
              <div className='text-xs text-gray-500'>
                {getFormattedTime(item.date)}
              </div>
            </div>
          );
      })}
    </section>
  );
}

export default MessageList;
