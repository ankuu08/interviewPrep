import React, { useState } from 'react'
import { Button, Center, CloseButton, Dialog, Portal, Text, Avatar } from "@chakra-ui/react"
import { FaRegEye } from "react-icons/fa";
function ProfileModal({ user, info }) {
  console.log(user);
console.log(user.pic);
  const [open, setOpen] = useState(false)
  return (
    <>
      <Dialog.Root placement="center" size="sm" >
        <Dialog.Trigger asChild>
          <Button m={0} p={2} fontFamily="Work sans" justifyContent="flex-start" _focus={{ outline: "none", boxShadow: "none" }} bg={info === "" ? "gray.300" : "black"} color={info === "" ? "black" : "white"}>
            {info === "" ? (
              <FaRegEye bg="gray.300" />
            ) : (<p>{info}</p>)}
          </Button>
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content bg="gray.800" color="white">
              <Dialog.Header display="flex" justifyContent="center">
                <Dialog.Title fontFamily="Work sans" fontSize="3xl" textAlign="center">{user.name}</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body display="flex" justifyContent="center">
                <Avatar.Root size="2xl">
                  <Avatar.Fallback name={user.name} />
                  <Avatar.Image src={user.pic} />
                </Avatar.Root>
              </Dialog.Body>
              <Dialog.Footer display="flex" justifyContent="center">
                <Text fontSize="2xl" fontFamily="Work sans" color="gray">Email:{user.email}</Text>
              </Dialog.Footer>
              <Dialog.CloseTrigger border="none" asChild borderWidth="0px" focusRing="none">
                <CloseButton size="sm" color="black" _hover={{ bg: "blue.300" }} />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  )
}

export default ProfileModal
