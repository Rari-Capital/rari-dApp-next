import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { Heading, Box, VStack, Text, SimpleGrid } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import { formatUnits, parseUnits } from "@ethersproject/units";
import { useTokenData } from "hooks/useTokenData";

import useVaultForUnderlying from "hooks/vaultsv2/useVaultForUnderlying";
import { Column } from "lib/chakraUtils";
import { useDepositIntoVault, useVaultBalance } from "lib/vaultsv2";
import { useRouter } from "next/router";
import { useState } from "react";

const VaultPortal = () => {
  const router = useRouter();
  let tokenAddress = router.query.tokenId as string;

  const vault = useVaultForUnderlying(tokenAddress);
  const vaultBalance = useVaultBalance(vault?.id);
  const { deposit, depositStep } = useDepositIntoVault();

  const [amount, setAmount] = useState<string>("");

  const handleDeposit = async () =>
    deposit(tokenAddress, parseUnits(amount, vault?.underlyingDecimals ?? 18));

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
    <Box color="white">
      <Text>
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
      />
      <Button onClick={handleDeposit}>
        {depositStep === "APPROVING"
          ? "Approving..."
          : depositStep === "DEPOSITING"
          ? "Depositing..."
          : "Deposit"}
      </Button>
    </Box>
  );
};

export default VaultPortal;
