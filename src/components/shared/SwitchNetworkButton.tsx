import { ChevronDownIcon } from "@chakra-ui/icons";
import { Box, Center, Flex, Img, Spacer, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";

import { useRari } from "context/RariContext";

import DashboardBox from "./DashboardBox";
import { getChainMetadata, getSupportedChains } from "esm/utils/networks";
import { useRouter } from "next/router";

const SwitchNetworkButton: React.FC = () => {
  const [dropdownOpened, setDropdownOpened] = useState(false);
  const { switchNetwork, chainId } = useRari();
  const supportedChains = useMemo(() => getSupportedChains(), []);

  const router = useRouter()

  let chainMetadata;
  if (chainId) {
    chainMetadata = getChainMetadata(chainId);
  }

  return (
    <DashboardBox
      position="relative"
      ml={1}
      as="button"
      height="40px"
      w="80%"
      px={4}
      flexShrink={0}
      fontSize={15}
      tabIndex={0}
      onClick={() => {
        setDropdownOpened(!dropdownOpened);
      }}
      onBlur={() => setDropdownOpened(false)}
      fontWeight="bold"
      cursor="pointer"
      border="1px solid"
      borderColor={chainMetadata?.color}
    >
      <Center expand>
        {chainMetadata ? (
          <>
            {chainMetadata.imageUrl && (
              <Img
                width="20px"
                height="20px"
                margin={1}
                mr={1}
                borderRadius="50%"
                src={chainMetadata.imageUrl}
                alt=""
              />
            )}
            {chainMetadata.name}
          </>
        ) : (
          "Loading..."
        )}
        <ChevronDownIcon ml={3} mr={1} />
      </Center>
      {dropdownOpened && (
        <DashboardBox
          position="absolute"
          width="100%"
          left={0}
          top="50px"
          textAlign="left"
          p={4}
          cursor="default"
        >
          <Text fontWeight="normal" color="grey" mb={2} cursor="default">
            Select a network
          </Text>
          {supportedChains.map((chainMetadata) => (
            <Flex
              cursor="pointer"
              alignItems="center"
              my={1}
              p={1}
              borderRadius="10px"
              _hover={{
                backgroundColor: "rgba(255,255,255,0.25)",
              }}
              onClick={async () => {
                await switchNetwork(chainMetadata.chainId, router);
              }}
            >
              {chainMetadata.imageUrl && (
                <Img
                  width="20px"
                  height="20px"
                  margin={1}
                  mr={3}
                  borderRadius="50%"
                  src={chainMetadata.imageUrl}
                  alt=""
                />
              )}
              {chainMetadata.name}
              <Spacer />
              {chainId === chainMetadata.chainId && (
                <Box
                  borderRadius="50%"
                  backgroundColor="green.200"
                  height="8px"
                  width="8px"
                  mr={3}
                />
              )}
            </Flex>
          ))}
        </DashboardBox>
      )}
    </DashboardBox>
  );
};

export default SwitchNetworkButton;
