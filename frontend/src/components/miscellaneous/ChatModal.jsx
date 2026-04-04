import React, { useState } from 'react'
import { Button, Box, Center, CloseButton, Dialog, Input, Portal, Spinner, VStack } from "@chakra-ui/react"
import { IoMdAdd } from "react-icons/io";
import { toaster } from "@/components/ui/toaster"
import { useChatState } from '@/context/ChatProvider';
import axios from 'axios';
import ChatList from './ChatList';
import UserBadge from './UserBadge';
function ChatModal() {
  const [chatName, setchatname] = useState();
  const [selectedUsers, setselectedUsers] = useState([]);
  const [search, setsearch] = useState("");
  const [searchResult, setsearchResult] = useState([]);
  const [loading, setloading] = useState(false);
  const [open, setopen] = useState(false);
  const { user, chats, setchats, } = useChatState();
  const handleSearch = async (query) => {
    if (!query) {
      return;
    }
    setsearch(query);
    try {
      setloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      console.log(query);
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      setsearchResult(data);
      console.log(data);
      setloading(false);
    } catch (err) {
      toaster.create({
        "title": "Unable to fetch Users!",
        "type": "warning"
      })
    }
  }
  const handleGroup = (user) => {
    console.log(selectedUsers);
    if (selectedUsers.includes(user)) {
      toaster.create({
        "title": "User already present!",
        "type": "warning"
      })
      return;
    }
    setselectedUsers([...selectedUsers, user])
  }
  const handleDelete = (delUser) => {
    setselectedUsers(selectedUsers.filter(sel => sel._id != delUser._id));
  }
  const handlesubmit = async () => {
    if (!chatName || !selectedUsers) {
      toaster.create({
        "title": "ChatName or Users are not selected!",
        "type": "warning"
      })
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      const { data } = await axios.post("/api/chat/group", {
        name: chatName,
        users: JSON.stringify(selectedUsers.map((u) => u._id))
      }, config);
      console.log(data);
      // setchats([data, ...chats]);
      setchats((prevChats) => [data, ...prevChats]);
      console.log()
    } catch (err) {
      toaster.create({
        "title": "Unable to Crate Group!",
        "type": "warning"
      })
    }
  }
  return (
    <Dialog.Root placement="center" open={open} onOpenChange={(e) => setopen(e.open)}>
      <Dialog.Trigger asChild>
        {/* <Button variant="outline" size="sm">
          Open Dialog
        </Button> */}
        <Button bg="gray.300" p={2} borderWidth="0.5px" borderColor="black" borderRadius="md" fontFamily="Work sans" _hover={{ bg: "gray.200" }}>
          New Group Chat
          <IoMdAdd />
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content bg="black.200" color="white" fontFamily="Work sans">
            <Dialog.Header display="flex" justifyContent="center">
              <Dialog.Title fontSize="2xl" fontFamily="Work sans" diaplay="flex" justifyContent="center" textAlign="center">Create Group Chat</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Input placeholder="Chat Name" bg="white" color="black" size="xs" mb="4px" onChange={(e) => setchatname(e.target.value)} />
              <Input placeholder='Search User ex. ankit,jane,john...' size="xs" bg="white" color="black" mb="5px" onChange={(e) => handleSearch(e.target.value)}></Input>
              <Box display="flex" flexWrap="wrap" w="100%">
                {selectedUsers.map((u) => {
                  return <UserBadge key={u._id} user={u} onClick={() => {
                    handleDelete(u);
                  }}></UserBadge>
                })}
              </Box>
              {loading ? (
                <>
                  <VStack colorPalette="teal" mt={2}>
                    <Spinner display="flex" justifyContent="center" size="xl" color="#38B2ac" />
                  </VStack>
                </>

              ) : (
                searchResult.length > 0 ? (searchResult.slice(0, 4).map((user) => {
                  return <Box mb={1}>
                    <ChatList user={user} onClick={() => {
                      handleGroup(user);
                    }}></ChatList>
                  </Box>
                })) : (<Box color="black" fontFamily="Work sans" textAlign="center">User Not Found!</Box>)
              )}
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button bg="#38B2ac" color="white" fontFamily="Work sans" _hover={{ bg: "#3ea19c" }} onClick={() => {
                  handlesubmit();
                  setopen(false);
                }}>Create Chat</Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

export default ChatModal
