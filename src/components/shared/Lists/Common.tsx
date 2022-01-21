import { Icon, Stack, Text, Th } from "@chakra-ui/react";
import { getSortIcon, SortDir } from "hooks/useSortableList";

export const SortableTableHeader = ({
  text,
  handleSortClick,
  isActive,
  sortDir,
}: {
  text: string;
  handleSortClick: () => void;
  isActive: boolean;
  sortDir?: SortDir;
}) => {
  return (
    <Th
      fontSize="initial"
      fontWeight="normal"
      color="rgba(255,255,255,0.5)"
      textTransform="none"
      letterSpacing={0}
      borderBottomWidth={1}
      borderBottomStyle="solid"
      borderBottomColor="rgba(255,255,255,0.1)"
      cursor="pointer"
      userSelect="none"
      onClick={handleSortClick}
    >
      <Stack direction="row">
        <Text>{text}</Text>
        <Icon as={getSortIcon(isActive, sortDir)} />
      </Stack>
    </Th>
  );
};
