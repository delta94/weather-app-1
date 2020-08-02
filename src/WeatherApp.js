import React, { useState, useEffect } from 'react';
import WeatherForm from './WeatherForm';
import WeatherTempSelect from './WeatherTempSelect';
import WeatherInfo from './WeatherInfo';
import { convertTemps } from './Helpers';

const API_KEY = process.env.REACT_APP_API_KEY;

function WeatherApp() {
  // make state for weather response
  const [city, setCity] = useState('london');
  const [weather, setWeather] = useState(null);
  const [temps, setTemps] = useState(null);
  const [tempType, setTempType] = useState('c');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(
    () => {
      setIsLoading(true);
      getWeather(city);
    },
    [city]
  );

  const getWeather = async (city) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
      );
      const weatherData = await res.json();
      console.log(weatherData);
      if (weatherData.cod !== 200)
        throw new Error(`${weatherData.cod}: ${weatherData.message}`);
      setWeather({
        city: weatherData.name,
        country: weatherData.sys.country,
        weather: weatherData.weather[0].main,
        description: weatherData.weather[0].description,
        pressure: weatherData.main.pressure,
        humidity: weatherData.main.humidity,
      });
      setTemps({
        temp: weatherData.main.temp,
        max: weatherData.main['temp_max'],
        min: weatherData.main['temp_min'],
        feelsLike: weatherData.main['feels_like'],
      });
      setIsLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <h1>WEATHER APP</h1>
      <WeatherForm setCity={setCity} />
      <WeatherTempSelect tempType={tempType} setTempType={setTempType} />
      {isLoading ? (
        <h1>Loading... </h1>
      ) : (
        <WeatherInfo {...weather} {...convertTemps(temps, tempType)} />
      )}
    </div>
  );
}

export default WeatherApp;
