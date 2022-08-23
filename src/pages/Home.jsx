import { Box, Button, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { Navbar } from '../components/Navbar'

const Home = () => {
  return (
    <Box>
        <Box
            top="0"
            bottom="0"
        >
            <Navbar />
        </Box>
        <Box className='hero'>
            <Flex 
                w="100%"
                h="100%"
                bg="bgDark"
                opacity=".9"
            >
{/* text */}
            </Flex>
        </Box>
    </Box>
  )
}

export default Home