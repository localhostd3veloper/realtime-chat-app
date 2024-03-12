import { IMessage } from '../interfaces/message.interface';

/**
 * Returns a message object with metadata including type, message, username, id, and date.
 *
 * @param {string} message - the message content
 * @param {string} username - the username associated with the message
 * @return {IMessage} a message object with metadata
 */
export const getMessageWithMetaData = (
  message: string,
  username: string
): IMessage => {
  return {
    type: 'message',
    message,
    username,
    id: Date.now().toString(),
    date: new Date().toISOString(),
  };
};
