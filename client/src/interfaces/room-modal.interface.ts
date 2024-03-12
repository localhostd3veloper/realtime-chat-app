export interface IRoomModal {
  isOpen: boolean;
  closeModal: () => void;
  username: React.MutableRefObject<string>;
  roomID: React.MutableRefObject<string>;
}
