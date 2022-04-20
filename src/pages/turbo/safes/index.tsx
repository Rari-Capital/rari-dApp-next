import { SimpleGrid, Spinner } from "@chakra-ui/react";
import SafeCard from "components/pages/Turbo/TurboIndexPage/SafeCard";
import TurboLayout from "components/pages/Turbo/TurboLayout";
import { useAllSafes } from "hooks/turbo/useAllSafes";
import { useSafeInfo, useSafesInfo } from "hooks/turbo/useSafeInfo";
import { SafeInfo } from "lib/turbo/fetchers/safes/getSafeInfo";
import { EMPTY_ADDRESS } from "lib/turbo/utils/constants";
import { NextPage } from "next";
import { Heading } from "rari-components";

const Page: NextPage = () => {
    return (
        <TurboLayout>
            <Heading size="2xl" color="white">All safes</Heading>
            <SafesGrid/>
        </TurboLayout>
    )
};

export default Page


const SafesGrid = () => {
    const safes: string[] = useAllSafes()

    if (!safes) return <Spinner/>
    return (
        <>
        <SimpleGrid columns={[1, 1, 2, 2]} spacing={4} mt={12}>
            {safes.map((safe: string) => {
                if (safe === EMPTY_ADDRESS) return null
                return <SafeInfoFetcher safe={safe}/>
            })}
        </SimpleGrid>
        </>
    )
}

const SafeInfoFetcher = ({safe}: {safe: string}) => {
    const safeInfo = useSafeInfo(safe)

    if (!safeInfo) return <Spinner />

    return (
        <SafeCard safe={safeInfo} previewMode={true} />
    )
}