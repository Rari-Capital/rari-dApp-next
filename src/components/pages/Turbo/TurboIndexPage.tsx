import { Box, HStack, Image, Stack, useDisclosure, VStack } from "@chakra-ui/react";
import AppLink from "components/shared/AppLink";
import { formatEther } from "ethers/lib/utils";
import { useAllUserSafes } from "hooks/turbo/useUserSafes";
import { TokenData, useTokensDataAsMap } from "hooks/useTokenData";
import { SafeInfo } from "lib/turbo/fetchers/getSafeInfo";
import { Button, Card, Divider, Heading, Text } from "rari-components/standalone";
import { useQuery } from "react-query";
import { smallUsdFormatter } from "utils/bigUtils";
import CreateSafeModal from "./modals/CreateSafeModal";
// import CreateSafeModal from './modals/CreateSafeModal'

const TurboIndexPage: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const safes = useAllUserSafes()
  const hasSafes = !!safes?.length

  return (
    <>
      <CreateSafeModal onClose={onClose} isOpen={isOpen} />
      <Box color="white" width="100%" p={12}>
        <Box maxWidth={["100%", "1000px"]} marginX="auto">
          <Stack
            direction={["column", "column", "row"]}
            alignItems="center"
            spacing={12}
          >
            <Box flex={1}>
              <Heading size="xl">Introducing Turbo</Heading>
              <Text variant="secondary" pt={4} fontSize="xl">
                Turbo allows any DeFi token to become productive by sharing in the
                yield generated from a costless FEI line of credit.
              </Text>
              <HStack pt={8} spacing={4}>
                <Button variant="success" onClick={onOpen}>Create a safe</Button>
                <Button variant="cardmatte">Learn more</Button>
              </HStack>
            </Box>
            <Box flex={1}>
              <Image src="/static/turbo/turbo.png" />
            </Box>
          </Stack>
          <Divider mt={20} mb={16} />
          {hasSafes
            ? <SafeAggregates safes={safes} />
            : <TurboFAQ />
          }
        </Box>
      </Box>
    </>
  );
};

const SafeAggregates: React.FC<{
  safes: SafeInfo[],
}> = ({ safes }) => {
  const underlyings = safes.map(safe => safe.collateralAsset)
  const tokensData = useTokensDataAsMap(underlyings)
  return (
    <VStack minW="100%">
      {
        safes.map((safe, i) =>
          <SafeCard key={safe.safeAddress} safe={safe} i={i} tokenData={tokensData[safe.collateralAsset]} />)
      }
    </VStack>
  )
}


const SafeCard: React.FC<{
  safe: SafeInfo,
  i: number,
  tokenData: TokenData | undefined
}> = ({ safe, i, tokenData }) => {

  // const utilization = useQuery('safe utilization for ' + safe.safeAddress, () => {
  //   const safe.feiPrice

  // })


  return (
    <AppLink href={`/turbo/safe/${safe.safeAddress}`}>
      <Card w="100%">
        <VStack alignItems="start">
          <HStack justify={"start"}>
            <Image src={tokenData?.logoURL} boxSize="40px" />
            <Heading>{tokenData?.symbol}</Heading>
          </HStack>
          <Text>Boosted: {smallUsdFormatter(formatEther(safe.boostedAmount))}</Text>
          <Text>Collateral Balance: {formatEther(safe.collateralAmount)} {tokenData?.symbol}</Text>
          {/* <Text>Utilization: {smallUsdFormatter(formatEther(safe.boostedAmount))}</Text> */}
        </VStack>
      </Card>
    </AppLink>
  )
}


const TurboFAQ = () => (
  <Stack spacing={12}>
    <Box>
      <Heading size="md">How does it work?</Heading>
      <Text variant="secondary" mt={4}>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text
        ever since the 1500s, when an unknown printer took a galley of
        type and scrambled it to make a type specimen book. It has
        survived not only five centuries, but also the leap into
        electronic typesetting, remaining essentially unchanged.
      </Text>
    </Box>
    <Box>
      <Heading size="md">Should I use Turbo?</Heading>
      <Text variant="secondary" mt={4}>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text
        ever since the 1500s, when an unknown printer took a galley of
        type and scrambled it to make a type specimen book. It has
        survived not only five centuries, but also the leap into
        electronic typesetting, remaining essentially unchanged.
      </Text>
    </Box>
  </Stack>
)

export default TurboIndexPage;
