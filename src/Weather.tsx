import { useState } from "react";
import './styles/Weather.css';

interface WeatherType {
    location: string;
    admin1?: string; // The state, however not all countries have states
    temperature: number;
}

export default function Weather(){

    const [city, setCity] = useState<string>("");
    const [weather, setWeather] = useState<WeatherType | null>(null);

    const getWeather = async (): Promise<void> => {
        try {
            const getCoordinates = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`);
            const coordinateData = await getCoordinates.json();

            if (!coordinateData.results || coordinateData.results.length === 0) {
                alert("Could not get coordinate data.")
                return;
            }

            const { latitude, longitude, name, country, admin1 } = coordinateData.results[0];
            const getWeather = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=fahrenheit`);
            const weatherData = await getWeather.json();
            const currentWeather = weatherData.current_weather;

            setWeather({
                location: admin1 ? `${name}, ${admin1}, ${country}` : `${name}, ${country}`,
                temperature: currentWeather.temperature,
            })
        } catch (error) {
            alert("Error: could not get weather!");
        }
    }

    return (
        <div className="weather-main-container">
            <div className="weather-card-container">
                <h1 className="weater-card-title">Weather App</h1>
                <div className="weater-card-input">
                    <input className="weater-card-input-area"
                        placeholder="Type city name here..."
                        onChange={(e) => setCity(e.target.value)}></input>
                    <button className="weater-card-button" onClick={getWeather}>Search</button>
                </div>
                {weather &&
                    (
                        <div className="weater-card-info">
                            <p className="weater-card-location">{weather.location}</p>
                            <p className="weater-card-temperature">{weather.temperature}°F</p>
                        </div>
                    )
                }
            </div>
        </div>
    )
}