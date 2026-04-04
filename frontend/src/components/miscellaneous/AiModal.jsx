import React, { useState } from 'react'
import { Box, Button, CloseButton, Dialog, Portal } from "@chakra-ui/react"
import { Image } from "@chakra-ui/react"
import { Avatar, HStack, Separator, Input } from "@chakra-ui/react"
import { Text } from "@chakra-ui/react"
import { toaster } from '../ui/toaster'
import { useChatState } from '@/context/ChatProvider'
import axios from 'axios'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import ScrollableFeed from 'react-scrollable-feed'
function AiModal() {
  const [loading, setloading] = useState(false);
  const [message, setmessage] = useState("");
  const [messages, setmessages] = useState([]);
  const { user } = useChatState();
  const sendMessageHandler = async (e) => {
    if (e.key === "Enter") {
      if (!message) {
        toaster.create({
          "title": "Please Type Something!",
          "type": "warning"
        })
      }
      try {
        setloading(true);
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`
          }
        }
        const { data } = await axios.post("api/messages/ai", {
          content: message,
        }, config);
        // console.log(data.choices[0].message.content);
        const obj = {
          "user": message,
          "ai": data.choices[0].message.content
        }
        // console.log(obj);
        setmessages([...messages, obj]);
        setloading(false);
        setmessage("");
        // console.log(messages);
      } catch (err) {
        console.log(err);
        toaster.create({
          "title": "Error Occured!",
          "type": "warning"
        })
      }
    }
  }
  return (
    <Dialog.Root scrollBehavior="inside" size="lg" >
      <Dialog.Trigger asChild>
        <Button bg="none" borderRadius="rounded">
          <Box
            boxSize={{ base: "40px", md: "43px" }}
            borderRadius="full"
            overflow="hidden"
            border="1px solid"
            borderColor="#38B2ac"
          >
            <Image
              src="/jarvis.gif"
              w="100%"
              h="100%"
              objectFit="cover"
              transform="scale(1.7)"
            />
          </Box>
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content bg="blackAlpha.700" h="100%">
            <Dialog.Header bg="black">
              <Dialog.Title>
                <Box display="flex" alignItems="center" justifyContent="center">
                  <Box
                    boxSize={{ base: "40px", md: "43px" }}
                    overflow="hidden"
                    borderRadius="full"
                    fontFamily="Work sans"
                  >
                    <Image
                      src="/jarvis.gif"
                      w="100%"
                      h="100%"
                      objectFit="cover"
                      transform="scale(1.7)"
                    >
                    </Image>
                  </Box>
                  <Text fontFamily="work sans" color="white" ml={1}>At your Service!</Text>
                </Box>
              </Dialog.Title>
            </Dialog.Header>
            <Separator variant="solid" color="white" />
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
            <Dialog.Body display="flex" flexDir="column" justifyContent="flex-end" scrollbar="hidden" overflow="hidden" h="100%" >
              <Box overflow="auto" scrollbar="hidden">
                {/* "#9F7AEA" */}
                {/* "#68c7d2" */}
                <ScrollableFeed scrollbar="hidden">
                  {messages.map((m, i) => {
                    return <>
                      <Box fontFamily="work sans" mt={3} textWrap="wrap" w="fit-content" bg="#2d6b72" color="white" borderRadius="lg" alignContent="flex-end" p={2} marginLeft="auto" >
                        <Markdown remarkPlugins={[remarkGfm]}>{m.user}</Markdown>
                      </Box>
                      <Box display="flex">
                        {loading && i == messages.length - 1 ? (
                          <Avatar.Root shape="rounded" size="sm">
                            <Avatar.Fallback name="ai..." />
                            <Avatar.Image src="./typing.gif" />
                          </Avatar.Root>
                        ) : (
                          <>
                            <Avatar.Root shape="full" size="sm">
                              <Avatar.Fallback name="ai..." />
                              <Avatar.Image src="./jarvis2.gif" />
                            </Avatar.Root>
                            <Box fontFamily="work sans" mt={3} w="fit-content" bg="black" color="white" borderRadius="lg" alignContent="flex-end" p={2} marginLeft="0px" >
                              <Markdown remarkPlugins={[remarkGfm]}>{m.ai}</Markdown>
                            </Box>
                          </>
                        )}
                      </Box>
                    </>
                  })}
                </ScrollableFeed>
              </Box>

              <Input color="white" bg="rgba(56, 178, 172, 0.1)" focusRing="none" fontFamily="work sans" fontWeight="md" _placeholder={{ color: "white" }}
                mt={3} flexShrink={0} placeholder='Ask Ai....' value={message} onChange={(e) => setmessage(e.target.value)} onKeyDown={(e) => sendMessageHandler(e)}></Input>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

export default AiModal
