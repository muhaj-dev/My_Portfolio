import { Box, Button, Text } from '@chakra-ui/react'
import React from 'react'
import { Navbar } from '../components/Navbar'

const Home = () => {
  return (
    <div className='h'>
        <Box p="0 70px">
            <Navbar />
        </Box>
    </div>
  )
}

export default Home