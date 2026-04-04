import React, { useEffect, useState } from 'react'
import CreateRoom from '../components/CreateRoom'
import { Box, Button } from '@chakra-ui/react'
import { Tabs } from "@chakra-ui/react"
import JoinRoom from '../components/JoinRoom'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
// import { IoMdArrowRoundBack } from "react-icons/io";
import { IoClose } from "react-icons/io5";
function HomePagee() {
  const history = useHistory()
  const [value, setValue] = useState("first")
  // useEffect(() => {
  //   const name = localStorage.getItem("name");
  //   const code = localStorage.getItem("code");
  //   if (!name || !code) {
  //     history.push("/chats")
  //   }
  // })
  return (
    <>
      <Box h="100%" w="100%">
        <Box h="5vh" mt={5} ml={5}>
          <Button colorPalette="blue" variant="outline" onClick={() => {
            window.close();
          }}>
            {/* <IoMdArrowRoundBack /> */}
            <IoClose />
          </Button>
        </Box>
        <Box h="70vh" w="100%" display="flex" justifyContent="center" alignItems="center">
          <Tabs.Root w={{ base: "100%", md: "30%" }} bg="blackAlpha.800" p={1} value={value} onValueChange={(e) => setValue(e.value)} >
            <Tabs.List display="flex" justifyContent="center" alignItems="center" >
              <Tabs.Trigger value="first" fontSize="lg" w="100%" display="flex" justifyContent="center" alignItems="center" >Create Room</Tabs.Trigger>
              <Tabs.Trigger value="second" fontSize="lg" w="100%" display="flex" justifyContent="center" alignItems="center"  >Join Room</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="first"><CreateRoom isActive={value === "first"}></CreateRoom></Tabs.Content>
            <Tabs.Content value="second"><JoinRoom isActive={value === "second"}></JoinRoom></Tabs.Content>
          </Tabs.Root>
        </Box>
      </Box>
    </>
  )
}

export default HomePagee
