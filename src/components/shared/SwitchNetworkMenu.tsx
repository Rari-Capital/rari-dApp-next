import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  Flex,
  Img,
  Menu,
  MenuButton,
  MenuList,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { useMemo } from "react";

import { useRari } from "context/RariContext";

import DashboardBox from "./DashboardBox";
import { getChainMetadata, getSupportedChains } from "esm/utils/networks";
import { useRouter } from "next/router";

const SwitchNetworkButton: React.FC<
  React.ComponentProps<typeof DashboardBox>
> = ({ ...props }) => {
  const { chainId, switchingNetwork } = useRari();

  let chainMetadata;
  if (chainId) {
    chainMetadata = getChainMetadata(chainId);
  }

  return (
    <DashboardBox
      position="relative"
      ml={1}
      as={MenuButton}
      height="40px"
      px={4}
      flexShrink={0}
      fontSize={15}
      fontWeight={600}
      cursor="pointer"
      {...props}
      border="1px solid"
      opacity={0.9}
      _hover={{
        opacity: 1
      }}
    // borderColor={chainMetadata?.color}
    >
      <Center>
        {switchingNetwork ? "Switching..." : chainMetadata ? (
          <>
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
          </>
        ) : (
          "Loading..."
        )}
        <ChevronDownIcon ml={3} mr={1} />
      </Center>
    </DashboardBox>
  );
};

const SwitchNetworkMenu: React.FC = () => {
  const { switchNetwork, chainId } = useRari();
  const supportedChains = useMemo(() => getSupportedChains(), []);
  const router = useRouter();

  let chainMetadata;
  if (chainId) {
    chainMetadata = getChainMetadata(chainId);
  }

  return (
    <Menu>
      <SwitchNetworkButton />
      <MenuList
        minWidth="125%"
        bg="transparent"
        borderColor="transparent"
        pt={1}
      >
        <DashboardBox textAlign="left" p={4}>
          <Text fontWeight="normal" color="grey" mb={2} cursor="default">
            Select a network
          </Text>
          {supportedChains.map((chainMetadata) => (
            <Flex
              key={chainMetadata.chainId}
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
              <Text fontWeight={600}>{chainMetadata.name}</Text>
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
      </MenuList>
    </Menu>
  );
};

export default SwitchNetworkMenu;
