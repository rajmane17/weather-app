import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator
} from "@/components/ui/command"
import { useState } from "react"
import { Clock, Loader2, Search, XCircle } from "lucide-react"
import { Button } from "./ui/button"
import { useLocationSearch } from "@/hooks/use-weather"
import { useNavigate } from "react-router-dom"
import { useSearchHistory } from "@/hooks/use-search-history"
import { format } from "date-fns"

const CitySearch = () => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const { isLoading, data: locations } = useLocationSearch(query);
    const { history, addToHistory, clearHistory } = useSearchHistory(); // we are getting an empty array over here, that's why history is not being shown

    const handleSelect = (cityData: string) => {
        const [lat, lon, name, country] = cityData.split("|");

        //Add to search history
        addToHistory.mutate({
            query,
            lat: parseFloat(lat),
            lon: parseFloat(lon),
            name,
            country,
        }); // we should be returned with newHistory over here but we aren't receiving anything

        setOpen(false);
        setQuery("");
        navigate(`/city/${name}?lat=${lat}&lon=${lon}&country=${country}`);
    }

    return (
        <>
            <Button
                className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
                variant={"outline"}
                onClick={() => { setOpen(true) }
                }>
                <Search className="h-4 w-4 mr-2" />
                Search cities...
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput
                    value={query}
                    onValueChange={setQuery}
                    placeholder="Search a city..." />
                <CommandList>
                    {query.length > 2 && !isLoading && (<CommandEmpty>No cities found.</CommandEmpty>)}

                    {/* Search History Section */}
                    {/* {history.length > 0 && (
                        <>
                            <CommandSeparator />
                            <CommandGroup>
                                <div className="flex items-center justify-between px-2 my-2">
                                    <p className="text-xs text-muted-foreground">
                                        Recent Searches
                                    </p>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => clearHistory.mutate()}
                                    >
                                        <XCircle className="h-4 w-4" />
                                        Clear
                                    </Button>
                                </div>
                                {history.map((item) => (
                                    <CommandItem
                                        key={item.id}
                                        value={`${item.lat}|${item.lon}|${item.name}|${item.country}`}
                                        onSelect={handleSelect}
                                    >
                                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                        <span>{item.name}</span>
                                        {item.state && (
                                            <span className="text-sm text-muted-foreground">
                                                , {item.state}
                                            </span>
                                        )}
                                        <span className="text-sm text-muted-foreground">
                                            , {item.country}
                                        </span>
                                        <span className="ml-auto text-xs text-muted-foreground">
                                            {format(item.searchedAt, "MMM d, h:mm a")}
                                        </span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </>
                    )} */}

                    {/* Search Results */}
                    {locations && locations.length > 0 && (
                        <CommandGroup heading="Suggestions">
                            {isLoading && (
                                <div className="flex items-center justify-center p-4">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                </div>
                            )}
                            {locations?.map((location) => (
                                <CommandItem
                                    key={`${location.lat}-${location.lon}`}
                                    value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                                    onSelect={handleSelect}
                                >
                                    <Search className="mr-2 h-4 w-4" />
                                    <span>{location.name},</span>
                                    {location.state && (
                                        <span className="text-sm text-muted-foreground">
                                            {location.state},
                                        </span>
                                    )}
                                    <span className="text-sm text-muted-foreground">
                                        {location.country}
                                    </span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                </CommandList>
            </CommandDialog>
        </>
    )
}

export default CitySearch
