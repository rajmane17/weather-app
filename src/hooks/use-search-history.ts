//this hook is created to manage the search history

import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "./use-local-storage";

//useLocalStorage will return us the data in this format in an array 
interface searchHistoryItem {
    id: string,
    query: string,
    lat: number,
    lon: number,
    name: string,
    country: string,
    state?: string,
    searchedAt: number //time
}

export function useSearchHistory() {
    const [history, setHistory] = useLocalStorage<searchHistoryItem[]>("search-history", []); // history is an array

    const queryClient = new QueryClient();

    const historyQuery = useQuery({
        queryKey: ["search-history"],
        queryFn: () => history,
        initialData: history
    });

    const addToHistory = useMutation({
        mutationFn: async( search:Omit<searchHistoryItem, "id" | "searchedAt"> ) => {
            const newSearch: searchHistoryItem = {
                ...search,
                id: `${search.lat}-${search.lon}-${Date.now()}`,
                searchedAt: Date.now(),
            }

             const filteredHistory = history.filter(item => !(item.lat === search.lat && item.lon === search.lon));

             const newHistory = [newSearch, ...filteredHistory].slice(0, 10);

             setHistory(newHistory);
             return newHistory;
        },
        onSuccess: (newHistory) => {
            queryClient.setQueryData(["search-history"], newHistory);
        }
    })

    const clearHistory = useMutation({
        mutationFn: async() => {
            setHistory([]);
            return [];
        },
        onSuccess: () => {
            queryClient.setQueryData(["search-history"], []);
        }
    })

    return {
        history: historyQuery.data??[],
        addToHistory,
        clearHistory
    }
}