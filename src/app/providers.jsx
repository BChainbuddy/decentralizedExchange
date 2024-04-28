"use client"

import { http, createConfig } from "wagmi"
import { mainnet, sepolia } from "wagmi/chains"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"

export default function Providers({ children }) {
    const config = createConfig({
        chains: [mainnet, sepolia],
        transports: {
            [mainnet.id]: http(),
            [sepolia.id]: http()
        }
    })

    const queryClient = new QueryClient()

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    )
}
