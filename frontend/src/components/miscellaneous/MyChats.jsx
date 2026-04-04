import { useChatState } from '@/context/ChatProvider';
import React, { useEffect, useState } from 'react'
import { toaster } from "@/components/ui/toaster"
import axios from 'axios';
import { Box, Button, Stack } from '@chakra-ui/react';
import { IoMdAdd } from "react-icons/io";
import ChatLoading from './ChatLoading';
import { ScrollArea } from "@chakra-ui/react"
import { Avatar, HStack, Text } from "@chakra-ui/react"
import { getSender, getSenderPic } from '@/config/ChatLogic';
import { CloseButton, Dialog, Portal } from "@chakra-ui/react"
import { TiGroupOutline } from "react-icons/ti";
import ChatModal from './ChatModal';
import { Image } from "@chakra-ui/react"
function MyChats({ fetchAgain, setfetchAgain }) {
  const [loggedUser, setloggedUser] = useState();
  const { user, chats, setchats, selectedchat, setselectedchat } = useChatState();
  const fetchchats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      const { data } = await axios.get("/api/chat", config);
      setchats(data);
    } catch (err) {
      toaster.create({
        "title": "Unable to fetch Chats!",
        "type": "warning"
      })
    }
  }
  useEffect(() => {
    setloggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchchats();
  }, [fetchAgain])
  return (
    <>
      <Box display={{ base: selectedchat ? "none" : "flex", md: "flex" }} flexDir="column" bg="blackAlpha.700" w={{ base: "100%", md: "40%", lg: "35%" }} borderRadius="lg" borderWidth="1px" p={3} alignItems="center">
        <Box w="100%" display="flex" justifyContent="space-between" alignItems="center" fontSize={{ base: "28px", md: "28px", lg: "30px" }} fontFamily="Work Sans" color="white" px={3} pb={3}>
          My Chats
          {/* <Button bg="gray.300" p={2} borderWidth="0.5px" borderColor="black" borderRadius="md" fontFamily="Work sans" _hover={{ bg: "gray.200" }}>
            New Group Chat
            <IoMdAdd />
          </Button> */}
          <ChatModal></ChatModal>
        </Box>
        {chats ? (
          <ScrollArea.Root maxW="lg">
            <ScrollArea.Viewport>
              <ScrollArea.Content spaceY="2" textStyle="sm">
                {chats.map((chat) => {
                  return <HStack key={chat._id} gap="4" bg={chat === selectedchat ? "#38B2ac" : "gray.300"} borderRadius="md" color={chat === selectedchat ? "white" : "black"} p={2} fontFamily="Work Sans" onClick={() => {
                    setselectedchat(chat)
                  }} _hover={{ bg: "#38B2ac" }}>
                    {!chat.isGroupChat ? (
                      <Avatar.Root bg="garay.300" color="black">
                        <Avatar.Fallback name={getSender(loggedUser, chat.users)} />
                        <Avatar.Image src={getSenderPic(loggedUser, chat.users)} />
                      </Avatar.Root>
                    ) : (
                      // <Avatar.Root bg="garay.300" color="black">
                      //   <Avatar.Fallback name="groupIcon" />
                      //   <Avatar.Image src="./groupIcon.png" />
                      // </Avatar.Root>
                      <Box boxSize="40px" borderRadius="full" overflow="hidden" border="0.5px solid" borderColor="black" >
                        <Image
                          src="./groupIcon.png"
                          borderRadius="full"
                          Objectfit="cover"
                          alt="groupicon"
                          transform="scale(1.3)"
                        />
                      </Box>
                    )}
                    <Stack gap="0">
                      <Text fontWeight="medium">
                        {chat.isGroupChat ? chat.chatName : getSender(loggedUser, chat.users)}
                      </Text>
                      <Text color={chat === selectedchat ? "white" : "black"} textStyle="xs" fontFamily="Work sans">
                        {chat.latestMessage ? <><b>{chat.latestMessage.sender.name}:</b>{chat.latestMessage.content.length > 50 ? (chat.latestMessage.content.substring(0, 51) + "...") : (chat.latestMessage.content)}</> : <p>No Chats Yet!</p>}
                      </Text>
                    </Stack>
                  </HStack>
                })}
              </ScrollArea.Content>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar>
              <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>
            <ScrollArea.Corner />
          </ScrollArea.Root>
        ) : (
          <ChatLoading></ChatLoading>
        )}
      </Box>
    </>
  )
}

export default MyChats
