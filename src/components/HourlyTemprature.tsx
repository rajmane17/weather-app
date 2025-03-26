import { ForecastData } from "@/api/types"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { format } from "date-fns"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"


interface HourlyTempratureProps {
    data: ForecastData
}

const HourlyTemprature = ({ data }: HourlyTempratureProps) => {

    const chartData = data.list.slice(0, 8).map((item) => ({
        time: format(new Date(item.dt * 100), "ha"),
        temp: Math.round(item.main.temp),// we are rounding off the temprature
        feels_like: Math.round(item.main.feels_like), // we are rounding off the feels_like
    }))
    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle>Today's Temprature</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[200px] w-full">
                    {/* It will make our graph responsive */}
                    <ResponsiveContainer width={"100%"} height={"100%"}>
                        <LineChart data={chartData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <XAxis
                                dataKey={"time"}
                                stroke="#888888"
                                tickLine={false}
                                axisLine={false}
                                fontSize={12} />
                            <YAxis
                                stroke="#888888"
                                tickLine={false}
                                axisLine={false}
                                fontSize={12}
                                tickFormatter={(value) => `${value}°`} />

                            {/* payload contains both of our values, payload is a array */}
                            <Tooltip content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="flex flex-col">
                                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                        Temperature
                                                    </span>
                                                    <span className="font-bold">
                                                        {payload[0].value}°
                                                    </span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                        Feels Like
                                                    </span>
                                                    <span className="font-bold">
                                                        {payload[1].value}°
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }

                                return null;
                            }} />

                            <Line
                                type={"monotone"}
                                dataKey={"temp"}
                                stroke="#2563eb"
                                strokeWidth={2}
                                dot={false} />

                            <Line
                                type={"monotone"}
                                dataKey={"feels_like"}
                                stroke="#64748b"
                                strokeWidth={2}
                                dot={false}
                                strokeDasharray={"5 5"} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>

    )
}

export default HourlyTemprature
