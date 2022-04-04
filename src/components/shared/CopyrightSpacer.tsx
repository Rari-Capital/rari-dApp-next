import { Text } from "rari-components/standalone";

const CopyrightSpacer = ({ forceShow = false }: { forceShow?: boolean }) => {
  return (
    <Text
      fontSize="xs"
      display={forceShow ? "block" : { md: "none", base: "block" }}
      textAlign="center"
      width="100%"
      bottom={0}
      py={2}
      mt="auto"
    >
      © {new Date().getFullYear()} Rari Capital. All rights reserved.
    </Text>
  );
};

export default CopyrightSpacer;
