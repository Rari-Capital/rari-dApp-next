import Head from "next/head";
import theme from "rari-components/theme";
import { Box, BoxProps, ChakraProvider } from "@chakra-ui/react";

type TurboLayoutProps = BoxProps;

const TurboLayout: React.FC<TurboLayoutProps> = (props) => {
  return (
    <>
      <Head>
        {/* Default title (can be overridden with another `title` tag). */}
        <title>Tribe Turbo</title>
      </Head>
      {/**
       * Provide rari-components theme on all Turbo pages so we can import from
       * the main `rari-components` entry point within Turbo pages (Turbo is the
       * first project to use rari-components from the start — elsewhere on the
       * app, we are replacing components incrementally and import from
       * `rari-components/standalone` instead, which is less performant).
       */}
      <ChakraProvider theme={theme}>
        <Box color="white" width="100%" p={12}>
          <Box maxWidth={["100%", "1000px"]} marginX="auto" {...props} />
        </Box>
      </ChakraProvider>
    </>
  );
};

export default TurboLayout;
