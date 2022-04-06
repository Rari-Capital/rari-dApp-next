import { commify, formatEther } from "ethers/lib/utils";
import { SafeInfo } from "lib/turbo/fetchers/safes/getSafeInfo";
import {
  Heading,
  HoverableCard,
  Link,
  Progress,
  Text,
  TokenIcon,
  TokenSymbol,
} from "rari-components";
import Tooltip from "rari-components/components/Tooltip";
import { abbreviateAmount } from "utils/bigUtils";
import {
  Box,
  Flex,
  HStack,
  Stack,
} from "@chakra-ui/react";

type SafeCardProps = {
    safe: SafeInfo;
  };
  
  const SafeCard: React.FC<SafeCardProps> = ({ safe }) => {
    return (
      <Link href={`/turbo/safe/${safe.safeAddress}`}>
        <HoverableCard w="100%" variant="ghost" cursor="pointer" p={6}>
          {(hovered) => (
            <Box opacity={hovered ? 0.5 : 1} transition="0.2s opacity">
              <HStack justify={"start"}>
                <TokenIcon
                  tokenAddress={safe.collateralAsset}
                  boxSize={10}
                  mr={2}
                />
                <Heading>
                  <TokenSymbol tokenAddress={safe.collateralAsset} />
                </Heading>
              </HStack>
              <Stack spacing={2} mt={8} alignItems="flex-start" justify="stretch">
                <Flex alignItems="baseline" flex={1}>
                  <Tooltip
                    label={`${commify(formatEther(safe.boostedAmount))} FEI`}
                  >
                    <>
                      <Heading size="md">
                        {abbreviateAmount(formatEther(safe.boostedAmount))}
                      </Heading>
                      <Text variant="secondary" ml={2}>
                        boosted
                      </Text>
                    </>
                  </Tooltip>
                </Flex>
                <Flex alignItems="baseline" flex={1}>
                  {/* TODO(sharad-s): Use real APY number */}
                  <Heading size="md">6.56%</Heading>
                  <Text variant="secondary" ml={2}>
                    net APY
                  </Text>
                </Flex>
              </Stack>
              <Box mt={8}>
                <Text variant="secondary" mb={2}>
                  Active boost
                </Text>
                <Progress
                  height={4}
                  hideLabel
                  value={safe.safeUtilization.toNumber()}
                />
              </Box>
            </Box>
          )}
        </HoverableCard>
      </Link>
    );
  };

export default SafeCard