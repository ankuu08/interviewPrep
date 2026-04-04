import ChatBox from '@/components/miscellaneous/ChatBox'
import MyChats from '@/components/miscellaneous/MyChats'
import SideDrawer from '@/components/miscellaneous/SideDrawer'
import { useChatState } from '@/context/ChatProvider'
import { Box } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

function Chatpage() {
  const [fetchAgain, setfetchAgain] = useState(false);
  const { user } = useChatState()
  return (
    <Box w='100%' p={2}>
      {user && <SideDrawer></SideDrawer>}
      <Box width='100%' h='91.5vh' display='flex' justifyContent='space-between' p='20px'>
        {user && <MyChats fetchAgain={fetchAgain} setfetchAgain={setfetchAgain}></MyChats>}
        {user && <ChatBox fetchAgain={fetchAgain} setfetchAgain={setfetchAgain}></ChatBox>}
      </Box>
    </Box>
  )
}

export default Chatpage
