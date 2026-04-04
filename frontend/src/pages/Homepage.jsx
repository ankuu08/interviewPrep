import Login from '@/components/auth/Login'
import Signup from '@/components/auth/Signup'
import { Box, Container, Text, Tabs } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom'

function Homepage() {
  const history = useHistory();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      history.push('/chats');
    }
  }, [history])
  return (
    <Container maxW="xl" centerContent>
      <Box d="flex" justifyContent="center" alignItems="center" p={3} bg={'white'} w="100%" m="40px 0 15px 0" borderRadius="lg" borderWidth="1px" borderColor="white">
        <Text fontSize="4xl" color='black' textAlign="center" fontFamily='Work sans'>interviewPrep</Text>
      </Box>
      <Box w='100%' bg='white' borderRadius='lg' borderWidth='1px' borderColor='white' p={4}>
        <Tabs.Root defaultValue="first">
          <Tabs.List>
            <Tabs.Trigger value="first" color='black' width='50%' textAlign='center' justifyContent='center' fontFamily='Work sans' rounded="sm" _selected={{
              bg: "blue.300",

            }}>Login</Tabs.Trigger>
            <Tabs.Trigger value="second" color='black' width='50%' textAlign='center' fontFamily='Work sans' justifyContent='center' rounded="sm" _selected={{
              bg: "blue.300",
            }}>Signup</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="first" color="black"><Login></Login></Tabs.Content>
          <Tabs.Content value="second" color='black'><Signup></Signup></Tabs.Content>
        </Tabs.Root>
      </Box>
    </Container>
  )
}

export default Homepage
