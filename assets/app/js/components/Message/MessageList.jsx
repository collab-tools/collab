import React, { PropTypes } from 'react';
import _ from 'lodash';
import Divider from 'material-ui/Divider';
import UserMessage from './UserMessage.jsx';
import SystemMessage from './SystemMessage.jsx';

const propTypes = {
  pinned: PropTypes.bool,
  messages: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  actions: React.PropTypes.shape({
    onPostNewMessage: PropTypes.func.isRequired,
    onPinMessage: PropTypes.func.isRequired,
    onUnpinMessage: PropTypes.func.isRequired,
    onEditMessageContent: PropTypes.func.isRequired,
    onDeleteMessage: PropTypes.func.isRequired,
  }),
  onEnterEditMode: PropTypes.func.isRequired,
};
const styles = {
  container: {
    overflowX: 'hidden',
  },
};
const MessageList = ({ messages, users, actions, pinned, onEnterEditMode }) => {
  let content = null;
  // track the transition from SystemMessage to UserMessage
  // add divider between transition as SystemMessage has only bottomBorder
  let isPreviousSystemMessage = false;
  const messageItems = [];
  messages.sort((messageA, messageB) => (
    new Date(messageA.created_at).getTime() - new Date(messageB.created_at).getTime()
  )).forEach(message => {
    if (message.author_id) { // message with author_id is considered as user message
      let targetUser = users.filter(user => user.id === message.author_id);
      if (targetUser.length > 0) {
        targetUser = _.first(targetUser);
        const messageItem = {
          id: message.id,
          pinned: message.pinned,
          content: message.content,
          createdAt: message.created_at,
          updatedAt: message.content_updated_at,
          authorName: targetUser.display_name,
          authorAvatarUrl: targetUser.display_image,
        };
        if (message.content_updated_by) {
          const targetUsers = users.filter(user => user.id === message.content_updated_by);
          if (targetUsers.length > 0) {
            messageItem.updatedBy = _.first(targetUsers).display_name;
          }
        }
        if (isPreviousSystemMessage) {
          messageItems.push(<Divider key={`${message.id}_message_divider`} />);
        }
        isPreviousSystemMessage = false;
        messageItems.push(
          <UserMessage
            pinned={pinned}
            key={message.id} message={messageItem}
            onPinMessage={actions.onPinMessage}
            onUnpinMessage={actions.onUnpinMessage}
            onEditMessageContent={actions.onEditMessageContent}
            onDeleteMessage={actions.onDeleteMessage}
            onEnterEditMode={onEnterEditMode}
          />
        );
      }
    } else {
      const messageItem = {
        id: message.id,
        content: message.content,
        createdAt: message.created_at,
        data: message.data,

      };
      isPreviousSystemMessage = true;
      messageItems.push(<SystemMessage key={message.id} message={messageItem} />);
    }
  });

  if (messageItems.length > 0) {
    content = messageItems;
  }

  return (
    <div className="message-list" style={styles.container}>
      {content}
    </div>
  );
};

MessageList.propTypes = propTypes;
export default MessageList;
