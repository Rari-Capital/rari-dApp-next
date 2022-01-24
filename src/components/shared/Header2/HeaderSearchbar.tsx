import { Box } from "@chakra-ui/react";
import React from "react";
import Searchbar from "../Searchbar";

const HeaderSearchbar: React.FC<React.ComponentProps<typeof Box>> = (props) => {
  return (
    <Box w={800} mx={5} my="auto " alignSelf="flex-start" {...props}>
      <Searchbar height="33px" smaller />
    </Box>
  );
};

export default HeaderSearchbar;
