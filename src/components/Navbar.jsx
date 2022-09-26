import React from 'react'

import { Box, Text } from '@chakra-ui/react'

export const Navbar = () => {
  return (
    <Box
      pos="fixed"
      padding="20px 70px"
      bg="bgDark"
      color="white"
      w="100%"
    >
      <Text color="white" fontSize="28px" fontWeight="600">Muhaj Dev</Text>
    </Box>
  )
}