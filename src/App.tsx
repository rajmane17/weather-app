import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import { ThemeProvider } from "./context/theme-provider.tsx"

//pages
import WeatherDashboard from "./pages/weather-dashboard.tsx"
import CityPage from "./pages/city-page.tsx"
import { Toaster } from "sonner"

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark">
        <Layout>
          <Routes>
            <Route path="/" element={<WeatherDashboard />}/>
            <Route path="/city/:cityName" element={<CityPage />}/>
          </Routes>
        </Layout>
        <Toaster richColors />
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
