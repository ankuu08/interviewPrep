import { Box } from '@chakra-ui/react'
import React from 'react'
import { IoIosClose } from "react-icons/io";
function UserBadge({ user, onClick }) {
  return (
    <Box bg="purple.600" fontSize="12px" fontFamily="Work sans" borderRadius="lg" m={1} mb={2} p={1} color="whiteAlpha.900" cursor="pointer" display="flex" justifyContent="space-between">
      {user.name}
      <IoIosClose size="20px" onClick={() => {
        onClick();
      }} />
    </Box>
  )
}

export default UserBadge
