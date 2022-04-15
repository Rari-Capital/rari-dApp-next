import { StyleProps } from "@chakra-ui/react";
import React from "react";
import Searchbar from "../Searchbar";

type HeaderSearchbarProps = {
  width?: StyleProps["width"];
};

const HeaderSearchbar: React.FC<HeaderSearchbarProps> = ({
  width = "375px",
}) => {
  return <Searchbar width={width} height="33px" smaller />;
};

export default HeaderSearchbar;
