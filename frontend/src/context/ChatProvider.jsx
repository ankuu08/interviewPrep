import { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";


const chatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setuser] = useState();
  const [selectedchat, setselectedchat] = useState()
  const [chats, setchats] = useState([]);
  const [notification, setnotification] = useState([]);
  const history = useHistory();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    setuser(userInfo);
    if (!userInfo) {
      history.push('/');
    }
  }, [localStorage])
  return <chatContext.Provider value={{ user, setuser, chats, setchats, selectedchat, setselectedchat, notification, setnotification }}>{children}</chatContext.Provider>
}

export const useChatState = () => {
  return useContext(chatContext);
}
export default ChatProvider;
