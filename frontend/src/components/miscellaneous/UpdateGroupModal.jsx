import React, { useState } from 'react'
import { Button, Box, Center, CloseButton, Dialog, Input, Portal, Spinner, VStack } from "@chakra-ui/react"
import { FaRegEye } from "react-icons/fa";
import { useChatState } from '@/context/ChatProvider';
import UserBadge from './UserBadge';
import { toaster } from '../ui/toaster';
import axios from 'axios';
import ChatList from './ChatList';
function UpdateGroupModal({ fetchAgain, setfetchAgain, fetchAllMessages }) {
  const [open, setopen] = useState(false);
  const [renameChatName, setrenameChatname] = useState();
  const [selectedUsers, setselectedUsers] = useState([]);
  const [search, setsearch] = useState("");
  const [searchResult, setsearchResult] = useState([]);
  const [loading, setloading] = useState(false);
  const [loadingRename, setloadingRename] = useState(false);
  const { user, chats, setchats, selectedchat, setselectedchat } = useChatState();
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
  const handleRename = async () => {
    try {
      setloadingRename(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      const { data } = await axios.put("/api/chat/rename", {
        chatId: selectedchat._id,
        chatName: renameChatName
      }, config);
      setselectedchat(data);
      setfetchAgain(!fetchAgain);
      setloadingRename(false);
    } catch (err) {
      toaster.create({
        title: "Unable to rename the Chat!",
        type: "warning"
      })
      setloadingRename(false);
    }
  }
  const handleAddUser = async (user1) => {
    if (!selectedchat.users.find((u) => u._id === user1._id)) {
      toaster.create({
        "title": "User already present!",
        "type": "warning"
      })
      return;
    }
    if (!user._id === selectedchat.groupAdmin._id) {
      toaster.create({
        "title": "Only Admin can add Users!",
        "type": "warning"
      })
      return;
    }
    try {
      setloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      const { data } = await axios.put("/api/chat/groupadd", {
        chatId: selectedchat._id,
        userId: user1._id
      }, config);
      setselectedchat(data);
      setfetchAgain(!fetchAgain);
      setloading(false);
    } catch (err) {
      toaster.create({
        "title": "unable to add User!",
        "type": "warning"
      })
      return;
    }
  }
  const handleRemove = async (user1) => {
    if (!user._id === selectedchat.groupAdmin._id) {
      toaster.create({
        "title": "Only Admin can add Users!",
        "type": "warning"
      })
      return;
    }
    try {
      setloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      const { data } = await axios.put("/api/chat/groupremove", {
        chatId: selectedchat._id,
        userId: user1._id
      }, config);
      user1._id === user._id ? setselectedchat("") : setselectedchat(data);
      fetchAllMessages();
      setfetchAgain(!fetchAgain);
      setloading(false);
    } catch (err) {
      toaster.create({
        "title": "unable to remove User!",
        "type": "warning"
      })
      return;
    }
  }
  return (
    <Dialog.Root placement="center" open={open} onOpenChange={(e) => setopen(e.open)}>
      <Dialog.Trigger asChild>
        {/* <Button variant="outline" size="sm">
          Open Dialog
        </Button> */}
        <Button p={1} bg="gray.300" >
          <FaRegEye />
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content bg="black.200" color="white" fontFamily="Work sans">
            <Dialog.Header display="flex" justifyContent="center">
              <Dialog.Title fontSize="2xl" fontFamily="Work sans" diaplay="flex" justifyContent="center" textAlign="center">{selectedchat.chatName}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Box display="flex" flexWrap="wrap" w="100%">
                {selectedchat.users.map((u) => {
                  return <UserBadge key={u._id} user={u} onClick={() => {
                    handleRemove(u);
                  }}></UserBadge>
                })}
              </Box>
              <Box w="100%" display="flex" justifyContent="space-around" gap={1} >
                <Input placeholder="Rename Chat Name" bg="white" color="black" size="xs" mb="4px" onChange={(e) => setrenameChatname(e.target.value)} />
                <Button bg="#38B2ac" size="xs" color="white" fontFamily="Work sans" loading={loadingRename} _hover={{ bg: "#3ea19c" }} onClick={() => {
                  handleRename()
                }}>Update</Button>
              </Box>
              <Input placeholder='Search User ex. ankit,jane,john...' size="xs" bg="white" color="black" mb="5px" onChange={(e) => handleSearch(e.target.value)}></Input>
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
                      handleAddUser(user);
                    }}></ChatList>
                  </Box>
                })) : (<Box color="white" fontFamily="Work sans" textAlign="center">User Not Found!</Box>)
              )}
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button bg="#cf3c3c" color="white" fontFamily="Work sans" _hover={{ bg: "red.500" }} onClick={() => {
                  // handlesubmit();
                  setopen(false);
                }}>Leave group</Button>
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

export default UpdateGroupModal
