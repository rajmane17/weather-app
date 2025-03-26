import { API_CONFIG } from "./config"
import { Coordinates, ForecastData, GeoCodingData, WeatherData } from "./types";
import axios from "axios"

class WeatherAPI {

    private createUrl(
        endpoint: string,
        params: Record<string, string | number>
    ): string {

        // explore what this URLSearchParams do
        const searchParams = new URLSearchParams({
            appid: API_CONFIG.API_KEY,
            ...params
        })

        return `${endpoint}?${searchParams.toString()}`;
    }

    // T means it has a dynamic type, 
    // as we are going to use this function in several different functions to fetch several different datas, 
    // which will be in different form
    private async FetchData<T>(url: string): Promise<T> {

        const response = await axios.get(url);

        if (response.statusText !== "OK") {
            throw new Error(`Error in fetching the data: ${response.statusText}`);
        }

        return response.data;
    }

    //gives us the current weather details
    public async getCurrentWeather({ lat, lon }: Coordinates): Promise<WeatherData> {

        const url = this.createUrl(
            `${API_CONFIG.BASE_URL}/weather`,
            {
                //we have provided the appid in the main function already, so we didn't need to add it here.
                lat: lat.toString(),
                lon: lon.toString(),
                units: API_CONFIG.DEFAULT_PARAMS.units
            }
        );

        return this.FetchData<WeatherData>(url);
    }

    //gives us the forecast details
    public async getForeCast({ lat, lon }: Coordinates): Promise<ForecastData> {

        const url = this.createUrl(
            `${API_CONFIG.BASE_URL}/forecast`,
            {
                lat: lat.toString(),
                lon: lon.toString(),
                units: API_CONFIG.DEFAULT_PARAMS.units
            }
        );

        return this.FetchData<ForecastData>(url);
    }

    //gives us the exact location
    public async reverseGeoCode({ lat, lon }: Coordinates): Promise<GeoCodingData> {

        const url = this.createUrl(
            `${API_CONFIG.GEO}/reverse`,
            {
                lat: lat.toString(),
                lon: lon.toString(),
            }
        );

        return this.FetchData<GeoCodingData>(url);
    }

    public async searchLocations(query: string): Promise<GeoCodingData>{

         const url = this.createUrl(
            `${API_CONFIG.GEO}/direct`,
            {
                q: query,
                limit: "5"
            }
        );

        return this.FetchData<GeoCodingData>(url);
    }
}

//creating a instance of the class
export const WeatherApi = new WeatherAPI();