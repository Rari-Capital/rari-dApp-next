import React from "react";
import { Heading, Text } from "rari-components";
import { Box, HStack, Image, Stack } from "@chakra-ui/react";
import usePreviewSafes from "hooks/turbo/usePreviewSafes";
import SafeGrid from "./SafeGrid";

const TurboFAQ = () => {
  const safes = usePreviewSafes();

  return (
    <Stack spacing={12}>
      <HStack>
        <Image
          boxSize={"md"}
          src="https://media.discordapp.net/attachments/958411922330509314/959902592236929154/otrorr.png?width=1220&height=1220"
        />
        <Box>
          <Heading size="md">How does it work?</Heading>
          <Text variant="secondary" mt={4}>
            Turbo can be used by individuals, treasuries, DAOs, protocols, or
            any on-chain entity. Turbo Safes allow these parties to create a
            collateralized Fuse position with an approved DeFi token as the
            primary collateral type.
            <br />
            <br />
            Once the DeFi token is collateralized in a Fuse pool, the owner of
            this safe can then mint FEI at 0% APR, making this process
            completely free to the borrower. The FEI is minted at no cost so
            long as that FEI is supplied into a yield generating strategy that
            is compliant with ERC-4626, such as: Fuse plug-ins, tokenized
            vaults, etc.
            <br />
            <br />
            The users of Turbo will most likely deposit this FEI back into their
            own Fuse pool so that their community can borrow FEI against their
            collateral types and provide a revenue split to the issuer and the
            minter (Tribe DAO).
          </Text>
        </Box>
      </HStack>

      <Box>
        <Heading size="md">What is a Safe?</Heading>
        <Text variant="secondary" mt={4}>
          A safe is a Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Aenean vel tellus in velit malesuada pretium. Nulla viverra sodales
          mauris ut tincidunt. Interdum et malesuada fames ac ante ipsum primis
          in faucibus. Quisque non eleifend ipsum. Pellentesque non lacinia
          erat, eu commodo nisl. Morbi felis est, tincidunt eget lorem a,
          egestas volutpat neque.
        </Text>
      </Box>

      <Box>
        <Heading size="md">Should I use Turbo?</Heading>
        <Text variant="secondary" mt={4}>
          DAOs are often seen with large treasuries consisting of their native
          governance token and very little stablecoins due to the cost and
          undertaking that must occur. Turbo allows a DAO to become a premier
          minter of FEI, just as easily as the Tribe DAO. The DAO affiliate will
          mint a specific percentage of FEI from a collateralized position,
          while creating a revenue split agreement with the Tribe DAO to keep
          both organizations incentivized from the yield being earned.
          <br />
          <br />
          If you are a DAO that needs stablecoin liquidity and an alternate
          source of revenue, Turbo is for you.
        </Text>
      </Box>

      <Box>
        <Heading size="md">How can she slap?</Heading>
        <Text variant="secondary" mt={4}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vel
          tellus in velit malesuada pretium. Nulla viverra sodales mauris ut
          tincidunt. Interdum et malesuada fames ac ante ipsum primis in
          faucibus. Quisque non eleifend ipsum. Pellentesque non lacinia erat,
          eu commodo nisl. Morbi felis est, tincidunt eget lorem a, egestas
          volutpat neque.
        </Text>
      </Box>
    </Stack>
  );
};

export default TurboFAQ;
