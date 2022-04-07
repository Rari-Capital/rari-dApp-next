// Next
import { useRouter } from "next/router";
import { useMemo } from "react";
import { ChevronDownIcon } from "@chakra-ui/icons";
// Components
import {
  Box,
  Button,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import AppLink from "../AppLink";

// Types

export enum MenuItemType {
  LINK,
  MENUGROUP,
}
export interface MenuItemInterface {
  type: MenuItemType;
  title?: string; // used only if MENUGROUP
  link?: DropDownLinkInterface; // used only if LINK
  links?: DropDownLinkInterface[]; // used only if MENUGROUP
}

export interface DropDownLinkInterface {
  name: string;
  route: string;
}

function getHeaderLinkStyleProps(isOnThisRoute: boolean) {
  return {
    py: 2,
    px: 4,
    mx: 4,
    fontWeight: 600,
    borderRadius: "lg",
    color: isOnThisRoute ? "white" : "#818181",
    bg: isOnThisRoute ? "#1F1F1F" : "transparent",
    _hover: {
      bg: isOnThisRoute ? "#1F1F1F" : "#272727",
      textDecoration: "none",
    },
    _active: { bg: isOnThisRoute ? "#1F1F1F" : "transparent" },
    _focus: { bg: isOnThisRoute ? "#1F1F1F" : "transparent" },
  };
}

// Normal Header Link
export const HeaderLink = ({
  name,
  route,
  noUnderline,
  ...props
}: {
  name: string;
  route: string;
  noUnderline?: boolean;
  [x: string]: any;
}) => {
  const router = useRouter();

  const isExternal = route.startsWith("http");

  const isOnThisRoute = router.asPath === route;

  return isExternal ? (
    <AppLink
      href={route}
      isExternal
      whiteSpace="nowrap"
      className={noUnderline ? "no-underline" : ""}
      {...getHeaderLinkStyleProps(isOnThisRoute)}
    >
      <Text {...props}>{name}</Text>
    </AppLink>
  ) : (
    <AppLink
      href={route}
      whiteSpace="nowrap"
      className={noUnderline ? "no-underline" : ""}
      {...getHeaderLinkStyleProps(isOnThisRoute)}
    >
      <Text {...props}>{name}</Text>
    </AppLink>
  );
};

const splitHairs = (path: string) =>
  path
    .replace(/\/+$/, "")
    .split("/")
    .filter((str) => !!str);

// Dropdown Header Link
// Subitems are rendered as either a MenuItem or a MenuGroup
export const DropDownLink = ({
  name,
  links,
  ml,
}: {
  name: string;
  links: MenuItemInterface[];
  ml?: number | string;
}) => {
  const router = useRouter();
  const path = router.asPath;

  const isOnThisRoute = useMemo(() => {
    const splitPath = splitHairs(path);
    const dropdownRoutes = links
      .filter((link) => link.type === MenuItemType.LINK)
      .map((link) => link.link?.route)
      .filter((route) => !!route);
    return dropdownRoutes.some((route) => {
      if (route) {
        const splitRoute = splitHairs(route);
        return splitPath.includes(splitRoute[0]);
      }
      return false;
    });
  }, [links, path]);

  return (
    <Box ml={ml ?? 0} color="white" zIndex={10}>
      <Menu isLazy={true}>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          {...getHeaderLinkStyleProps(isOnThisRoute)}
        >
          {name}
        </MenuButton>
        <MenuList bg="black">
          {links.map((link, i) => {
            // Link
            if (link.type === MenuItemType.LINK)
              return <DropdownItem link={link.link!} key={link.link!.route} />;
            // MenuGroup
            else if (link.type === MenuItemType.MENUGROUP)
              return <DropdownMenuGroup menuItem={link} key={i} />;
          })}
        </MenuList>
      </Menu>
    </Box>
  );
};

const DropdownItem = ({ link }: { link: DropDownLinkInterface }) => {
  const { route, name } = link;
  const isExternal = route.startsWith("http");
  return (
    <AppLink href={route} isExternal={isExternal}>
      <MenuItem _focus={{ bg: "grey" }} _hover={{ bg: "grey" }}>
        <Text fontWeight={600}>{name}</Text>
      </MenuItem>
    </AppLink>
  );
};

const DropdownMenuGroup = ({ menuItem }: { menuItem: MenuItemInterface }) => {
  return (
    <>
      <MenuDivider />
      <MenuGroup
        title={menuItem.title}
        opacity={0.5}
        fontSize="xs"
        textTransform="uppercase"
        pt={2}
      >
        {menuItem.links?.map((link, i) => (
          <DropdownItem link={link} key={i} />
        ))}
      </MenuGroup>
    </>
  );
};
