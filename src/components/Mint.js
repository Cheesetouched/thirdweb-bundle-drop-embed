import { FaRegGem } from "react-icons/fa";
import { Button, Flex, Image, Text } from "@chakra-ui/react";

import WrongNetwork from "./WrongNetwork";
import ConnectWallet from "./ConnectWallet";

export default function Mint({
  chainId,
  claimConditions,
  connectFunction,
  error,
  hideDescription,
  hideTitle,
  imageHeight,
  imageWidth,
  provider,
  tokenDetails,
}) {
  return (
    <Flex align="center" direction="column">
      <Flex
        align="center"
        background="#F2F0FF"
        border="1px solid rgba(0,0,0,0.1)"
        borderRadius="20px"
        flexDirection="column"
        height={imageHeight}
        overflow="hidden"
        justifyContent="center"
        width={imageWidth}
      >
        <Image
          alt="preview"
          fallbackSrc="/drop.svg"
          src={tokenDetails?.metadata?.image}
        />
      </Flex>

      {!hideTitle && (
        <Text color="#272E36" fontSize="28px" fontWeight="bold" marginTop={2.5}>
          {tokenDetails?.metadata?.name}
        </Text>
      )}

      {!hideDescription && (
        <Text color="#272E36" fontWeight={500} noOfLines={2} mt={2.5}>
          {tokenDetails?.metadata?.description}
        </Text>
      )}

      {error?.name !== "UnsupportedChainIdError" && provider && (
        <Button
          _active={{
            backgroundColor: "#007EC5",
          }}
          backgroundColor="#0098EE"
          color="white"
          _hover={{ backgroundColor: "#007EC5" }}
          isFullWidth
          mt={5}
          leftIcon={<FaRegGem />}
          size="md"
        >
          Mint (Free)
        </Button>
      )}

      {error?.name !== "UnsupportedChainIdError" && !provider && (
        <ConnectWallet
          connectFunction={connectFunction}
          error={error}
          provider={provider}
        />
      )}

      {error?.name === "UnsupportedChainIdError" && (
        <WrongNetwork shouldSwitchTo={chainId} />
      )}

      {error?.name !== "UnsupportedChainIdError" && claimConditions && (
        <Text
          color="#00742E"
          fontSize={14}
          fontWeight="bold"
          mt={3}
        >{`${claimConditions[0].currentMintSupply} / ${claimConditions[0].maxMintSupply} claimed`}</Text>
      )}
    </Flex>
  );
}