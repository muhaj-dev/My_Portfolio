import { Box, Button, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { Navbar } from '../components/Navbar'

const Home = () => {
  return (
    <Box>
        <Box  zIndex="233">
            <Navbar />
        </Box>
        <Box className='hero'>
            <Flex 
                w="100%"
                h="100%"
                bg="bgDark"
                opacity=".5"
            >

            </Flex>
        </Box>
    </Box>
  )
}

export default Home