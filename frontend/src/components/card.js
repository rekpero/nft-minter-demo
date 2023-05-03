/* eslint-disable jsx-a11y/alt-text */
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { upload } from "@spheron/browser-upload";
import { abi, contract } from "./utils";
import { ethers } from "ethers";

const SE_URL = `${process.env.REACT_APP_API_URL}/initiate-upload`;
export const DefaultGasLimit = 500000000;

const NFTCard = (props) => {
  const { isConnected, address } = useAccount();
  const [files, setFiles] = useState();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tokenURI, setTokenURI] = useState("");
  const [isFullLoading, setIsFullLoading] = useState(false);
  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: contract,
    abi,
    functionName: "mintNFT",
    args: [
      address,
      tokenURI,
      {
        gasLimit: DefaultGasLimit,
        maxPriorityFeePerGas: ethers.utils.parseUnits("0.05", "gwei"),
      },
    ],
  });
  const { data, error, isError, write } = useContractWrite(config);

  console.log(address, tokenURI);
  console.log(prepareError, isPrepareError, error, isError);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  console.log(isLoading, isSuccess);

  // const [counter, setCounter] = useState(1);
  const handleMint = async () => {
    if (!isConnected) toast.error("Connect Wallet");
    if (!files) {
      alert("No file selected");
      return;
    }

    try {
      setIsFullLoading(true);
      const responseAsset = await fetch(`${SE_URL}?bucketName=${name}-asset`);
      const responseAssetJson = await responseAsset.json();
      const uploadAssetResult = await upload([files], {
        token: responseAssetJson.uploadToken,
      });
      console.log(uploadAssetResult);

      //make metadata
      const metadata = {
        name,
        description,
        image: uploadAssetResult.dynamicLinks[0],
      };

      const responseMeta = await fetch(`${SE_URL}?bucketName=${name}-meta`);
      const responseMetaJson = await responseMeta.json();
      const uploadMetaResult = await upload([createFile(metadata)], {
        token: responseMetaJson.uploadToken,
      });
      console.log(uploadMetaResult);
      setTokenURI(`https://${uploadMetaResult.dynamicLinks[0]}/metadata.json`);
      write();
    } catch (err) {
      console.log(err);
    } finally {
      setIsFullLoading(false);
    }
  };

  const createFile = (obj) => {
    // Convert object to JSON string
    const json = JSON.stringify(obj);

    // Create Blob from JSON string with MIME type of JSON
    const blob = new Blob([json], { type: "application/json" });

    // Create File from Blob with a filename
    const file = new File([blob], "metadata.json", {
      type: "application/json",
    });

    return file;
  };
  const handleFileChange = (e) => {
    if (e.target.files?.length > 0) {
      setFiles(...e.target.files);
    }
  };
  const handleNameChange = (name) => {
    setName(name);
  };
  const handleDescriptionhange = (desc) => {
    setDescription(desc);
  };
  return (
    <div className="flex flex-col items-center">
      <div className="font-mono rounded-md border justify-center items-center flex flex-col gap-2 p-5 border-gray-500">
        <Toaster reverseOrder={false} />
        <label
          htmlFor="imgid"
          className="w-full rounded-md h-[200px] border border-gray-500 p-2 cursor-pointer"
        >
          <div className="flex items-center justify-center w-full h-full border-dotted border bg-[#E4EBFB] border-[#044490] rounded-md">
            {/* <ImageIcon /> */}
            <div className="flex flex-col items-center justify-center w-full">
              <img src="./upload.svg" />
              <span className="mt-6">Click to upload Image</span>
            </div>
          </div>
        </label>
        <input
          id="imgid"
          type="file"
          style={{ display: "none" }}
          onChange={(e) => handleFileChange(e)}
        />
        <span>{files?.name}</span>
        <div className="w-full">
          <label className="text-left">Name</label>
          <input
            type="text"
            onChange={(e) => handleNameChange(e.target.value)}
            value={name}
            className="border border-gray-500 w-full rounded h-[35px] p-2 focus:outline-none"
          />
        </div>
        <div className="w-full mt-2">
          <label>Description</label>
          <input
            type="text"
            onChange={(e) => handleDescriptionhange(e.target.value)}
            value={description}
            className="border border-gray-500 rounded w-full h-[35px] p-2 focus:outline-none"
          />
        </div>
        <button
          onClick={handleMint}
          className="hover:rotate-2 delay-100 transition ease-in-out w-[100px] py-2 mt-4 text-center border hover:bg-gray-100 hover:shadow-md border-gray-500 rounded-md"
        >
          {isFullLoading || isLoading ? "Minting NFT" : "Mint NFT"}
        </button>
      </div>
      <div className="mt-4">
        <div>
          Successfully minted your NFT!
          <div>
            <a
              href={`https://calibration.filfox.info/en/message/${data?.hash}`}
            >
              Filfox: {data?.hash}
            </a>
          </div>
        </div>
        {(isPrepareError || isError) && (
          <div>Error: {(prepareError || error)?.message}</div>
        )}
      </div>
    </div>
  );
};
export default NFTCard;
