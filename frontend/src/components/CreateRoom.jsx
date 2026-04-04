import { Box } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import { Input } from "@chakra-ui/react"
import { Button } from "@chakra-ui/react"
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { toaster } from './ui/toaster';

function CreateRoom({ isActive }) {
  const history = useHistory();
  const inpRef = useRef();
  const nameRef = useRef();
  const [Code, setCode] = useState("");
  const [Name, setName] = useState("");
  const alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

  const genCode = () => {
    let temp = "";
    for (let i = 0; i < 10; i++) {
      let idx = Math.floor(Math.random() * alphabets.length);
      temp += alphabets[idx];
    }
    setCode(temp);
    localStorage.setItem("code", temp);
  }
  const handleCreateRoom = () => {
    if (!Name || Name === "") {
      toaster.create({
        "title": "Please provide Name!",
        duration: 6000,
        "type": "warning"
      })
      return;
    }
    localStorage.setItem("name", Name);
    navigator.clipboard.writeText(Code);
    toaster.create({
      "title": `Code is ${Code}`,
      duration: 6000,
      "type": "success",
    })
    toaster.create({
      "title": "Code Copied to ClipBoard!",
      duration: 6000,
      "type": "info"
    })
    history.push("/chats/editor/editorpage");
  }
  useEffect(() => {
    nameRef.current.focus();
    genCode();
  }, [])
  return (
    <Box h="auto" w="100%" p={2} >
      <Input value={Name} ref={nameRef} placeholder="Your Name here!" focusRing="none" color="white" fontSize="md" onChange={(e) => {
        setName(e.target.value);
      }} />
      <Input value={Code} ref={inpRef} placeholder="Your Code here!" focusRing="none" color="white" fontSize="md" mt={3} readOnly />
      <Button w="100%" py={1} fontSize="md" mt={3} bg="blue.600" color="white" onClick={handleCreateRoom} >Create Room</Button>
    </Box>
  )
}

export default CreateRoom
