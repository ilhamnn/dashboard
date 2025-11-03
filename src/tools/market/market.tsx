import {MarketHeatmap} from "./element/market-heatmap";
import {MarketOverview} from "./element/market-overview";

export function Market() {
    return (
        <div className="flex flex-col gap-4">
            <MarketOverview />
            <MarketHeatmap />
        </div>
    )
}