import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "./use-local-storage"

interface favoriteItem {
    id: string,
    lat: number,
    lon: number,
    name: string;
    addedAt: number,
    country: string,
    state?: string
}

export const useFavorite = () => {

    const [favorites, setFavorites] = useLocalStorage<favoriteItem[]>("favorites", []);

    const queryClient = new QueryClient();

    // To fetch all the items present in the favorite
    const favoriteQuery = useQuery({
        queryKey: ["favorites"],
        // It returns the current state of favorites.
        //This approach is slightly unusual because typically queryFn would involve an API call or asynchronous data fetching. 
        //Here, it's simply returning the existing local storage data synchronously.
        queryFn: () => favorites,
        initialData: favorites
    })

    const addToFavorite = useMutation({

        mutationFn: async (item: Omit<favoriteItem, "id" | "addedAt">) => {
            const newItem = {
                ...item,
                id: `${item.lat}-${item.lon}`,
                addedAt: Date.now()
            }

            //checking if it is already present in the favorites
            const filteredFavorites = favorites.filter(obj => !(item.lat === obj.lat && item.lon === obj.lon));

            const finalFav: favoriteItem[] = [...filteredFavorites, newItem];
            setFavorites(finalFav); // setting the favorites in the local storage
            console.log("added to favorites");
            return finalFav;
        },
        onSuccess: (favorites) => {
            queryClient.setQueryData(["favorites"], favorites);
        }
    })

    const deleteFavorite = useMutation({
        mutationFn: async (cityId: string) => {
            const newFavorites = favorites.filter(item => (item.id !== cityId));

            setFavorites(newFavorites);
            console.log("removed from favorites");
            return newFavorites
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["favorites"]
            })
        }
    })

    return {
        favoriteQuery: favoriteQuery.data ?? [],
        addToFavorite,
        deleteFavorite,
        isFavorite: (lat: number, lon: number) => {
            return favorites.some((city) => city.lat === lat && city.lon === lon);
        }
    }
}