'use client'

import { WagmiConfig, createClient, configureChains, sepolia } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

const { provider, webSocketProvider } = configureChains(
    [sepolia],
    [publicProvider()]
)

const client = createClient({
    autoConnect: true,
    provider,
    webSocketProvider
})

export default function Providers({ children }) {
  return (
    <WagmiConfig client={client}>
        {children}
    </WagmiConfig>
  )
}