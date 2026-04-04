import { useChatState } from '@/context/ChatProvider'
import { Box, Text } from '@chakra-ui/react'
import React from 'react'
import SingleChat from './SingleChat';

function ChatBox({ fetchAgain, setfetchAgain }) {
  // bg="#2f3837"
  const { selectedchat } = useChatState();
  return (
    <Box display={{ base: selectedchat ? "flex" : "none", md: "flex" }}
      flexDir="column"
      width={{ base: "100%", md: "63%" }} bg="blackAlpha.700" color="white" borderRadius="lg" borderWidth="1px" p={3}>
      <SingleChat fetchAgain={fetchAgain} setfetchAgain={setfetchAgain}></SingleChat>
    </Box>
  )
}

export default ChatBox
