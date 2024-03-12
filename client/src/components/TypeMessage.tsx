function TypeMessage({
  messageRef,
  message,
  sendMessage,
}: {
  messageRef: React.RefObject<HTMLInputElement>;
  message: React.MutableRefObject<string>;
  sendMessage: () => void;
}) {
  return (
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
  );
}

export default TypeMessage;
