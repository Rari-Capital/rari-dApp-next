//@ts-nocheck

import { useRari } from "context/RariContext";
import { ChainID } from "esm/utils/networks";
import { Column } from "lib/chakraUtils";
import { useMemo, useState, useEffect } from "react";
import NewHeader from "../Header2/NewHeader";
import Footer from "./Footer";

//CVX
import { useDisclosure } from "@chakra-ui/react";
import CVXMigrateModal from "components/pages/Fuse/Modals/CVXMigrateModal";
import { useCurveLPBalances, useStakedConvexBalances } from "hooks/convex/useStakedConvexBalances";
import PluginMigratorButton from "./PluginMigratorButton";


const Layout = ({ children }) => {
  const { chainId } = useRari()

  const bg = useMemo(() => {
    switch (chainId) {
      case ChainID.ARBITRUM:
        return "linear-gradient(45deg, hsla(0, 0%, 0%, 1) 76%, hsla(220, 47%, 36%, 0.9) 100%);"
      default:
        return 'black'
    }

  }, [chainId])

  const [showShader, setShowShader] = useState<boolean>(false);

  // If user presses meta key or control key + slash they will toggle the private allocation claim mode.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Slash") {
        e.preventDefault();
        setShowShader(!showShader);
      }
    };

    document.addEventListener("keydown", handler);

    return () => document.removeEventListener("keydown", handler);
  }, []);

  const cvxBalances = useStakedConvexBalances()
  const curveLPBalances = useCurveLPBalances()
  const hasCvxBalances = !!Object.keys(cvxBalances ?? {}).length || !!Object.keys(curveLPBalances ?? {}).length
  const { isOpen, onOpen, onClose } = useDisclosure()

  console.log({ cvxBalances, curveLPBalances })

  useEffect(() => {
    if (!!hasCvxBalances) onOpen()
  }, [hasCvxBalances])

  return (
    <Column
      height="100%"
      minH="100vh"
      flex={1}
      mainAxisAlignment="flex-start"
      crossAxisAlignment="flex-start"
      bg={bg}
      zIndex={-2}

    >
      {/* { showShader &&  <iframe frameborder="0" src="https://www.shadertoy.com/embed/7slcWj?gui=false&t=10&paused=false&muted=true" allowfullscreen
        style={{
          overflow: 'hidden',
          height: '100%',
          width: "100%",
          "background-repeat": "no-repeat",
          "background-attachment": "fixed"
        }} height="100%" width="100%"
        id="SHADER"
      ></iframe>} */}

      <NewHeader />
      {children}
      {!!hasCvxBalances && <CVXMigrateModal isOpen={isOpen} onClose={onClose} />}
      {!!hasCvxBalances && <PluginMigratorButton onOpen={onOpen} />}
      <Footer />
    </Column>
  );
};




export default Layout;
