import { useTheme } from "@/context/theme-provider"
import { Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom"
import CitySearch from "./CitySearch";


const Header = () => {

    const {theme, setTheme} = useTheme();
    const isDark = theme === "dark";

  return (
    <header className="sticky z-50 top-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
            <Link to={"/"}>
            <img src={isDark ? "/logo.png":"/logo2.png"} alt="klimate logo" className="h-14"/>
            </Link>

            <div className="flex flex-row items-center gap-6">
                <CitySearch />
                <div>
                    <button onClick={() => {setTheme(isDark ? "light" : "dark")}} 
                    className={`flex items-center cursor-pointer transition-transform duration-500 ${isDark ? "rotate-180": "rotate-0"}`}>
                        {isDark ? <Sun className="h-6 w-6 text-yellow-500 rotate-0 transition-all"/>: 
                        <Moon className="h-6 w-6 text-blue-500 rotate-0 transition-all"/>}
                    </button>
                </div>
            </div>
        </div>
    </header>
  )
}

export default Header
