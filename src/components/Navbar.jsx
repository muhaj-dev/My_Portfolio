import React from 'react'

import { Box, Text } from '@chakra-ui/react'

export const Navbar = () => {
  return (
    <>
        <Box
          pos="fixed"
          padding="20px 70px"
          bg="bgDark"
          w="100%"
        >
          <Text color="rgb(255, 255, 255);">Muhaj Dev</Text>
            {/* <h1>Muhaj</h1>  */}
        </Box>

    </>
  )
}
