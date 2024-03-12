import Modal from 'react-responsive-modal';

function UserInviteModal({
  isOpen,
  closeModal,
  joinRoom,
  roomID,
  username,
}: {
  isOpen: boolean;
  closeModal: () => void;
  joinRoom: () => void;
  username: React.MutableRefObject<string>;
  roomID: string;
}) {
  return (
    <Modal
      classNames={{
        modal: 'rounded-md',
      }}
      center
      open={isOpen}
      onClose={closeModal}
    >
      <div className='flex flex-col  p-5 gap-2 justify-center items-center'>
        <p className='text-lg font-medium text-gray-700'>
          You've been invited to chat in {roomID}
        </p>
        <p className='text-sm text-gray-500'>
          Your friends are waiting for you
        </p>
        <form
          onSubmit={(e) => e.preventDefault()}
          className='flex gap-2 w-full'
        >
          <input
            id='username'
            autoFocus
            className='input-primary flex-1'
            onChange={(e) => (username.current = e.target.value)}
            placeholder='Enter Username...'
          />
          <button
            type='submit'
            className='btn-primary rounded'
            onClick={() => {
              joinRoom();
              closeModal();
            }}
          >
            Join
          </button>
        </form>
      </div>
    </Modal>
  );
}

export default UserInviteModal;
