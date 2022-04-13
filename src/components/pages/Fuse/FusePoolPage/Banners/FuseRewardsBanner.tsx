import { InfoIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import { Heading, useDisclosure } from "@chakra-ui/react";
import { GlowingBox } from "components/shared/GlowingButton";
import { CTokenAvatarGroup } from "components/shared/Icons/CTokenIcon";
import { motion } from "framer-motion";
import { Row } from "lib/chakraUtils";
import React, { useState } from "react";
import { TokensDataMap } from "types/tokens";
import { PluginInfoModal } from "../../Modals/PluginModal/PluginInfoModal";

export const FuseRewardsBanner = ({
  rewardTokensData,
  hasPluginIncentives = false,
}: {
  rewardTokensData: TokensDataMap;
  hasPluginIncentives: boolean | undefined;
}) => {
  const [hovered, setHovered] = useState(false);
  const { isOpen, onClose, onOpen } = useDisclosure();
  if (!Object.keys(rewardTokensData).length) return null;

  const icon = hasPluginIncentives ? "🔌" : "🎉 ";

  return (
    <>
      {hasPluginIncentives && (
        <PluginInfoModal isOpen={isOpen} onClose={onClose} />
      )}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        style={{ width: "100%" }}
      >
        <GlowingBox
          w="100%"
          h="50px"
          mt={4}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          transition="transform 0.2s ease 0s"
          _hover={{
            cursor: hasPluginIncentives ? "pointer" : null,
            transform: hasPluginIncentives ? "translateY(-4px)" : null,
          }}
          onClick={onOpen}
        >
          <Row
            mainAxisAlignment="flex-start"
            crossAxisAlignment="center"
            h="100%"
            w="100"
            p={3}
          >
            <Heading fontSize="md" ml={2}>
              {" "}
              {icon} This pool is offering {hasPluginIncentives && " plugin "}{" "}
              rewards
            </Heading>
            <CTokenAvatarGroup
              tokenAddresses={Object.keys(rewardTokensData)}
              ml={2}
              mr={2}
              popOnHover={true}
            />
            {!hasPluginIncentives ? null : !hovered ? (
              <InfoOutlineIcon
                ml={"auto"}
                boxSize="20px"
                hover={{
                  border: "1px dotted white",
                }}
                borderRadius={"lg"}
              />
            ) : (
              <InfoIcon
                ml={"auto"}
                boxSize="20px"
                hover={{
                  border: "1px dotted white",
                }}
                borderRadius={"lg"}
              />
            )}
          </Row>
        </GlowingBox>
      </motion.div>
    </>
  );
};
