import { useMemo } from "react";

import {
  AvatarGroup,
  Avatar,
  Heading,
  SkeletonText,
  Text,
  Image,
} from "@chakra-ui/react";

import { HomepageFusePool, HOMEPAGE_FUSE_POOLS } from "constants/homepage";
import DashboardBox from "components/shared/DashboardBox";
import AppLink from "components/shared/AppLink";
import { SubgraphPool } from "pages/api/explore";
import { TokensDataMap } from "types/tokens";
import { useIsMobile } from "lib/chakraUtils";
import { useRari } from "context/RariContext";
import { filterPoolName } from "utils/fetchFusePoolData";

const HomeFuseCard = ({
  pool,
  tokensData,
}: {
  pool: SubgraphPool | undefined;
  tokensData: TokensDataMap;
}) => {
  const { chainId } = useRari();

  const { title, subtitle }: HomepageFusePool = useMemo(() => {
    if (!pool) return { title: null, subtitle: null, id: -1 };
    return HOMEPAGE_FUSE_POOLS[chainId ?? 1].find(
      (p) => p.id == parseInt(pool.index)
    )!;
  }, [pool]);

  const isMobile = useIsMobile();

  const assetsSubtitle: string | null = useMemo(() => {
    if (!pool) return null;

    const NUM = 3;

    const symbols = pool.assets
      .map(({ underlying }) => underlying.symbol)
      .slice(0, NUM);

    let caption;
    if (pool.assets.length <= NUM) {
      caption = symbols.join(", ");
    } else {
      const remaining = pool.assets.length - NUM;
      caption = `${symbols.join(", ")}, and ${remaining} other${
        remaining > 1 ? "s" : ""
      }`;
    }

    return caption;
  }, [pool]);

  return (
    // <motion.div
    //   initial={{ opacity: 0, x: 40 }}
    //   animate={{ opacity: 1, x: 0 }}
    //   exit={{ opacity: 0, x: -40 }}
    // >
    <AppLink
      href={`/fuse/pool/${pool?.index}`}
      style={{ textDecoration: "none" }}
    >
      <DashboardBox
        height={{
          base: "150px",
          sm: "150px",
          lg: "150px",
        }}
        width={{
          sm: "250px",
          lg: "300px",
        }}
        ml={10}
        p={5}
        transition="transform 0.2s ease 0s"
        opacity={0.9}
        _hover={{
          // background: "grey",
          opacity: 1,
          transform: "translateY(-7px)",
          boxShadow: "0px .2px 4px grey;",
        }}
      >
        <SkeletonText
          isLoaded={!!pool && !!pool.assets.length}
          height="10px"
          noOfLines={2}
          spacing="5"
        >
          <AvatarGroup my={1} size="xs" max={3}>
            {pool?.assets.slice(0, 3).map((asset) => {
              return (
                <Avatar
                  bg="#FFF"
                  borderWidth="1px"
                  name={"Loading..."}
                  src={
                    tokensData[asset.underlying.address]?.logoURL ?? undefined
                  }
                  key={asset.underlying.address}
                />
              );
            })}
          </AvatarGroup>

          <Heading size="sm" mt={2}>
            {filterPoolName(pool?.name ?? "")}
          </Heading>
          {!isMobile && (
            <Text fontSize="xs" color="gray.500" fontWeight="bold">
              {subtitle ?? assetsSubtitle}
            </Text>
          )}
        </SkeletonText>
        {/* <Image
          src={"/static/icons/fuse-glow.svg"}
          zIndex={11}
          boxSize={"20px"}
          position="absolute"
          bottom={0}
          right={0}
          mx={2}
          my={2}
        /> */}
      </DashboardBox>
    </AppLink>
    // </motion.div>
  );
};

export default HomeFuseCard;
