export const getSender = (loggedUser, users) => {
  return users[0]?._id === loggedUser?._id ? users[1]?.name : users[0]?.name
}
export const getSenderPic = (loggedUser, users) => {
  return users[0]?._id === loggedUser?._id ? users[1]?.pic : users[0]?.pic
}
export const getSenderUser = (user, users) => {
  return users[0]?._id === user?._id ? users[1] : users[0];
}

export const isSameSender = (messages, i, m, userId) => {
  return (i < messages.length - 1 && (messages[i + 1].sender._id !== m.sender._id || messages[i + 1].sender._id === undefined) && (messages[i].sender._id != userId))
}

export const isLastMessage = (messages, i, m, userId) => {
  return (i === messages.length - 1 && (messages[messages.length - 1].sender._id !== userId) && messages[messages.length - 1].sender._id)
}

export const isSameSenderMargin = (messages, i, m, userId) => {
  if (i < messages.length - 1 && messages[i + 1].sender._id === m.sender._id && messages[i].sender._id !== userId) {
    return 33;
  } else if ((i < messages.length - 1 && messages[i + 1] !== m.sender._id && messages[i].sender._id !== userId) || (i === messages.length - 1 && messages[i].sender._id !== userId)) {
    return 0;
  } else {
    return "auto";
  }
}
export const isSameUser = (message, i, m, userId) => {
  return (i > 0 && message[i - 1].sender._id === m.sender._id);
}