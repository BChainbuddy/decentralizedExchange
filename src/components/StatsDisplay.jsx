export default function StatsDisplay({ src, title, path }) {
    return (
        <div className="flex flex-col text-center mt-16 space-y-1 w-1/3 p-1">
            <div className="flex flex-row items-center justify-center space-x-1">
                <p className="text-xl">{title}</p>
                <svg
                    xmlns={src}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-7 h-7 mb-1"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
                </svg>
            </div>
            <p className="text-lg number">0</p>
        </div>
    )
}
