import { WagmiConfig, createClient, configureChains } from "wagmi";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
import { Footer, Hero, Navbar } from "./components";

import { polygonMumbai } from "wagmi/chains";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

const { chains } = configureChains(
  [polygonMumbai],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: "https://polygon-mumbai.g.alchemy.com/v2/i0JIYxK_EGtBX5aGG1apX4KuoH7j_7dq",
      }),
    }),
  ]
);

const client = createClient(
  getDefaultClient({
    appName: "NFT-DROP",
    chains,
  })
);

function App() {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider theme="minimal">
        <Navbar />
        <Hero />
        <Footer />
      </ConnectKitProvider>
    </WagmiConfig>
  );
}

export default App;
