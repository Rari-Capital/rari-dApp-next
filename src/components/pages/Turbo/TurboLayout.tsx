import Head from "next/head";
import theme from "rari-components/theme";
import { Box, BoxProps, ChakraProvider, Fade } from "@chakra-ui/react";
import { useRouter } from "next/router";

type TurboLayoutProps = BoxProps;

const TurboLayout: React.FC<TurboLayoutProps> = (props) => {
  const router = useRouter()
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
          <Fade
            key={router.route}
            in={true}
          >
            <Box maxWidth={["100%", "1200px"]} marginX="auto" {...props} />
          </Fade>
        </Box>
      </ChakraProvider>
    </>
  );
};

export default TurboLayout;
