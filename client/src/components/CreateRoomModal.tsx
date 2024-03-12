import Modal from 'react-responsive-modal';
import { IRoomModal } from '../interfaces/room-modal.interface';

export default function CreateRoomModal({
  isOpen,
  closeModal,
  username,
  roomID,
}: IRoomModal) {
  return (
    <Modal
      center
      classNames={{
        modal: 'rounded-md',
      }}
      showCloseIcon={false}
      open={isOpen}
      onClose={closeModal}
    >
      <div className='flex flex-col gap-3 justify-center rounded-md text-gray-800'>
        <p className='text-2xl font-semibold flex items-center'>
          <span className='material-symbols-outlined text-green-600 text-6xl'>
            chat
          </span>
          Realtime Chat Demo App
        </p>
        <p className='text-xl font-medium '>Create New Room</p>
        <p className='text-sm text-gray-500'>
          Enter Username and Room ID to create a new room
        </p>
        <form
          onSubmit={(e) => {
            window.location.assign(
              `/?username=${username.current}&room-id=${roomID.current}`
            );
            e.preventDefault();
          }}
          className='flex flex-col gap-5 w-full'
        >
          <input
            id='username'
            className='input-primary w-full'
            required
            placeholder='Enter Username...'
            onChange={(e) => (username.current = e.target.value)}
          />
          <input
            id='roomID'
            autoFocus
            required
            className='input-primary w-full'
            placeholder='Unique Room ID...'
            onChange={(e) => (roomID.current = e.target.value)}
          />
          <button
            type='submit'
            className='btn-primary rounded py-2 font-semibold uppercase'
          >
            Create
          </button>
        </form>
      </div>
    </Modal>
  );
}
