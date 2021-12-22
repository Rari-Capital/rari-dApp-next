import { Alert, AlertIcon } from "@chakra-ui/alert";
import { Button } from "@chakra-ui/button";
import { Box, HStack } from "@chakra-ui/layout";
import { Text } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import { testForComptrollerErrorAndSend } from "components/pages/Fuse/FusePoolEditPage";
import { useRari } from "context/RariContext";
import { useIsComptrollerPendingAdmin } from "hooks/fuse/useIsComptrollerAdmin";
import LogRocket from "logrocket";
import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { createUnitroller } from "utils/createComptroller";
import { handleGenericError } from "utils/errorHandling";

export const AdminAlert = ({
  isAdmin = false,
  isAdminText = "You are the admin!",
  isNotAdminText = "You are not the admin!!",
  rightAdornment,
  ...alertProps
}: {
  isAdmin: boolean;
  isAdminText?: string;
  isNotAdminText?: string;
  rightAdornment?: ReactNode;
  [x: string]: any;
}) => {
  const { t } = useTranslation();

  return (
    <Alert
      colorScheme={isAdmin ? "green" : "red"}
      borderRadius={5}
      mt="5"
      {...alertProps}
    >
      <AlertIcon />
      <span style={{ color: "black" }}>
        {t(isAdmin ? isAdminText : isNotAdminText)}
      </span>
      <Box h="100%" ml="auto">
        {rightAdornment}
      </Box>
    </Alert>
  );
};

export const PendingAdminAlert = ({
  comptroller,
}: {
  comptroller?: string;
}) => {
  const { address, fuse } = useRari();

  const toast = useToast();
  const queryClient = useQueryClient();

  const [isAccepting, setIsAccepting] = useState(false);

  const isPendingAdmin = useIsComptrollerPendingAdmin(comptroller);

  const acceptAdmin = async () => {
    if (!comptroller) return;
    const unitroller = createUnitroller(comptroller, fuse);
    setIsAccepting(true);

    try {
      await testForComptrollerErrorAndSend(
        unitroller._acceptAdmin(),
        address,
        ""
      );

      LogRocket.track("Fuse-AcceptAdmin");

      queryClient.refetchQueries();
      setIsAccepting(false);
    } catch (e) {
      setIsAccepting(false);

      handleGenericError(e, toast);
    }
  };

  return (
    <>
      {isPendingAdmin && (
        <AdminAlert
          isAdmin={isPendingAdmin}
          isAdminText="You are the pending admin of this Fuse Pool! Click to Accept Admin"
          rightAdornment={
            <Button
              h="100%"
              p={3}
              ml="auto"
              color="black"
              onClick={acceptAdmin}
              disabled={isAccepting}
            >
              <HStack>
                <Text fontWeight="bold">
                  {isAccepting ? "Accepting..." : "Accept Admin"}
                </Text>
              </HStack>
            </Button>
          }
        />
      )}
    </>
  );
};
