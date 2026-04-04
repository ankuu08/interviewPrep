import { VStack } from '@chakra-ui/react';
import React, { useState } from 'react'
import { Button, Field, Group, Input } from '@chakra-ui/react';
import { toaster } from "@/components/ui/toaster"
import axios from 'axios';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useChatState } from '@/context/ChatProvider';
const Login = () => {
  const { setuser } = useChatState();
  const [show, setshow] = useState(false);
  const [email, setemail] = useState();
  const [password, setpassword] = useState();
  const [loading, setloading] = useState(false);
  const history = useHistory();
  const submitHandler = async () => {
    setloading(true);
    if (!email || !password) {
      toaster.create({
        title: "Email or Password is missing!",
        type: "warning",
      })
      setloading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json"
        }
      }
      const { data } = await axios.post("/api/user/login", {
        email, password
      }, config);
      toaster.create({
        title: "Success!",
        type: "success",
      })
      localStorage.setItem("userInfo", JSON.stringify(data));
      setuser(data);
      setloading(false);
      history.push('/chats');
    } catch (error) {
      toaster.create({
        title: error.response?.data?.message || "Login failed!",
        type: "warning",
      })
      setloading(false);
      return;
    }
  }
  return (
    <VStack spacing="5px">
      <Field.Root required>
        <Field.Label fontFamily='Work Sans'>
          Email
          <Field.RequiredIndicator />
        </Field.Label>
        <Input placeholder="me@example.com" fontFamily='Work Sans' _focus={{
          bg: "white",
          borderColor: "blue.400",
          boxShadow: "none",
        }}
          _selected={{
            bg: "white",
          }}
          onChange={(e) => setemail(e.target.value)} />
      </Field.Root>
      <Field.Root>
        <Field.Label>Password</Field.Label>
        <Group attached w="100%" maxW="100%" >
          <Input w='100%' type={show ? "text" : "password"} flex="1" _focus={{
            borderColor: "blue.400"
          }} onChange={(e) => setpassword(e.target.value)} />
          <Button bg="blue.400" variant="outline" borderColor="blue.400" onClick={() => setshow(!show)}>
            {show ? <div>Hide</div> : <div>Show</div>}
          </Button>
        </Group>
      </Field.Root>
      <Button w='100%' bg='blue.500' border='none' borderRadius='md' fontFamily='Work sans' color='white' loading={loading} onClick={submitHandler}>Login</Button>
      <Button w='100%' bg='red.500' border='none' borderRadius='md' fontFamily='Work sans' color='white' loading={loading} onClick={() => {
        setemail("guest@example.com");
        setpassword("123456");
      }}>Get Guest User Credential</Button>
    </VStack>
  )
}

export default Login;
