import axios from 'axios';
import React,{useEffect} from 'react'



function WeatherApp() {
  useEffect(()=>{
    findCurrentLocation()
  },[])
  const findCurrentLocation =async()=>{
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
  
      })
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }
  return (
    <div>
        <h1 className=''>HII </h1>

    </div>
  )
}

export default WeatherApp