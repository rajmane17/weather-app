import type { Coordinates } from "@/api/types";
import { WeatherApi } from "@/api/weather";
import { useQuery } from "@tanstack/react-query";

export const WEATHER_KEYS = {
    weather: (coords: Coordinates) => ["weather", coords] as const,
    forecast: (coords: Coordinates) => ["forecast", coords] as const,
    reversegeocode: (coords: Coordinates) => ["reversegeocode", coords] as const,
    search: (query: string) => ["search-location", query] as const
}

export function useWeatherQuery(coordinates: Coordinates | null) {
    return useQuery({
        queryKey: WEATHER_KEYS.weather(coordinates ?? { lat: 0, lon: 0 }),
        queryFn: () => coordinates ? WeatherApi.getCurrentWeather(coordinates) : null,
        enabled: !!coordinates,
    })
}

export function useForecastQuery(coordinates: Coordinates | null) {
    return useQuery({
        queryKey: WEATHER_KEYS.forecast(coordinates ?? { lat: 0, lon: 0 }),
        queryFn: () => coordinates ? WeatherApi.getForeCast(coordinates) : null,
        enabled: !!coordinates,
    })
}

export function useReverseGeoCodeQuery(coordinates: Coordinates | null) {
    return useQuery({
        queryKey: WEATHER_KEYS.reversegeocode(coordinates ?? { lat: 0, lon: 0 }),
        queryFn: () => coordinates ? WeatherApi.reverseGeoCode(coordinates) : null,
        enabled: !!coordinates,
    })
}

export function useLocationSearch(query: string){
    return useQuery({
        queryKey: WEATHER_KEYS.search(query ?? {query: ""}),
        queryFn: () => WeatherApi.searchLocations(query),
        enabled: query.length >= 3,
    })
}