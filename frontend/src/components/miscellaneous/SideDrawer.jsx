import { Box, createToaster } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Avatar, Button, Input, Text } from "@chakra-ui/react"
import { Tooltip } from "@/components/ui/tooltip"
import { FaSearch } from "react-icons/fa";
import { Menu, Portal } from "@chakra-ui/react"
import { FaBell } from "react-icons/fa";
import { RiArrowDropDownLine } from "react-icons/ri";
import { RiArrowDropUpLine } from "react-icons/ri";
import { GiPoolTriangle } from "react-icons/gi";
import { SiGeeksforgeeks } from "react-icons/si";
import { BsFillRocketTakeoffFill } from "react-icons/bs";
import { SiLeetcode } from "react-icons/si";
import { SiCodechef } from "react-icons/si";
import { useChatState } from '@/context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { CloseButton, Drawer } from "@chakra-ui/react"
import { Stack, StackSeparator } from "@chakra-ui/react"
import { Link } from "@chakra-ui/react"
import { toaster } from "@/components/ui/toaster"
import ChatLoading from './ChatLoading';
import ChatList from './ChatList';
import axios from 'axios';
import { getSender } from '@/config/ChatLogic';
import { Circle, Float } from "@chakra-ui/react"
function SideDrawer() {
  const { user, chats, setchats, selectedchat, setselectedchat, notification, setnotification } = useChatState();
  // const [open, setopen] = useState(false);
  const [search, setsearch] = useState("");
  const [searchresult, setsearchresult] = useState([]);
  const [loading, setloading] = useState(false);
  const [loadingchats, setloadingchats] = useState(false);
  const [open, setopen] = useState(false);
  const [iopen, setiopen] = useState(false);
  const history = useHistory();
  const toaster = createToaster({
    placement: "top-end",
    overlap: true,
  })
  const logouthandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  }
  const searchHandler = async () => {
    if (!search) {
      toaster.create({
        title: "Please Enter Something to Search!",
        type: "warning",
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
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setloading(false);
      setsearchresult(data);
    } catch (err) {
      toaster.create({
        title: "Unable to find the User!",
        type: "warning",
      })
      return;
    }
  }
  const acessChat = async (userId) => {
    try {
      setloadingchats(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`
        }
      }
      const { data } = await axios.post("/api/chat", { userId }, config);
      if (!chats.find((c) => c._id === data._id)) {
        setchats([data, ...chats])
      }

      setselectedchat(data)
      setloadingchats(false);
    } catch (err) {
      toaster.create({
        title: "Unable to fetch chats!",
        type: "warning"
      })
    }
  }
  return (
    <Box w='100%' bg='#38B2ac' p="5px 10px 5px 10px" display="flex" justifyContent="space-between" alignItems="center" borderRadius="lg">
      <Tooltip showArrow content="This is the tooltip content" border="1px">
        {/* <Button borderWidth={1} borderColor="black" p="0 10px 0 10px">
          <Text fontFamily="Work sans">Search User</Text>
        </Button> */}
        <Drawer.Root placement="start" open={open} onOpenChange={(e) => setopen(e.open)} bg="black">
          <Drawer.Trigger bg="gray.200" asChild color="black" _hover={{ bg: "gray.300", color: "black" }}>
            <Button variant="outline" size={{ base: "xs", md: "sm" }}>
              <FaSearch />
              Search User
            </Button>
          </Drawer.Trigger>
          <Portal>
            <Drawer.Backdrop />
            <Drawer.Positioner>
              <Drawer.Content bg="black.200" color="white">
                <Drawer.Header>
                  <Drawer.Title>
                    <Box w="100%" display="flex" justifyContent="space around" gap="5px">
                      <Input placeholder="Search Users..." value={search} size="xs" bg="white" color="black" onChange={(e) => {
                        setsearch(e.target.value);
                      }} />
                      <Button borderRadius="5px" bg="blue.500" size="xs" color="white" onClick={searchHandler}>Go</Button>
                    </Box>
                  </Drawer.Title>
                </Drawer.Header>
                <Drawer.Body >
                  {loading ? (
                    <ChatLoading></ChatLoading>
                  ) : (
                    searchresult.length > 0 ? (
                      <Stack gap={2}>
                        {searchresult.map((user) => {
                          return <ChatList key={user._id} user={user} onClick={() => {
                            setopen(false);
                            acessChat(user._id);
                            setsearchresult([]);
                            setsearch("");
                          }}></ChatList>
                        })}
                      </Stack>
                    ) : null
                  )}
                </Drawer.Body>
                <Drawer.Footer >
                </Drawer.Footer>
                {/* <Drawer.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Drawer.CloseTrigger> */}
              </Drawer.Content>
            </Drawer.Positioner>
          </Portal>
        </Drawer.Root>
      </Tooltip>
      <Text fontSize={{ base: "md", md: "2xl" }} fontFamily="Work sans" color="white">interviewPrep</Text>
      <Box display="flex" gap={{ base: "2px" }} minW={{ base: "25%", md: "14%" }} justifyContent="space-between" p={1}>
        {/* <RiArrowDropDownLine /> */}
        {/* <RiArrowDropUpLine /> */}
        <Menu.Root size={{ base: "xs", md: "md" }}>
          <Menu.Trigger asChild focusRing="none">
            <Button size={{ base: "xs", md: "md" }} p={0} bg="none" gap={0} onClick={() => setiopen(!iopen)}>
              Resources
              {iopen ? (<RiArrowDropUpLine />) : (<RiArrowDropDownLine />)}
            </Button>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content bg="blackAlpha.800" fontFamily="Work sans" p={2} focusRing="none">
                <Menu.Item px={2} p={1}><Link focusRing="none" p={2} href="https://www.interviewbit.com/"><GiPoolTriangle />InterviewBit</Link></Menu.Item>
                <Menu.Item px={2} p={1}><Link focusRing="none" p={2} href="https://www.geeksforgeeks.org/"><SiGeeksforgeeks />Geeksforgeeks</Link></Menu.Item>
                <Menu.Item px={2} p={1}><Link focusRing="none" p={2} href="https://takeuforward.org/"><BsFillRocketTakeoffFill />takeuforward</Link></Menu.Item>
                <Menu.Item px={2} p={1}><Link focusRing="none" p={2} href="https://leetcode.com/"><SiLeetcode />Leetcode</Link></Menu.Item>
                <Menu.Item px={2} p={1}><Link focusRing="none" p={2} href="https://www.codechef.com/"><SiCodechef />CodeChef</Link></Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
        <Box display="flex" gap={{ base: "2px", md: "2" }}>
          <Menu.Root size={{ base: "xs", md: "sm" }} focusRing="none">
            <Menu.Trigger asChild focusRing="none">
              <Button color="white" bg="none" size={{ base: "xs", md: "md" }} focusRing="none" _hover={{ color: "gray.200" }} mr={1}>
                <FaBell />
                {notification.length > 0 &&
                  <Float offset={{ base: 1, md: 2 }}>
                    <Circle size={{ base: 4, md: 5 }} bg="red" color="white">
                      {notification.length}
                    </Circle>
                  </Float>
                }
              </Button>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content bg="blackAlpha.800" mt={2} p={2}>
                  {!notification.length && <Menu.Item fontFamily="work sans" color="white" fontSize={15}>No messages!</Menu.Item>}
                  {notification.map((notif) => {
                    return <Menu.Item key={notif._id} fontFamily="work sans" color="white" px={2} p={2} fontSize={15} borderRadius="md" _hover={{ bg: "rgb(56,178,172,0.5)" }}
                      onClick={() => {
                        setselectedchat(notif.chat);
                        setnotification(notification.filter((n) => n._id !== notif._id))
                      }}
                    >
                      {notif.chat.isGroupChat ? `New Message in ${notif.chat.chatName}` : `New Message from ${getSender(user, notif.chat.users)}`}
                    </Menu.Item>
                  })}
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
          <Menu.Root positioning={{ placement: "right-end" }} size={{ base: "xs" }}>
            <Menu.Trigger rounded="full" focusRing="none">
              <Avatar.Root size={{ base: "xs", md: "sm" }} >
                <Avatar.Fallback name={user.name} />
                <Avatar.Image src={user.pic} />
              </Avatar.Root>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content p={1}>
                  <ProfileModal user={user} info={"My Profile"} >
                    <Menu.Item value="account" _focus={{ outline: "none", boxShadow: "none" }} textAlign="left">
                    </Menu.Item>
                  </ProfileModal>
                  <Menu.Item onClick={logouthandler} value="logout" fontFamily="Work sans" px={2}>Logout</Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </Box>
      </Box>
    </Box >
  )
}

export default SideDrawer
