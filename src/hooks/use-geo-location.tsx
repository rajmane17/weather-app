import { useEffect, useState } from "react";
import type { Coordinates } from "@/api/types";

interface GeoLocationState {
    coordinates: Coordinates | null;
    isLoading: boolean,
    error: string | null
}


export function useGeoLocation() {
    
    const [locationData, setLocationData] = useState<GeoLocationState>({
        coordinates: null,
        isLoading: true,
        error: null
    })

    function getLocation() {

        setLocationData((prevData) => ({
            ...prevData,
            isLoading: true,
            error: null
        }))

        //This is an inbuild function, which provides us with the location details
        if (!navigator.geolocation) {
            setLocationData({
                coordinates: null,
                isLoading: false,
                error: "Geo location is not supported by your browser"
            })
            return;
        }

        console.log("fetching the location co-ordinates");

        navigator.geolocation.getCurrentPosition(
            (position) => {
                //setting the latitude and longitude
                setLocationData({
                    coordinates: {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    },
                    isLoading: false,
                    error: null
                })
            },// error call back
            (error) => {
                let errorMessage: string;

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage =
                            "Location permission denied. Please enable location access.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = "Location information is unavailable.";
                        break;
                    case error.TIMEOUT:
                        errorMessage = "Location request timed out.";
                        break;
                    default:
                        errorMessage = "An unknown error occurred.";
                }

                setLocationData({
                    coordinates: null,
                    isLoading: false,
                    error: errorMessage
                });

            },
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 5000
            }
        )
    }

    useEffect(() => {
        getLocation();
    }, [])

    return {
        ...locationData, 
        getLocation
    }
}