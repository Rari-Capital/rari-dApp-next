//@ts-nocheck

import { useRari } from "context/RariContext";
import { ChainID } from "esm/utils/networks";
import { Column } from "lib/chakraUtils";
import { useMemo } from "react";
import NewHeader from "../Header2/NewHeader";
import Footer from "./Footer";


const Layout = ({ children }) => {
  const { chainId } = useRari()

  const bg = useMemo(() => {
    switch (chainId){
      case ChainID.ARBITRUM:
        return "linear-gradient(45deg, hsla(0, 0%, 0%, 1) 76%, hsla(220, 47%, 36%, 0.9) 100%);"
      default:
        return undefined
    }

  }, [chainId])

  return (
    <Column
      height="100%"
      flex={1}
      mainAxisAlignment="flex-start"
      crossAxisAlignment="flex-start"
      bg={bg}
      
    >
      <NewHeader />
      {children}
      <Footer />
    </Column>
  );
};

export default Layout;
