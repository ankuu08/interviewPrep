import React, { useEffect, useRef, useState } from 'react'
import { Box, Button } from "@chakra-ui/react"
import { Menu, Portal } from "@chakra-ui/react"
import Editor from '@monaco-editor/react';
import { io } from 'socket.io-client';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
// const ENDPOINT = "http://localhost:5000";
const ENDPOINT=window.location.origin;
var socket;
function EditorPage() {
  const history = useHistory()
  const editorRef = useRef(null);
  const hasjoined = useRef(false);
  const [code, setcode] = useState("");
  const [users, setusers] = useState([]);
  // var roomId;
  // var name;
  const[roomId,setroomId]=useState();
  const[name,setname]=useState();
  const lang = ['java', 'python', 'cpp', 'javascript']
  const [language, setlanguage] = useState("java");
  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    editor.focus();
  }
  useEffect(() => {
    const roomId1 = localStorage.getItem("code");
    const name1 = localStorage.getItem("name");
    if (!roomId1 || !name1) {
      history.push("/chats/editor")
    }
    setroomId(roomId1);
    setname(name1)
    socket = io(ENDPOINT,{
      transports:["websocket"]
    });
    socket.emit("join-room", { roomId:roomId1, name:name1 });
    socket.on("code-update", (newCode) => setcode(newCode));
    socket.on("user-update", (userList) => {
      setusers(userList);
    });
    socket.on("lang-change", (lang) => setlanguage(lang));
    return (() => {
      socket.off("user-update");
      socket.off("code-update");
      socket.off("lang-change");
    })
  }, [])
  const handleChange = (value) => {
    setcode(value);
    socket.emit("code-change", { roomId, code: value })
  }
  return (
    <>
      <Box h="100vh" w="100vw" p={5}>
        <Box height="5%" w="100%" display="flex" justifyContent="space-between" mb={3}>
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button variant="outline" size="sm">
                {language}
              </Button>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  {lang.map((l) => {
                    return <Menu.Item value={l} onClick={() => {
                      setlanguage(l)
                      socket.emit("lang-change", { roomId, lang: l })
                    }}>{l}</Menu.Item>
                  })}

                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
          <Button colorPalette="teal" size="sm" variant="outline" onClick={() => {
            localStorage.removeItem("name");
            localStorage.removeItem("code");
            history.push("/chats/editor");
          }} >
            Leave Room
          </Button>
        </Box>
        <Box h="95%" w="100%" bg="blackAlpha.100" borderRadius="md" overflow="hidden" display="flex" gap={5}>
          <Box h="100%" w="20%" bg="blackAlpha.600" display="flex" flexDir="column" alignItems="center" justifyContent="center" gap={5} >
            {users.map((u) => {
              return <Box bg="green.900" w="75%" textWrap="wrap" px={5} py={2} textAlign="center" key={u.socketId}>{u.name}</Box>
            })}
          </Box>
          <Editor
            height="100%"

            language={language}
            value={code}
            onChange={handleChange}
            onMount={handleEditorDidMount}
            theme="vs-dark"
            options={{
              fontSize: 16,
              scrollbar: {
                vertical: "hidden",
                horizontal: "hidden",
              },
            }}
          />
        </Box>
      </Box>
    </>
  )
}

export default EditorPage
