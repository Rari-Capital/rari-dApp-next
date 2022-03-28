//@ts-nocheck

import { useRari } from "context/RariContext";
import { ChainID } from "esm/utils/networks";
import { Column } from "lib/chakraUtils";
import { useRouter } from "next/router";
import theme from "rari-components/theme";
import { useMemo, useState, useEffect } from "react";
import NewHeader from "../Header2/NewHeader";
import Footer from "./Footer";

const { darkmatte } = theme.colors;

const Layout = ({ children }) => {
  const { chainId } = useRari()
  const { pathname } = useRouter();

  const bg = useMemo(() => {
    // Use the rari-components theme background color on `/turbo` pages to match
    // with the other rari-components colors (Turbo is the first project to use
    // rari-components from the start — elsewhere on the app, we are replacing
    // components incrementally and the original `black` background is more
    // appropriate).
    const baseBg = pathname.startsWith("/turbo") ? darkmatte : "black";

    switch (chainId) {
      case ChainID.ARBITRUM:
        return `linear-gradient(45deg, ${baseBg} 76%, hsla(220, 47%, 36%, 0.9) 100%)`;
      default:
        return baseBg
    }

  }, [chainId, pathname])

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
