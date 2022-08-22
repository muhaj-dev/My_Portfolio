import { Box, Button, Text } from '@chakra-ui/react'
import React from 'react'
import { Navbar } from '../components/Navbar'

const Home = () => {
  return (
    <div className='h'>
        <Box zIndex="3">
            <Navbar />
            <Text color="white" >hjkk</Text>
            <h1>Muhaj</h1> 
        </Box>

    </div>
  )
}

export default Home