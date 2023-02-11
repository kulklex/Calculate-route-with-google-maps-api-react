import React, { useState, useEffect } from 'react'
import {Box,Button,ButtonGroup,Flex,SkeletonText,HStack,IconButton,Input,Text,} from '@chakra-ui/react'
import { FaLocationArrow, FaTimes } from 'react-icons/fa'



import { useJsApiLoader, GoogleMap } from '@react-google-maps/api' 




function App() {

// useJsAPILoader gives something similar to isLoading 
const {isLoaded} = useJsApiLoader({
  googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API
})

// Heifel Tower Lat & Lng
const [coordinates, setCoordinates] = useState({})

//Automatically set the coordinates to be the coordinates of the users location
useEffect(() => {
  navigator.geolocation.getCurrentPosition(({coords: {latitude, longitude}}) => {
    setCoordinates({lat: latitude, lng: longitude})
  })
}, [])

if (!isLoaded) {
  return <SkeletonText />
}


  return (
    <Flex
      position='relative'
      flexDirection='column'
      alignItems='center'
      bgColor='blue.200'
      bgImage='https://images.unsplash.com/photo-1647117181799-0ac3e50a548a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'
      bgPos='bottom'
      h='100vh'
      w='100vw'
    >
      <Box position='absolute' left={0} top={0} h='100%' w='100%'>
        <GoogleMap center={coordinates} zoom={15} mapContainerStyle={{width: '100%', height: '100%'}}>
    {'Display'}
        </GoogleMap>
      </Box>

      <Box
        p={4}
        borderRadius='lg'
        mt={4}
        bgColor='white'
        shadow='base'
        minW='container.md'
        zIndex='modal'
      >
        <HStack spacing={4}>
          <Input type='text' placeholder='Origin' />
          <Input type='text' placeholder='Destination' />
          <ButtonGroup>
            <Button colorScheme='pink' type='submit'>
              Calculate Route
            </Button>
            <IconButton
              aria-label='center back'
              icon={<FaTimes />}
              onClick={() => alert(123)}
            />
          </ButtonGroup>
        </HStack>
        <HStack spacing={4} mt={4} justifyContent='space-between'>
          <Text>Distance: </Text>
          <Text>Duration: </Text>
          <IconButton
            aria-label='center back'
            icon={<FaLocationArrow />}
            isRound
            onClick={() => alert(123)}
          />
        </HStack>
      </Box>
    </Flex>
  )
}

export default App