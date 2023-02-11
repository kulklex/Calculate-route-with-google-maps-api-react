import React, { useState, useEffect, useRef } from 'react'
import {Box,Button,ButtonGroup,Flex,SkeletonText,HStack,IconButton,Input,Text,} from '@chakra-ui/react'
import { FaLocationArrow, FaTimes } from 'react-icons/fa'



import { useJsApiLoader, GoogleMap, Marker, Autocomplete, DirectionsRenderer } from '@react-google-maps/api' 




function App() {

// useJsAPILoader gives something similar to isLoading 
const {isLoaded} = useJsApiLoader({
  googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API,
  
  // Setting tll the Google Libraries API we want to make use of, e.g placesAPI
  libraries: ['places']
})

const eiffelTowerCoord = {lat: 48.8584, lng: 2.2945}


//Automatically set the coordinates to be the coordinates of the users location
const [coordinates, setCoordinates] = useState({})
useEffect(() => {
  navigator.geolocation.getCurrentPosition(({coords: {latitude, longitude}}) => {
    setCoordinates({lat: latitude, lng: longitude})
  })
}, [])

const [map, setMap] = useState(null)
const [direction, setDirection] = useState(null);
const [distance, setDistance] = useState('');
const [duration, setDuration] = useState('');

const originRef = useRef()
const destinationRef = useRef()



const calculateRoute = async() => {
  // Firstly we make sure the origin and destination inputs are not empty
  if(originRef.current.value === '' || destinationRef.current.value === '') return

  // After that we can calculate the route
  // eslint-disable-next-line no-undef
  const directionService = new google.maps.DirectionsService()
  const results = await directionService.route({
    origin: originRef.current.value,
    destination: destinationRef.current.value,
    // eslint-disable-next-line no-undef
    travelMode: google.maps.TravelMode.DRIVING
  })
  setDirection(results)
  setDistance(results.routes[0].legs[0].distance.text)
  setDuration(results.routes[0].legs[0].duration.text)
}


const clearRoute = () => {
  setDirection('')
  setDistance('')
  setDuration('')
  originRef.current.value = ''
  destinationRef.current.value = ''
}

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
        <GoogleMap center={coordinates} zoom={15} 
          mapContainerStyle={{width: '100%', height: '100%'}}
          options={{zoomControl: false, fullscreenControl: false, mapTypeControl: false, streetViewControl: false}}
          onLoad={(map) => setMap(map)}>
          <Marker position={coordinates}/>
          <Marker position={eiffelTowerCoord}/> {/*Just to confirm we can set multiple markers */}
          {direction && <DirectionsRenderer directions={direction} />}
        </GoogleMap>
      </Box>

      <Box
        p={4}
        borderRadius='lg'
        mt={4}
        bgColor='white'
        shadow='base'
        minW='container.md'
        zIndex='1'
      >
        <HStack spacing={4}>
          <Autocomplete>
            <Input type='text' placeholder='Origin' ref={originRef} />
          </Autocomplete>

          <Autocomplete>
            <Input type='text' placeholder='Destination' ref={destinationRef} />
          </Autocomplete>
          
          <ButtonGroup>
            <Button colorScheme='pink' type='submit' onClick={calculateRoute}>
              Calculate Route
            </Button>
            
            <IconButton
              aria-label='center back'
              icon={<FaTimes />}
              onClick={clearRoute}
            />
          </ButtonGroup>
        </HStack>
        <HStack spacing={4} mt={4} justifyContent='space-between'>
          <Text>Distance: {distance}</Text>
          <Text>Duration: {duration}</Text>
          <IconButton
            aria-label='center back'
            icon={<FaLocationArrow />}
            isRound
            //Setting this button to always return to your default coordinate
            onClick={() => map?.panTo(coordinates)}
          />
        </HStack>
      </Box>
    </Flex>
  )
}

export default App