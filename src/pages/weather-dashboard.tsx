import WeatherSkeleton from "@/components/loading-skeleton";
import { Button } from "@/components/ui/button"
import { useGeoLocation } from "@/hooks/use-geo-location"
import { AlertTriangle, MapPin, RefreshCw } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../components/ui/alert"
import { useForecastQuery, useReverseGeoCodeQuery, useWeatherQuery } from "@/hooks/use-weather";
import CurrentWeather from "@/components/CurrentWeather";
import HourlyTemprature from "@/components/HourlyTemprature";
import WeatherDetails from "@/components/WeatherDetails";
import WeatherForecast from "@/components/WeatherForecast";
// import FavoriteCities from "@/components/FavoriteCities";

const WeatherDashboard = () => {

  //creating a custom hook to fetch our location
  const { coordinates, error: locationError, isLoading: locationLoading, getLocation } = useGeoLocation();

  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);
  const locationQuery = useReverseGeoCodeQuery(coordinates);

  const handleRefresh = () => {
    getLocation(); // when we call this function our states are getting re-updated

    if (coordinates) {
      //we are refetching all of these as our location is changed, so we need data related to that location
      weatherQuery.refetch();
      forecastQuery.refetch();
      locationQuery.refetch();
    }

  };

  if (locationLoading) {
    return <WeatherSkeleton />
  }

  if (locationError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>{locationError}</p>
          {/* <Button onClick={getLocation} variant={"outline"} className="w-fit">
            <MapPin className="h-4 w-r mr-2"/>
            Enable Location
          </Button> */}
        </AlertDescription>
      </Alert>
    )
  }

  if (!coordinates) {
    //It's an edge case
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Location Required</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Please enable location too see your local weather.</p>
          <Button onClick={getLocation} variant={"outline"} className="w-fit">
            <MapPin className="h-4 w-r mr-2" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  const locationName = locationQuery.data?.[0];

  if (forecastQuery.error || weatherQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Failed to fetch weather data. Please try again later.</p>
          <Button onClick={handleRefresh} variant={"outline"} className="w-fit">
            <RefreshCw className="h-4 w-r mr-2" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (!weatherQuery.data || !forecastQuery.data) {
    return <WeatherSkeleton />
  }

  //we have the lat & lon, so we need to fetch reverse geo-coding api first
  //then we can fetch the forecast data

  return (
    <div className="space-y-4">
      {/*Favorite city component*/}
      {/* <FavoriteCities /> */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">My Location</h1>
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={handleRefresh}
          disabled={weatherQuery.isFetching || forecastQuery.isFetching}
          className={`h-4 w-4 cursor-pointer ${weatherQuery.isFetching ? "animate-spin" : ""}`}
        >
          <RefreshCw />
        </Button>
      </div>


      <div className="grid gap-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <CurrentWeather data={weatherQuery.data} locationName={locationName} />
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

export default WeatherDashboard
