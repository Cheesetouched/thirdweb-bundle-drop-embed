import { ethers } from "ethers";
import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK } from "@3rdweb/sdk";
import { useEffect, useMemo, useState } from "react";
import { Center, Flex, useToast } from "@chakra-ui/react";

import Mint from "./Mint";
import Header from "./Header";
import Footer from "./Footer";
import Loader from "./Loader";
import Inventory from "./Inventory";

function Embed({
  chainId,
  contract,
  height,
  hideDescription = false,
  hideThirdwebLogo = false,
  hideTitle = false,
  inventoryImageHeight,
  inventoryImageWidth,
  imageHeight,
  imageWidth,
  rpcUrl,
  tokenId,
  transactionRelayerUrl = null,
  width,
}) {
  const toast = useToast();
  const [mode, setMode] = useState("mint");
  const [loading, setLoading] = useState(true);
  const [tokenDetails, setTokenDetails] = useState(null);
  const [claimConditions, setClaimConditions] = useState(null);
  const { address, connectWallet, disconnectWallet, error, provider } =
    useWeb3();

  const sdk = useMemo(() => {
    if (provider) {
      return new ThirdwebSDK(provider.getSigner(), { transactionRelayerUrl });
    }
    return null;
  }, [provider, transactionRelayerUrl]);

  const dropModule = useMemo(() => {
    if (sdk) {
      return sdk.getBundleDropModule(contract);
    }
    return null;
  }, [contract, sdk]);

  useEffect(() => {
    (async () => {
      const defaultProvider = new ethers.providers.JsonRpcProvider(rpcUrl);
      const sdk = new ThirdwebSDK(defaultProvider);
      const dropModule = sdk.getBundleDropModule(contract);

      const [tokenDetails, claimConditions] = await Promise.all([
        dropModule.get(tokenId),
        dropModule.getAllClaimConditions(tokenId),
      ]);

      setLoading(false);
      setTokenDetails(tokenDetails);
      setClaimConditions(claimConditions);
    })();
  }, [contract, rpcUrl, tokenId]);

  useEffect(() => {
    if (typeof chainId !== "number") {
      toast({
        title: "chainId is not provided",
        status: "error",
      });
    } else if (contract === undefined) {
      toast({
        title: "contract is not provided",
        status: "error",
      });
    } else if (rpcUrl === undefined) {
      toast({
        title: "rpcUrl is not provided",
        status: "error",
      });
    } else if (tokenId === undefined) {
      toast({
        title: "tokenId is not provided",
        status: "error",
      });
    }
  }, [chainId, contract, rpcUrl, toast, tokenId]);

  return (
    <Flex
      borderColor="rgba(0,0,0,0.1)"
      borderWidth="1px"
      borderRadius="15px"
      bgColor="white"
      flexDirection="column"
      height={height}
      width={width}
    >
      <Header
        address={address}
        claimConditions={claimConditions}
        disconnectWallet={disconnectWallet}
        dropModule={dropModule}
        mode={mode}
        provider={provider}
        setMode={setMode}
        toast={toast}
        tokenId={tokenId}
      />

      <Center flex={1} paddingX="28px">
        {loading && <Loader />}

        {!loading && mode === "mint" && (
          <Mint
            chainId={chainId}
            claimConditions={claimConditions}
            connectFunction={connectWallet}
            error={error}
            hideDescription={hideDescription}
            hideTitle={hideTitle}
            imageHeight={imageHeight}
            imageWidth={imageWidth}
            provider={provider}
            tokenDetails={tokenDetails}
          />
        )}

        {!loading && mode === "inventory" && (
          <Inventory
            connectFunction={connectWallet}
            error={error}
            inventoryImageHeight={inventoryImageHeight}
            inventoryImageWidth={inventoryImageWidth}
            provider={provider}
            tokenDetails={tokenDetails}
          />
        )}
      </Center>

      <Footer hideThirdwebLogo={hideThirdwebLogo} />
    </Flex>
  );
}

export default Embed;
