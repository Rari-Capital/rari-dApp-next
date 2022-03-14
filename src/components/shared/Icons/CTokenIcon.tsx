import { Avatar, AvatarGroup } from "@chakra-ui/avatar";
import { useTokenData } from "hooks/useTokenData";
import AppLink from "../AppLink";


const CTokenAvatar = ({
  address,
  ...avatarProps
}: {
  address: string;
  [key: string]: any;
}) => {

  const tokenData = useTokenData(address);
  return (
    <Avatar
      {...avatarProps}
      key={address}
      bg="#FFF"
      borderWidth="1px"
      name={tokenData?.symbol ?? "Loading..."}
      src={
        tokenData?.logoURL ??
        "https://raw.githubusercontent.com/feathericons/feather/master/icons/help-circle.svg"
      }
    />)
}

export const CTokenIcon = ({
  address = '',
  hasLink = false,
  ...avatarProps
}: {
  address: string;
  hasLink?: boolean;
  [key: string]: any;
}) => {

  return hasLink ? (
    <AppLink href={!!address ? `/token/${address.toLowerCase()}` : '#'} _hover={{ transform: "scale(1.1)", zIndex: 10, cursor: "pointer" }} onClick={(e: Event) => e.stopPropagation()}>
      <CTokenAvatar address={address} {...avatarProps} />
    </AppLink>
  ) :
    <CTokenAvatar address={address} {...avatarProps} />
};

export const CTokenAvatarGroup = ({
  tokenAddresses,
  popOnHover = false,
  ...props
}: {
  tokenAddresses: string[];
  popOnHover?: boolean;
  [x: string]: any;
}) => {
  return (
    <AvatarGroup size="xs" max={30} {...props}>
      {tokenAddresses.map((tokenAddress, i) => {
        return (
          <CTokenIcon
            key={i}
            address={tokenAddress}
            hasLink={popOnHover}
          />
        );
      })}
    </AvatarGroup>
  );
};
