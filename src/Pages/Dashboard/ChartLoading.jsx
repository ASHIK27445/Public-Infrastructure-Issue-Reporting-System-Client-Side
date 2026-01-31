const ChartLoading = () => {
    return(
        <div className="h-full flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-3 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-2" />
            <p className="text-gray-400 text-sm">Loading chart...</p>
        </div>
    )
}
export default ChartLoading