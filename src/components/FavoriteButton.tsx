import { WeatherData } from "@/api/types"
import { Star } from "lucide-react"
import { Button } from "./ui/button"
import { useFavorite } from "@/hooks/use-favorite"
import { toast } from "sonner"

interface FavoritesButtonProps {
    data?: WeatherData
}

const FavoriteButton = ({ data }: FavoritesButtonProps) => {
    const { isFavorite, addToFavorite, deleteFavorite } = useFavorite();

    // Ensure safe access to lat and lon
    const lat = data?.coords?.lat;
    const lon = data?.coords?.lon;

    // Only check favorite status if both lat and lon are defined
    const isCurrentlyFavorite = lat !== undefined && lon !== undefined 
        ? isFavorite(lat, lon) 
        : false;

    const handleToggleFavorite = () => {
        if (!data || lat === undefined || lon === undefined) {
            toast.error("Cannot add favorite: Invalid location data");
            return;
        }

        if (isCurrentlyFavorite) {
            deleteFavorite.mutate(`${lat}-${lon}`);
            toast.error(`Removed ${data.name} from Favorites`);
        } else {
            addToFavorite.mutate({
                lat,
                lon,
                country: data.sys.country,
                name: data.name
            });
            toast.success(`Added ${data.name} to Favorites`);
        }
    }

    return (
        <Button
            variant={isCurrentlyFavorite ? "default" : "outline"}
            size="icon"
            onClick={handleToggleFavorite}
            className={isCurrentlyFavorite ? "bg-yellow-500 hover:bg-yellow-600" : ""}
        >
            <Star
                className={`h-4 w-4 ${isCurrentlyFavorite ? "fill-current" : ""}`}
            />
        </Button>
    )
}

export default FavoriteButton