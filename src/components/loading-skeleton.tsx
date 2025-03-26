import { Skeleton } from "./ui/skeleton";

function WeatherSkeleton() {
    return (
        <div className="space-y-6">
            {/* check it later on how it looks and make changes */}
            <div className="flex items-center justify-around gap-4">
                {/* skeleton for favorite section */}
                <Skeleton className="h-[100px] rounded-md w-[200px]"/>
                <Skeleton className="h-[100px] rounded-md w-[200px]"/>
                <Skeleton className="h-[100px] rounded-md w-[200px]"/>
                <Skeleton className="h-[100px] rounded-md w-[200px]"/>
                <Skeleton className="h-[100px] rounded-md w-[200px]"/>
            </div>
            <div className="grid gap-6">
                <Skeleton className="h-[300px] w-full rounded-lg" />
                <Skeleton className="h-[300px] w-full rounded-lg" />
                <div className="grid gap-6 md:grid-cols-2">
                    <Skeleton className="h-[300px] w-full rounded-lg" />
                    <Skeleton className="h-[300px] w-full rounded-lg" />
                </div>
            </div>
        </div>
    );
}

export default WeatherSkeleton;