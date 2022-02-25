import { SimpleTooltip } from "components/shared/SimpleTooltip";
import { CheckCircleIcon, WarningTwoIcon } from "@chakra-ui/icons";

export const WhitelistedIcon = ({
  isWhitelisted,
  ...boxProps
}: {
  isWhitelisted: boolean;
  [x: string]: any;
}) => {
  return (
    <>
      <SimpleTooltip
        label={
          isWhitelisted
            ? "This pool is from a Whitelisted Admin"
            : "This pool is not from a whitelisted admin. Use with caution!"
        }
        placement="bottom-end"
      >
        {isWhitelisted ? (
          <CheckCircleIcon boxSize="20px" mr={3} {...boxProps} />
        ) : (
          <WarningTwoIcon
            boxSize="20px"
            mr={3}
            color="orange.300"
            {...boxProps}
          />
        )}
      </SimpleTooltip>
    </>
  );
};
