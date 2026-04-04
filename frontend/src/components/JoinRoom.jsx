import { Box } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import { Input, Text } from "@chakra-ui/react"
import { Button } from "@chakra-ui/react"
import { toaster } from './ui/toaster'
import { useHistory } from 'react-router-dom/cjs/react-router-dom'
function JoinRoom({ isActive }) {
  const history = useHistory();
  const nameRef = useRef()
  const inpRef = useRef();
  const [Code, setCode] = useState("");
  const [Name, setName] = useState("");
  const handleJoinRoom = () => {
    if (!Code || !Name) {
      toaster.create({
        "title": "Code or name not Provided!",
        "type": "warning"
      })
      return;
    }
    localStorage.setItem("name", Name);
    localStorage.setItem("code", Code);
    history.push("/chats/editor/editorpage");
  }
  useEffect(() => {
    if (isActive && nameRef.current) {
      nameRef.current.focus();
    }
  }, [isActive])
  return (
    <Box h="auto" w="100%" p={2} >
      <Input ref={nameRef} value={Name} placeholder="Your Name here!" focusRing="none" color="white" fontSize="md" autoFocus onChange={(e) => {
        setName(e.target.value);
      }} />
      <Input ref={inpRef} value={Code} placeholder="Your Code here!" focusRing="none" color="white" fontSize="md" mt={3} onChange={(e) => {
        setCode(e.target.value);
      }} />
      <Text fontSize="xx-small" lineHeight="short" mt={1} textAlign="center">while Joining room please choose diffrent name from the Persons already in the room!</Text>
      <Button w="100%" py={1} fontSize="md" mt={3} bg="green.500" color="white" onClick={handleJoinRoom}>Join Room</Button>
    </Box>
  )
}

export default JoinRoom
