import { WagmiConfig, createClient, configureChains } from "wagmi";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
import { Footer, Hero, Navbar } from "./components";

import { filecoinCalibration } from "wagmi/chains";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

const { chains } = configureChains(
  [filecoinCalibration],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: "https://filecoin-calibration.chainup.net/rpc/v1",
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
