// Chakra and UI
import {
  AvatarGroup,
  Text,
  Link,
  // Table
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { CTokenAvatarGroup, CTokenIcon } from "components/shared/Icons/CTokenIcon";
import { useIdentifyOracle } from "hooks/fuse/useOracleData";
import { shortAddress } from "utils/shortAddress";

const OraclesTable = ({
  defaultOracle,
  oraclesMap,
}: {
  defaultOracle: string;
  oraclesMap: {
    [oracleAddr: string]: string[];
  };
}) => {
  return (
    <Table variant="unstyled">
      <Thead>
        <Tr>
          <Th color="white">Oracle:</Th>
          <Th color="white">Assets</Th>
        </Tr>
      </Thead>
      <Tbody>
        {!!defaultOracle && (
          <OracleRow
            oracle={defaultOracle}
            underlyings={[]}
            isDefault={true}
          />
        )}
        {Object.keys(oraclesMap).map((oracle) => {
          const underlyings = oraclesMap[oracle];
          return <OracleRow oracle={oracle} underlyings={underlyings} />;
        })}
      </Tbody>
    </Table>
  );
};

const OracleRow = ({
  oracle,
  underlyings,
  isDefault = false,
}: {
  oracle: string;
  underlyings: string[];
  isDefault?: boolean;
}) => {
  const {identity: oracleIdentity} = useIdentifyOracle(oracle);

  const displayedOracle = !!oracleIdentity
    ? oracleIdentity
    : shortAddress(oracle);

  return (
    <>
      <Tr>
        <Td>
          <Link
            href={`https://etherscan.io/address/${oracle}`}
            isExternal
            _hover={{ pointer: "cursor", color: "#21C35E" }}
          >
            <Text fontWeight="bold">{displayedOracle}</Text>
          </Link>
        </Td>
        <Td>
          {isDefault ? (
            <span style={{ fontWeight: "bold" }}>DEFAULT</span>
          ) :
            <CTokenAvatarGroup size="xs" max={30} mr={2} tokenAddresses={underlyings} popOnHover />
          }
        </Td>
      </Tr>
    </>
  );
};

export default OraclesTable;
