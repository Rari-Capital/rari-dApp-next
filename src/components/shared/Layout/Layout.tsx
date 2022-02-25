//@ts-nocheck

import { useRari } from "context/RariContext";
import { ChainID } from "esm/utils/networks";
import { Column } from "lib/chakraUtils";
import { useMemo, useState, useEffect } from "react";
import NewHeader from "../Header2/NewHeader";
import Footer from "./Footer";

const Layout = ({ children }) => {
  const { chainId } = useRari();

  const bg = useMemo(() => {
    switch (chainId) {
      case ChainID.ARBITRUM:
        return "linear-gradient(45deg, hsla(0, 0%, 0%, 1) 76%, hsla(220, 47%, 36%, 0.9) 100%);";
      default:
        return "black";
    }
  }, [chainId]);

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
      <Footer />
    </Column>
  );
};

export default Layout;
