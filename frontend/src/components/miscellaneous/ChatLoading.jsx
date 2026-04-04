import { Box } from '@chakra-ui/react'
import React from 'react'
import { SkeletonText } from "@chakra-ui/react"
function ChatLoading() {
  return (
    <Box>
      <SkeletonText noOfLines={19} gap="4" />
    </Box>
  )
}

export default ChatLoading
