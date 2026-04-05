import { useChatState } from '@/context/ChatProvider'
import { Box, Button, Spinner, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { getSenderUser } from '@/config/ChatLogic'
import { FaRegEye } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaLaptopCode } from "react-icons/fa";
import ProfileModal from './ProfileModal';
import UpdateGroupModal from './UpdateGroupModal';
import { Input } from "@chakra-ui/react"
import { toaster } from '../ui/toaster';
import axios from 'axios';
import "../ui/style.css";
import ScrollableChat from './ScrollableChat';
import AiModal from './AiModal';
import { io } from 'socket.io-client';
import Lottie from 'lottie-react';
import Typing from '../../animations/Typing.json';
const ENDPOINT = window.location.origin;
var socket, selectedChatcompare;
function SingleChat({ fetchAgain, setfetchAgain }) {
  const [loading, setloading] = useState(false);
  const [message, setmessage] = useState([]);
  const [newMessage, setnewmessage] = useState("");
  const [socketconnected, setsocketconnected] = useState(false);
  const [isTyping, setisTyping] = useState(false);
  const [typing, settyping] = useState(false);
  const { selectedchat, user, setselectedchat, notification, setnotification } = useChatState()
  const sendMessage = async (e) => {
    if (e.key == "Enter" && newMessage) {
      socket.emit("stop typing", selectedchat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`
          }
        }
        const { data } = await axios.post('/api/messages', {
          content: newMessage,
          chatId: selectedchat._id
        }, config);
        setnewmessage("");
        socket.emit("new message", data);
        setmessage([...message, data]);
        // console.log(message);
      } catch (err) {
        toaster.create({
          "title": "Unable to Send Message!",
          "type": "warning"
        })
      }
    }
  }
  const fetchAllMessages = async () => {
    if (!selectedchat) {
      return;
    }
    try {
      setloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      const { data } = await axios.get(`/api/messages/${selectedchat._id}`, config);
      // console.log(data);
      setmessage(data);
      setloading(false);
      socket.emit("join chat", selectedchat._id);
    } catch (err) {
      toaster.create({
        "title": "Unable to fetch Messages!",
        "type": "warning"
      })
    }
  }

  useEffect(() => {
    socket = io(ENDPOINT, {
    transports: ["websocket"]
  }
);
    socket.emit("setup", user);
    socket.on("connected", () => setsocketconnected(true));
    socket.on("typing", () => setisTyping(true));
    socket.on("stop typing", () => setisTyping(false))
  }, [])
  const typingHandler = (e) => {
    setnewmessage(e.target.value);
    //is typing handler
    if (!socketconnected) {
      return;
    }
    if (!typing) {
      settyping(true);
      socket.emit("typing", selectedchat._id);
    }
    let lastTypingTimne = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTimne;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedchat._id);
        settyping(false);
      }
    }, timerLength)
  }
  useEffect(() => {
    if (selectedchat && socket) {
      fetchAllMessages();
    }
    selectedChatcompare = selectedchat;
  }, [selectedchat])
  useEffect(() => {
    socket.on("message received", (newRecievedMessage) => {
      if (!selectedChatcompare || newRecievedMessage.chat._id !== selectedChatcompare._id) {
        //Notification
        // console.log("Message for another chat");
        if (!notification.some((n) => n._id === newRecievedMessage._id)) {
          setnotification((prev) => {
            if (prev.find((p) => p._id === newRecievedMessage._id)) {
              return prev;
            } else {
              return [newRecievedMessage, ...prev];
            }
          });
          setfetchAgain((prev) => !prev);
        }
      } else {
        setmessage((prev) => {
          const exists = prev.find((m) => m._id === newRecievedMessage._id);
          if (exists) {
            return prev;
          }
          return [...prev, newRecievedMessage]
        });
      }
    })
  }, [])
  console.log(notification);
  return (
    <>
      {selectedchat ? (
        <>
          <Box w="100%" fontSize="3xl" fontWeight="light" display="flex" fontFamily="Work sans" justifyContent="space-between" px={3} pb={2}>
            {!selectedchat.isGroupChat ? (
              <Text fontSize="3xl" fontFamily="Work sans" fontWeight="light" display="flex" justifyContent="space-between" width="100%" >
                <Button p={1} bg="gray.200" display={{ base: "flex", md: "none" }} onClick={() => setselectedchat("")}>
                  <IoMdArrowRoundBack />
                </Button>
                {getSenderUser(user, selectedchat.users).name}
                <Box display="flex" gap={{ base: "1px", md: "6px" }}>
                  <Button bg="none" color="white" onClick={() => {
                    window.open(`${window.location.origin}/chats/editor`, "_blank");
                  }} >
                    <FaLaptopCode />
                  </Button>
                  <AiModal></AiModal>
                  <ProfileModal user={getSenderUser(user, selectedchat.users)} info={""}>
                  </ProfileModal>
                </Box>
              </Text>

            ) : (
              <>
                <Button p={1} bg="gray.200" display={{ base: "flex", md: "none" }} onClick={() => setselectedchat("")}>
                  <IoMdArrowRoundBack />
                </Button>
                {selectedchat.chatName.toUpperCase()}
                <Box display="flex" gap={1}>
                  <Button bg="none" color="white" boxSize="fit" onClick={() => {
                    window.open(`${window.location.origin}/chats/editor`, "_blank");
                  }} >
                    <FaLaptopCode />
                  </Button>
                  <AiModal></AiModal>
                  <UpdateGroupModal fetchAgain={fetchAgain} setfetchAgain={setfetchAgain} fetchAllMessages={fetchAllMessages}></UpdateGroupModal>
                </Box>
              </>
            )}
          </Box>
          <Box display="flex" flexDir="column" justifyContent="flex-end" bg="blackAlpha.800" color="white" width="100%" h="100%" borderRadius="lg" overflowY="hidden" p={2}>
            {loading ? (
              <Spinner size="xl" alignSelf="center" margin="auto"></Spinner>
            ) : (
              <div className='messages' scrollbar="hidden" >
                <ScrollableChat message={message} isTyping={isTyping}></ScrollableChat>
              </div>
            )}
            <Box w="100%" display="flex" justifyContent="center" mt={2}>
              <Input placeholder="Enter Message..." _placeholder={{ color: 'black', fontSize: "sm" }} p={2} ms={3} mb={1} w="100%" color="black" bg="gray.400" focusRing="none" fontFamily="work sans" fontSize="md" value={newMessage} fontWeight="medium" onKeyDown={(e) => {
                sendMessage(e);
              }} onChange={(e) => {
                typingHandler(e);
              }} />
            </Box>
          </Box>
        </>
      ) : (
        <Box h="100%" width="100%" display="flex" justifyContent="center" alignItems="center" color="white" fontSize="3xl" fontFamily="Work sans" >Click On An user to Start chatting!</Box>
      )}
    </>
  )
}

export default SingleChat
