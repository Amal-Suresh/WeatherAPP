import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import clear from '../../Assets/clear.png'
import cloud from '../../Assets/cloud.png'
import humidity from '../../Assets/humidity.png'
import wind from '../../Assets/wind.png'
import snow from '../../Assets/snow.png'
import drizzle from '../../Assets/drizzle.png'
import rain from '../../Assets/rain.png'


function WeatherApp() {
  const Api = "083d44f5ef41be5f2eee4334c14cba21"
  const [searchInput, setSearchInput] = useState('')
  const [values, setValues] = useState({})
  const [image, setImage] = useState('')
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const formatDate = (date) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString(undefined, options);
  };

  const formatTime = (date) => {
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    };
    return date.toLocaleTimeString(undefined, options);
  };

  const currentDay = () => {
    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const dayIndex = currentDateTime.getDay();
    return daysOfWeek[dayIndex];
  };

  useEffect(() => {
    findCurrentLocation()
  }, [])

  useEffect(() => {
    if(values.icon==='01d' || values.icon==='01n'){
      setImage(clear)
    }else if(values.icon==='02d' || values.icon==='02n'){
      setImage(cloud)
    }else if(values.icon==='03d' || values.icon==='03n' || values.icon==='04d' || values.icon==='04n'){
      setImage(drizzle)
    } else if (values.icon==='09d' || values.icon==='09n' || values.icon==='10d' || values.icon==='10n'){
      setImage(rain)
    }else if(values.icon==='13d' || values.icon==='13n'){
      setImage(snow)
    }else{
      setImage(clear)
    }
}, [values])

  const fetchBYCity = async () => {
    try {
      if (searchInput !== '') {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&units=Metric&appid=${Api}`)
        if (response.data) {
          const data = {
            city: response.data.name,
            wind: response.data.wind.speed,
            temp: response.data.main.temp,
            humidity: response.data.main.humidity,
            icon: response.data.weather[0].icon
          }
          setValues(data)
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const findCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        const data = {
          latitude,
          longitude
        }
        findWeatherDetailsForCurrent(data)
      })
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  const findWeatherDetailsForCurrent = async (data) => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${data.latitude}&lon=${data.longitude}&units=Metric&appid=${Api}`)
      if (response.data) {
        const data = {
          city: response.data.name,
          wind: response.data.wind.speed,
          temp: response.data.main.temp,
          humidity: response.data.main.humidity,
          icon: response.data.weather[0].icon
        }
        setValues(data)
      }
    } catch (error) {
      console.log(error.message);
    }
  }


  return (
    <div className='bg-gradient-to-r from-purple-300 to-purple-400 w-full h-screen  flex flex-col justify-center items-center '>
      <h1 className='font-black-ops text-[30px] text-white'>WEATHER APP</h1>
      <div className='flex justify-between w-[20rem] md:w-[25rem] px-1 md:px-2'> 
        <p className='text-white font-bold'>{formatDate(currentDateTime)}</p>
        <p className='text-white font-bold'>{currentDay()}</p>
        <p className='text-white font-bold'>{formatTime(currentDateTime)}</p>
      </div>

      {values.city &&
        <div className='w-[20rem] md:w-[25rem] h-[30rem] bg-purple-500 rounded-lg'>
          <div className='mt-9 flex justify-center'>
            <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className='rounded-full px-4 py-2' placeholder='Enter City' />
            <button onClick={fetchBYCity} className=' ml-2 p-4 bg-white rounded-full'><AiOutlineSearch /></button>
          </div>
          <div className='flex flex-col mt-5 justify-center items-center'>
            <img className='w-28 h-28' src={image} alt="" />
            <div>
              <p className='text-[50px] text-center font-bold text-white'>{values?.temp} &#176;C</p>
              <p className='text-[50px] font-bold text-center text-white'>{values?.city}</p>
            </div>
          </div>
          <div className='flex justify-around  mt-5' >
            <div className='flex flex-col'>
              <div className='flex '>
                <img src={humidity} alt="" />
                <p className='text-[20px] text-center font-bold text-white ml-2'>{values?.humidity}%</p>
              </div>
              <p className='text-[20px] text-start font-bold text-white'>Humidity</p>
            </div>
            <div className='flex flex-col'>
              <div className='flex '>
                <img src={wind} alt="" />
                <p className='text-[20px] text-center font-bold text-white ml-2'>{values?.wind}km/hr</p>
              </div>
              <p className='text-[20px] text-start font-bold text-white'>Wind</p>
            </div>
          </div>
        </div>
      }
      {!values.city &&
        <div>
          <p className='text-red-500 text-[16px] font-bold'>please allow access to location</p>
        </div>
      }
    </div>
  )
}

export default WeatherApp