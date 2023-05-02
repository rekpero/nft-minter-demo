import NFTCard from "./card";

const Hero = () => {
  return (
    <div className="flex h-[100vh] w-[100vw] my-[5vh] justify-center gap-4 items-center flex-wrap">
      <NFTCard
        name="PFP NFT"
        desc="lorem ipsum falana dimkhana kuch kuch tho nft "
        total_supply={12}
        total_minted={5}
      />
    </div>
  );
};
export default Hero;
