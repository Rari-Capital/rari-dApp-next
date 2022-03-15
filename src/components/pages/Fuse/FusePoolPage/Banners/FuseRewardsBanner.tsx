import { Heading } from '@chakra-ui/react';
import { GlowingBox } from 'components/shared/GlowingButton';
import { CTokenAvatarGroup } from 'components/shared/Icons/CTokenIcon';
import { motion } from 'framer-motion';
import { Row } from 'lib/chakraUtils';
import React from 'react'
import { TokensDataMap } from 'types/tokens';

export const FuseRewardsBanner = ({
    rewardTokensData,
  }: {
    rewardTokensData: TokensDataMap;
  }) => {
  
    if (!Object.keys(rewardTokensData).length) return null
  
    return (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        style={{ width: "100%" }}
      >
        <GlowingBox w="100%" h="50px" mt={4}>
          <Row
            mainAxisAlignment="flex-start"
            crossAxisAlignment="center"
            h="100%"
            w="100"
            p={3}
          >
            <Heading fontSize="md" ml={2}>
              {" "}
              🎉 This pool is offering rewards
            </Heading>
            <CTokenAvatarGroup
              tokenAddresses={Object.keys(rewardTokensData)}
              ml={2}
              mr={2}
              popOnHover={true}
            />
          </Row>
        </GlowingBox>
      </motion.div>
    );
  };
  