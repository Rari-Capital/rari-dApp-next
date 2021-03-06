import { memo, useEffect, useState } from "react";

// Components
import DashboardBox from "components/shared/DashboardBox";
import FuseStatsBar from "../FuseStatsBar";
import FuseTabBar from "../FuseTabBar";

// Hooks
import { useIsSmallScreen } from "hooks/useIsSmallScreen"
import { Fuse } from "../../../../esm/index";

// Utils
import { Center, Column, Row } from "lib/chakraUtils";
import { PoolList } from "./PoolList";
import { useFilter } from "hooks/useFilter";
import { createMergedPools, MergedPool, fetchPoolsManual, LensFusePool, LensFusePoolData, useFusePools, useFusePoolsList, useInifinitePools } from "hooks/fuse/useFusePools";
import { useRari } from "context/RariContext";
import { useInfiniteQuery } from "react-query";
import { BigNumber } from "ethers";
import { providers } from "@0xsequence/multicall";
import { fetchCurrentETHPrice } from "utils/coingecko";
import { ChainID } from "constants/networks";
import { Spinner } from "@chakra-ui/react";
import { ModalDivider } from "components/shared/Modal";
import { Text } from "rari-components";

const FusePoolsPage = memo(() => {
  const isMobile = useIsSmallScreen();
  const filter = useFilter();


  return (
    <>
      <Column
        mainAxisAlignment="flex-start"
        crossAxisAlignment="center"
        color="#FFFFFF"
        mx="auto"
        width={isMobile ? "100%" : "1000px"}
        height="100%"
        px={isMobile ? 4 : 0}
      >
        <FuseStatsBar />

        <FuseTabBar />

        <DashboardBox width="100%" mt={4}>
          {filter === "unverified-pools" ? <UnverifiedPools filter={filter}/> : <VerifiedPools filter={filter} />}
        </DashboardBox>
      </Column>
    </>
  );
});

export default FusePoolsPage;

const VerifiedPools = ({filter}: {filter: string | null}) => {
  const filteredPools = useFusePools(filter);
  return (
    <PoolList pools={filteredPools} />
  )
}

const UnverifiedPools = ({filter}: {filter: string}) => {
  const [poolListLength, setPoolListLength] = useState(0)
  const [poolBatch, setPoolBatch] = useState([0,20])
  const [poolSlice, setPoolSlice] = useState([[]])

  const { fuse, address, chainId } = useRari()
  const poolList: [][] = useFusePoolsList(fuse, address)

  useEffect(() => {
    if(poolList) {
      setPoolListLength(poolList[1].length)
      setPoolSlice([poolList[0].slice(...poolBatch),poolList[1].slice(...poolBatch)])
    }
  }, [poolList])


    const fetchPoolsManual = async ({pageParam = poolSlice}: any) => {
      if (pageParam.length === 1) return
      // Extract data from Directory call
      let ids: string[] = (pageParam[0] ?? []).map((bn: BigNumber) =>
        bn.toString()
      );
      let fusePools: LensFusePool[] = pageParam[1];
      let comptrollers = fusePools.map((pool: any) => pool[2]);
    
      // Query lens.getPoolSummary
      let fusePoolsData: LensFusePoolData[] = await Promise.all(
        comptrollers.map(async (comptroller) => {
          const _data = await fuse.contracts.FusePoolLens.callStatic.getPoolSummary(
            comptroller
          );
          const data: LensFusePoolData = {
            totalSupply: _data[0],
            totalBorrow: _data[1],
            underlyingTokens: _data[2],
            underlyingSymbols: _data[3],
            whitelistedAdmin: _data[4],
          };
          return data;
        })
      ).catch((err) => {
        console.error("Error querying poolSummaries", err);
        return [];
      });

      const multicallProvider = new providers.MulticallProvider(fuse.contracts.FusePoolLens.provider)
      const multicallFuse = new Fuse(multicallProvider, chainId as any)
      const poolRewardTokens = await Promise.all(fusePools.map((pool) => {
        return multicallFuse.contracts.FusePoolLensSecondary.callStatic.getRewardSpeedsByPool(
          pool.comptroller
        ).then((rewards) => {
          //reward token list
          return rewards[2]
        })
      }))

      const fetchETHPrice = fetchCurrentETHPrice();
      const merged: MergedPool[] = await createMergedPools(ids, fusePools, fusePoolsData, poolRewardTokens, fetchETHPrice);
      return merged
    };
  
    const {
        isLoading,
        isError,
        error,
        data,
        fetchNextPage,
        isFetching,
        isFetchingNextPage
        //@ts-ignore
    } = useInfiniteQuery(['colors'], fetchPoolsManual, {
        enabled: poolList && poolSlice.length > 1, 
        refetchOnWindowFocus: false,
        getNextPageParam: (lastPage, pages) => {
          return poolSlice
      }
    })


    const handleInifiniteScrollClick = () => {
      setPoolBatch([poolBatch[0] + 20, poolBatch[1] + 20])
      setPoolSlice([
        poolList[0].slice(poolBatch[0] + 20, poolBatch[1] + 20),
        poolList[1].slice(poolBatch[0] + 20, poolBatch[1] + 20)
      ])
      fetchNextPage({
        pageParam: [
          poolList[0].slice(poolBatch[0] + 20, poolBatch[1] + 20), 
          poolList[1].slice(poolBatch[0] + 20, poolBatch[1] + 20)
        ]
      })
    }

  return (
    <>
    { data?.pages.map((page, index) => <PoolList pools={page} infiniteScroll={index > 0}/>)}
    
    {  poolBatch[1] < poolListLength ?
      <>
          <ModalDivider/>
          <Row
            onClick={handleInifiniteScrollClick}
            _hover={{cursor: "pointer", opacity: 1}}
            mainAxisAlignment="center"
            crossAxisAlignment="center"
            height="45px"
            width="100%"
            flexShrink={0}
            opacity={0.5}
            pl={4}
            pr={1}
          >
            <Text textAlign="center" fontWeight="bold" width={"100%"}>
              Load more...
            </Text>

        </Row> 
        </>
      : null
      }
    </>
  )
}

