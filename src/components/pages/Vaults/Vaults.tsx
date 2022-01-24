import { Heading, Box, VStack, Text, SimpleGrid } from "@chakra-ui/layout";

import useAllVaults from "hooks/vaultsv2/useAllVaults";
import { Column } from "lib/chakraUtils";
import VaultCard from "./VaultCard";

const Vaults = () => {
  const vaults = useAllVaults();

  return (
    <Column
      mainAxisAlignment="flex-start"
      crossAxisAlignment="flex-start"
      w="100%"
      h="100%"
    >
      <VStack w="100%" h="100%" mt={4} bg="" px={"10%"}>
        <Heading color="white" mx="auto" size="2xl">
          {" "}
          Vaults{" "}
        </Heading>
        <Text color="#ABABAB" fontSize="xl">
          The yield aggregator is our autonomous algorithm that searches for the
          highest yield across different Fuse pools.
        </Text>
      </VStack>

      <Box w="100%" h="100%" bg="" mt={8} px={"5%"}>
        <SimpleGrid columns={{ sm: 1, md: 3 }} spacing="40px" w="100%" bg="">
          {vaults.map((v) => {
            return <VaultCard vault={v} key={v.id} />;
          })}
        </SimpleGrid>
      </Box>
    </Column>
  );
};

export default Vaults;
