import {
    Table as ChakraTable,
    TableProps as ChakraTableProps,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import { Card, Text } from "rari-components";

type Row = {
    key: string;
    data: React.ReactNode[];
};

type TableProps = ChakraTableProps & {
    headings: string[];
    rows: Row[];
};

/**
 * A table component based off of Chakra's `Table`.
 */
const Table: React.FC<TableProps> = ({ headings, rows, ...restProps }) => {
    return (
        <Card variant="ghost" p={0} w="100%">
            <ChakraTable {...restProps}>
                <Thead>
                    <Tr>
                        {headings.map((heading) => (
                            <Th
                                key={heading}
                                borderBottomColor="darkgray"
                                borderBottomWidth={2}
                                py={6}
                            >
                                <Text
                                    fontWeight={400}
                                    variant="secondary"
                                    textTransform="none"
                                    fontSize="md"
                                    letterSpacing={0}
                                >
                                    {heading}
                                </Text>
                            </Th>
                        ))}
                    </Tr>
                </Thead>
                <Tbody>
                    {rows.map((row) => (
                        <Tr key={row.key}>
                            {row.data.map((item) => (
                                <Td key={`${row.key}-${item}`} py={8}>
                                    {item}
                                </Td>
                            ))}
                        </Tr>
                    ))}
                </Tbody>
            </ChakraTable>
        </Card>
    );
};

export default Table;
export type { TableProps };
