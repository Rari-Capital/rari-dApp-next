import { Alert } from "@chakra-ui/alert";
import { Button, ButtonGroup } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import {
  Heading,
  Box,
  VStack,
  Text,
  SimpleGrid,
  HStack,
  Spacer,
  Center,
} from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import { BigNumber } from "@ethersproject/bignumber";
import { formatUnits, parseUnits } from "@ethersproject/units";
import DashboardBox from "components/shared/DashboardBox";
import { CTokenIcon } from "components/shared/Icons/CTokenIcon";
import useVaultAPY from "hooks/vaultsv2/useVaultAPY";

import useVaultForUnderlying from "hooks/vaultsv2/useVaultForUnderlying";
import { Column } from "lib/chakraUtils";
import { useDepositIntoVault, useVaultBalance } from "lib/vaultsv2";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { useVaultStrategyPercentages } from "../Vaults/VaultCard";

import ColorHash from "color-hash";

const colorHash = new ColorHash();

const VaultPortal = () => {
  const router = useRouter();
  let tokenAddress = router.query.tokenId as string;

  const vault = useVaultForUnderlying(tokenAddress);
  const vaultBalance = useVaultBalance(vault?.id);
  const apy = useVaultAPY(vault);
  const { deposit, depositStep } = useDepositIntoVault();

  const [amount, setAmount] = useState<string>("");

  const handleDeposit = async () =>
    deposit(tokenAddress, parseUnits(amount, vault?.underlyingDecimals ?? 18));

  const strategiesMap = useVaultStrategyPercentages(
    vault?.trustedStrategies ?? []
  );

  const totalHoldings = useMemo(
    () =>
      parseFloat(
        formatUnits(
          BigNumber.from(vault?.totalHoldings ?? "0"),
          vault?.underlyingDecimals ?? 18
        )
      ).toFixed(),
    [vault?.totalHoldings]
  );

  if (!vault)
    return (
      <Column
        mainAxisAlignment="center"
        crossAxisAlignment="center"
        w="100%"
        h="100%"
      >
        <Spinner />
      </Column>
    );

  return (
    <VStack color="white" w="100%" h="100%" px={"5%"} align="start">
      <HStack w="100%" h="100%" justify="space-between" mt="50px">
        <HStack>
          <CTokenIcon address={vault.underlying} />
          <Heading size="lg" ml={4}>
            {vault.underlyingSymbol} Vault
          </Heading>
        </HStack>
        <Box>
          <Button colorScheme="green">Deposit</Button>
          <Button colorScheme="red" ml={3}>
            Withdraw
          </Button>
        </Box>
      </HStack>

      <Spacer />
      <Spacer />

      <HStack w="75%" h="100%" justify="flex-start" bg="" mt="50px">
        <VStack alignItems="flex-start">
          <Text fontSize="sm">Total Supply</Text>
          <Text fontSize="xl" fontWeight="bold">
            {totalHoldings} {vault.underlyingSymbol}
          </Text>
        </VStack>
        <Spacer />
        <VStack alignItems="flex-start">
          <Text fontSize="sm">Avg. APY (30D)</Text>
          <Text fontSize="xl" fontWeight="bold">
            {apy}%
          </Text>
        </VStack>
        <Spacer />
        <VStack alignItems="flex-start">
          <Text fontSize="sm">Your Balance</Text>
          <Text fontSize="xl" fontWeight="bold">
            {parseFloat(
              formatUnits(vaultBalance, vault.underlyingDecimals ?? 18)
            ).toFixed(2)}{" "}
            {vault.underlyingSymbol}
          </Text>
        </VStack>
        <Spacer />
        <VStack alignItems="flex-start">
          <Text fontSize="sm">Amount Earned</Text>
          <Text fontSize="xl" fontWeight="bold">
            30 {vault.underlyingSymbol}
          </Text>
        </VStack>
        <Spacer />
      </HStack>
      <Spacer />

      <DashboardBox h="450px" w="100%" mt={4} p={5}>
        <HStack w="100%" flexBasis="25%" bg="" px={5}>
          <ButtonGroup justifyContent="flex-start">
            <Button
              //  bg="#272727"
              fontWeight="normal"
              bgGradient="linear(to-l, #7928CA, #FF0080)"
            >
              Allocation Strategy
            </Button>
            <Button bg="#272727" fontWeight="normal" disabled>
              Current APY
            </Button>
          </ButtonGroup>
        </HStack>
        <HStack w="100%" h="100%" flexBasis="75%" px={5} bg="">
          {Object.keys(strategiesMap).length ===
          vault.trustedStrategies.length ? (
            vault.trustedStrategies.map((strategy, i) => (
              <Box
                h="75%"
                borderRadius="lg"
                flexBasis={`${strategiesMap[strategy.id].toFixed()}%`}
                bg={colorHash.hex(strategy.id + "b")}
                p={4}
              >
                <Center my="auto">
                  <VStack justify="center" align="center">
                    <Text>Fuse {i}</Text>
                    <Text>
                      {parseFloat(strategy.balance) /
                        10 ** vault.underlyingDecimals}{" "}
                      {vault.underlyingSymbol}
                    </Text>
                  </VStack>
                </Center>
              </Box>
            ))
          ) : (
            <Box h="100%" bg="grey" />
          )}
          {/* <Box borderRadius="lg" h="100%" flexBasis={"45%"} bg="purple"></Box>
          <Spacer />
          <Box borderRadius="lg" h="100%" flexBasis={"25%"} bg="red"></Box>
          <Spacer />
          <Box borderRadius="lg" h="100%" flexBasis={"20%"} bg="green"></Box>
          <Spacer />
          <Box borderRadius="lg" h="100%" flexBasis={"10%"} bg="lime"></Box> */}
        </HStack>
        {/* <HStack w="100%" flexBasis="25%" bg="" px={5}>
            <Alert>The vault splits its capital across multiple Fuse Pools to maximize its yield</Alert>

        </HStack> */}
      </DashboardBox>

      {/* <Text>
        Vaults page for {vault.underlying} ({vault.underlyingSymbol})
      </Text>
      <Text>Vault {vault.id}</Text>
      <Text>
        Balance: {formatUnits(vaultBalance, vault.underlyingDecimals ?? 18)}{" "}
        {vault.underlyingSymbol}
      </Text>
      <Input
        placeholder="Amount"
        onChange={(e) => setAmount(e.target.value)}
        value={amount}
      /> */}
      {/* <Button onClick={handleDeposit}>
        {depositStep === "APPROVING"
          ? "Approving..."
          : depositStep === "DEPOSITING"
          ? "Depositing..."
          : "Deposit"}
      </Button> */}
    </VStack>
  );
};

export default VaultPortal;
