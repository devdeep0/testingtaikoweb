"use client";

import { ThirdwebProvider, localWallet, metamaskWallet } from "@thirdweb-dev/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Taiko } from "@thirdweb-dev/chains";

const queryClient = new QueryClient();
const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThirdwebProvider 
          activeChain={Taiko}
          clientId={clientId}  // Replace with your client ID
          supportedWallets={[
            metamaskWallet(),
            localWallet()
          ]}
        >
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </ThirdwebProvider>
    );
}