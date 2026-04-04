import { Button, Field, Group, Input, VStack } from '@chakra-ui/react';
import React, { useState } from 'react'
import { toaster } from "@/components/ui/toaster"
import axios from 'axios';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
//Name
//Email
//password
//confirmpassword
//Picture
const Signup = () => {
  const [show, setshow] = useState(false);
  const [name, setname] = useState();
  const [email, setemail] = useState();
  const [password, setpassword] = useState();
  const [confirmpassword, setconfirmpassword] = useState();
  const [picture, setpicture] = useState();
  const [loading, setloading] = useState(false);
  const history = useHistory();
  const postdetails = (pics) => {
    setloading(true);
    if (pics === undefined) {
      toaster.create({
        title: "Please Select an Image!",
        type: "warning",
      })
      return;
    }
    if (pics.type == "image/jpeg" || pics.type == "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "mern-chat-app");
      fetch("https://api.cloudinary.com/v1_1/dffizjc1q/image/upload", {
        method: "post",
        body: data
      })
        .then((res) => res.json())
        .then((data) => {
          setpicture(data.url.toString()); console.log(data.url.toString());
          setloading(false);
        })
        .catch((err) => {
          console.log(err);
          setloading(false);
        })
    } else {
      toaster.create({
        title: "Please Select an Image!",
        type: "warning",
      })
      setloading(false);
      return;
    }
  }
  const submithandler = async () => {
    setloading(true);
    if (!name || !email || !password || !confirmpassword) {
      toaster.create({
        title: "Invalid!",
        type: "warning",
      })
      setloading(false);
      return;
    }
    if (password != confirmpassword) {
      toaster.create({
        title: "Invalid!",
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
      const { data } = await axios.post("/api/user", {
        name, email, password, picture
      }, config);
      toaster.create({
        title: "Success!",
        type: "success",
      })
      localStorage.setItem('userInfo', JSON.stringify(data));
      setloading(false);
      history.push('/chats');
    } catch (err) {
      toaster.create({
        title: "Invalid!",
        type: "warning",
      })
      setloading(false);
      return;
    }
  }
  return (
    <VStack spacing='5px'>
      <Field.Root required>
        <Field.Label>Name
          <Field.RequiredIndicator />
        </Field.Label>
        <Input placeholder="John Doe" _focus={{
          borderColor: 'blue.400'
        }} onChange={(e) => setname(e.target.value)} />
      </Field.Root>
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
        <Field.Label>Confirm Password</Field.Label>
        <Group attached w="100%" maxW="100%" >
          <Input w='100%' type={show ? "text" : "password"} flex="1" _focus={{
            borderColor: "blue.400"
          }} onChange={(e) => setconfirmpassword(e.target.value)} />
          <Button bg="blue.400" variant="outline" borderColor="blue.400" onClick={() => setshow(!show)}>
            {show ? <div>Hide</div> : <div>Show</div>}
          </Button>
        </Group>
      </Field.Root>
      <Field.Root >
        <Field.Label>
          Upload your Picture
        </Field.Label>
        <Input type='file' p={1} border='none' onChange={(e) => postdetails(e.target.files[0])} />
      </Field.Root>
      <Button w="100%" bg="blue.500" fontFamily="Work sans" borderRadius="md" border="none" color="white" loading={loading} onClick={submithandler}>Sign Up</Button>
    </VStack>
  )
}

export default Signup;
