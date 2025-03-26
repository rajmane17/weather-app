import { useEffect, useState } from "react";

//This hook is created to access localStorage using industry standard way
//the key will be a string while we don't have the idea what will be our initialVal. so we are giving it a dynamic type
export function useLocalStorage<T>(key: string, initialVal: T) {

    //Using a callback inside useState ensures:
    // Local storage is read only once.
    // Performance is optimized.
    // Errors are handled safely.
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialVal;
        } catch (error) {
            console.error("Error reading localStorage:", error);
            return initialVal;
        }

    });

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
            console.error(error)
        }
    }, [key, storedValue]) // If there is any change in key or storedValue then this useEffect will run

    return [storedValue, setStoredValue] as const;
}