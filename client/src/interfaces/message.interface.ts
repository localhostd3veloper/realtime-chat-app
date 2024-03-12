export interface IMessage {
  type: 'message' | 'join' | 'leave';
  message: string;
  id: string;
  username: string;
  date: string;
}
