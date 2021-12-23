import useSWR from "swr";
import "./App.css";

function getIcon(data) {
  return data.properties.timeseries[0].data.next_1_hours.summary.symbol_code;
}

function getTemperature(data) {
  return data.properties.timeseries[0].data.instant.details.air_temperature;
}

function WeatherWidget({ cityName, city }) {
  const temperature = Math.round(getTemperature(city));
  const icon = getIcon(city);

  return (
    <div className="weather-widget">
      <img width="50" src={`/weather-icons/svg/${icon}.svg`} alt={`${icon}`} />

      <div className="weather-widget__text">
        <p
          className={`weather-widget__temperature--${
            temperature < 0 ? "cold" : "warm"
          }`}
        >
          {temperature}°
        </p>

        <p>{cityName}</p>
      </div>
    </div>
  );
}

function App() {
  const useWeatherRequest = (lat, lon) =>
    useSWR(
      `https://api.met.no/weatherapi/locationforecast/2.0/compact.json?lat=${lat}&lon=${lon}`
    );

  const { data: oslo, error: osloError } = useWeatherRequest(59.9333, 10.7166);

  const { data: bergen, error: bergenError } = useWeatherRequest(
    60.3913,
    5.3221
  );

  const { data: tokyo, error: tokyoError } = useWeatherRequest(
    35.6762,
    139.6503
  );

  const { data: toronto, error: torontoError } = useWeatherRequest(
    43.6532,
    79.3832
  );

  const error = osloError || bergenError || tokyoError || torontoError;
  const loading = !oslo || !bergen || !tokyo || !toronto;

  if (error) {
    return <div>Error</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <div className="weather-items">
        <WeatherWidget cityName="Oslo" city={oslo} />

        <WeatherWidget cityName="Bergen" city={bergen} />

        <WeatherWidget cityName="Tokyo" city={tokyo} />

        <WeatherWidget cityName="Toronto" city={toronto} />
      </div>
    </div>
  );
}

export default App;
