import React from 'react'
import { Box } from "@chakra-ui/react"
import { Avatar, HStack, Stack, Text } from "@chakra-ui/react"
function ChatList({ user, handlefunction, onClick }) {
  return (
    <Box display="flex" gap={2} color="black" bg="gray.200" p={2} fontFamily="Work sans" borderRadius="4px" _hover={{ bg: "#38B2ac", color: "white" }} onClick={() => {
      onClick()
    }}>
      <Avatar.Root>
        <Avatar.Fallback name={user.name} />
        <Avatar.Image src={user.pic} />
      </Avatar.Root>
      <Stack gap="0" >
        <Text fontWeight="medium">{user.name}</Text>
        <Text textStyle="sm" >
          <b></b>{user.email}
        </Text>
      </Stack>
    </Box >
  )
}

export default ChatList
