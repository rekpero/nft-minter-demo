import { ConnectKitButton } from "connectkit";

const Navbar = () => {
  return (
    <div className="text-xl fixed top-0 w-full flex gap-4 bg-gray-50 justify-between px-4 py-3 border border-gray-400 items-center">
      <p className="text-xl font-mono">NFT DROP</p>
      <ConnectKitButton />
    </div>
  );
};

export default Navbar;
