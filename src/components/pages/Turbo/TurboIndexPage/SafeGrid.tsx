import { SafeInfo } from "lib/turbo/fetchers/safes/getSafeInfo";
import { Heading, HoverableCard, Text } from "rari-components";
import { Box, Flex, SimpleGrid } from "@chakra-ui/react";
import SafeCard from "./SafeCard";
import { useIsUserAuthorizedToCreateSafes } from "hooks/turbo/useIsUserAuthorizedToCreateSafes";

type SafeGridProps = {
  safes: SafeInfo[];
  onClickCreateSafe?: () => void;
};

const SafeGrid: React.FC<SafeGridProps> = ({ safes, onClickCreateSafe }) => {
  let isAuthed = useIsUserAuthorizedToCreateSafes();
  const previewMode = !onClickCreateSafe || !isAuthed;
  console.log({ previewMode });
  return (
    <Box>
      <SimpleGrid columns={[1, 1, 2, 3]} spacing={4} mt={12}>
        {!previewMode && (
          <HoverableCard variant="active" onClick={onClickCreateSafe}>
            {(hovered) => (
              <Box opacity={hovered ? 0.5 : 1} transition="0.2s opacity">
                <Heading display="flex" alignItems="center" size="lg">
                  Add safe{" "}
                  <Flex
                    alignItems="center"
                    justifyContent="center"
                    boxSize={6}
                    borderRadius="50%"
                    background="white"
                    ml={4}
                  >
                    <Heading size="sm" color="black">
                      +
                    </Heading>
                  </Flex>
                </Heading>
                <Text variant="secondary" mt={4} fontSize="lg">
                  Every safe isolates and manages your collateral.
                </Text>
              </Box>
            )}
          </HoverableCard>
        )}
        {safes.map((safe) => (
          <SafeCard
            key={safe.safeAddress}
            safe={safe}
            previewMode={previewMode}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default SafeGrid;
