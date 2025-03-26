import { useWeatherQuery, useForecastQuery } from "@/hooks/use-weather";
import { useParams, useSearchParams } from "react-router-dom"
import { AlertTriangle } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../components/ui/alert"
import WeatherSkeleton from "@/components/loading-skeleton";
import CurrentWeather from "@/components/CurrentWeather";
import HourlyTemprature from "@/components/HourlyTemprature";
import WeatherDetails from "@/components/WeatherDetails";
import WeatherForecast from "@/components/WeatherForecast";
// import FavoriteButton from "@/components/FavoriteButton";

const CityPage = () => {

  const [searchParams] = useSearchParams(); // helps us to get query parameters
  const params = useParams(); // helps us to get params
  const lat = parseFloat(searchParams.get("lat") || "0"); // In this way we can extract the query
  const lon = parseFloat(searchParams.get("lon") || "0");

  const coordinates = { lat, lon };
  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);

  if (forecastQuery.error || weatherQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Failed to fetch weather data. Please try again later.</p>
        </AlertDescription>
      </Alert>
    )
  }

  if(!weatherQuery.data || !forecastQuery.data || !params.cityName){
    return <WeatherSkeleton />
  }

  return (
<div className="space-y-4">
      {/* favorites cities */}
      {/* <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{params.cityName}, {weatherQuery.data.sys.country}</h1>
        <div>
          <FavoriteButton data={{...weatherQuery.data, query:params.cityName}}/>
        </div>
      </div> */}


      <div className="grid gap-6">
        <div className="flex flex-col gap-4">
          <CurrentWeather data={weatherQuery.data} />
          <HourlyTemprature data={forecastQuery.data} />
        </div>

        <div className="grid gap-6 md:grid-cols-2 items-start">
            <WeatherDetails data={weatherQuery.data} />
            <WeatherForecast data={forecastQuery.data}/>
        </div>
      </div>
    </div>
  )
}

export default CityPage
