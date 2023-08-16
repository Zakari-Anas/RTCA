import React from 'react';
import ranya from '../images/ranya.png';
import '../sass/Post.scss';
import { ChakraProvider } from '@chakra-ui/react'
import { Box, Text,Button, ButtonGroup} from '@chakra-ui/react';
import { Stack } from '@chakra-ui/react';
import { Avatar, Badge, Flex } from '@chakra-ui/react';

function Posts() {
  return (
    <ChakraProvider>
        <Flex>
          <Avatar src='https://bit.ly/sage-adebayo' />
          <Box ml='3'>
            <Text fontWeight='bold'>
              Segun Adebayo
              <Badge ml='1' colorScheme='green'>
                New
              </Badge>
            </Text>
            <Text fontSize='sm'>UI Engineer</Text>
          </Box>
        </Flex>
     </ChakraProvider>
     
  );
}

export default Posts;