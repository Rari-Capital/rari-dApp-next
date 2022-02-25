import {
  Heading,
  Modal,
  ModalContent,
  ModalOverlay,
  Input,
  Button,
  Box,
  Text,
  Image,
  RadioGroup,
  Stack,
  Radio,
  useToast,
} from "@chakra-ui/react";

import { Column, Center, Row } from "lib/chakraUtils";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import DashboardBox, {
  DASHBOARD_BOX_PROPS,
} from "../../../shared/DashboardBox";
import { ModalDivider, MODAL_PROPS } from "../../../shared/Modal";

import { useTokenData } from "hooks/useTokenData";
import SmallWhiteCircle from "static/small-white-circle.png";
import { useRari } from "context/RariContext";
import { Fuse } from "esm";

import {
  useCreateComptroller,
  createRewardsDistributor,
} from "utils/createComptroller";
import TransactionStepper from "components/shared/TransactionStepper";

import { utils } from "ethers";

const steps = ["Deploying Rewards Distributor", "Configuring Comptroller"];

const AddRewardsDistributorModal = ({
  comptrollerAddress,
  poolName,
  poolID,
  isOpen,
  onClose,
}: {
  comptrollerAddress: string;
  poolName: string;
  poolID: string;
  isOpen: boolean;
  onClose: () => any;
}) => {
  const { fuse, address: userAddress, isAuthed } = useRari();
  const { t } = useTranslation();
  const toast = useToast();

  const [isDeploying, setIsDeploying] = useState(false);

  const [address, setAddress] = useState<string>("");
  const [rewardToken, setRewardToken] = useState<string>("");

  // If you have selected "Add RewardsDistributor, this value will be filled"
  const [nav, setNav] = useState<Nav>(Nav.CREATE);

  // Stepper
  const [activeStep, setActiveStep] = useState<0 | 1 | 2>(0);

  const tokenData = useTokenData(rewardToken);

  const isEmpty = address.trim() === "";

  useEffect(() => {
    const isRewardsDistributorAddress = nav === Nav.ADD;
    if (isRewardsDistributorAddress) {
      setRewardToken("");
    }

    try {
      const validAddress = utils.getAddress(address);
      if (!!validAddress && isRewardsDistributorAddress) {
        const rd = createRewardsDistributor(address, fuse);
        rd.callStatic
          .rewardToken()
          .then((tokenAddr: string) => setRewardToken(tokenAddr));
      }

      // If we're creating a rewardsDistributor then this is the rewardToken
      if (validAddress && !isRewardsDistributorAddress) {
        setRewardToken(address);
      }
    } catch (err) {
      return;
    }

    // If we're adding a rewardsDistributor then get the rewardToken
  }, [fuse, address, nav]);

  const handleDeploy = async () => {
    if (!tokenData) return;
    setIsDeploying(true);

    let rDAddress = address;
    try {
      if (nav === Nav.CREATE) {
        rDAddress = await deploy();
      }
    } catch (err) {
      console.log({ err });
      setIsDeploying(false);
      toast({
        title: "Error deploying RewardsDistributor",
        description: "",
        status: "error",
        duration: 10000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    setActiveStep(1);

    try {
      await addRDToComptroller(comptrollerAddress, rDAddress, fuse);

      setIsDeploying(false);
      onClose();
    } catch (err) {
      console.log({ err });
      setIsDeploying(false);
      toast({
        title: "Error adding RewardsDistributor to Comptroller",
        description: "",
        status: "error",
        duration: 10000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
  };

  // Deploy new RD
  const deploy = async (): Promise<string> => {
    if (!tokenData) throw new Error("No tokendata ");

    const deployedDistributor = await fuse.deployRewardsDistributor(
      tokenData.address,
      {
        from: userAddress,
      }
    );

    toast({
      title: "RewardsDistributor Deployed",
      description: "RewardsDistributor for " + tokenData.symbol + " deployed",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "top-right",
    });

    const rDAddress = deployedDistributor.options.address;
    return rDAddress;
  };

  const addRDToComptroller = async (
    comptrollerAddress: string,
    rDAddress: string,
    fuse: Fuse
  ) => {
    const comptroller = useCreateComptroller(
      comptrollerAddress,
      fuse,
      isAuthed
    );

    if (!comptroller || !comptroller.methods._addRewardsDistributor) {
      throw new Error("Could not create Comptroller");
    }

    // Add distributor to pool Comptroller
    await comptroller
      ._addRewardsDistributor(rDAddress)
      .send({ from: userAddress });

    toast({
      title: "RewardsDistributor Added to Pool",
      description: "",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "top-right",
    });
  };

  const subtitle = useMemo(() => {
    if (nav === Nav.CREATE) {
      return tokenData
        ? tokenData.name ?? "Invalid ERC20 Token Address!"
        : "Loading...";
    } else {
      return tokenData
        ? tokenData.name ?? "Invalid RewardsDistributor Address!"
        : "Loading...";
    }
  }, [tokenData, nav]);

  return (
    <Modal
      motionPreset="slideInBottom"
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size="lg"
    >
      <ModalOverlay />
      <ModalContent {...MODAL_PROPS}>
        <Heading fontSize="27px" my={4} textAlign="center">
          {nav === Nav.CREATE
            ? t("Deploy Rewards Distributor")
            : t("Add Rewards Distributor")}
        </Heading>

        <ModalDivider />

        <Box h="100%" w="100%" bg="">
          <Row
            mainAxisAlignment="flex-start"
            crossAxisAlignment="flex-start"
            bg=""
            p={4}
          >
            <RadioGroup onChange={(value: Nav) => setNav(value)} value={nav}>
              <Stack direction="row">
                <Radio value={Nav.CREATE} disabled={isDeploying}>
                  Create
                </Radio>
                <Radio value={Nav.ADD} disabled={isDeploying}>
                  Add
                </Radio>
              </Stack>
            </RadioGroup>
          </Row>

          <Column
            mainAxisAlignment="flex-start"
            crossAxisAlignment="center"
            pb={4}
          >
            {!isEmpty ? (
              <>
                {tokenData?.logoURL ? (
                  <Image
                    mt={4}
                    src={tokenData.logoURL}
                    boxSize="50px"
                    borderRadius="50%"
                    backgroundImage={`url(${SmallWhiteCircle})`}
                    backgroundSize="100% auto"
                  />
                ) : null}
                <Heading
                  my={tokenData?.symbol ? 3 : 6}
                  fontSize="22px"
                  color={tokenData?.color ?? "#FFF"}
                >
                  {subtitle}
                </Heading>
              </>
            ) : null}

            <Center px={4} mt={isEmpty ? 4 : 0} width="100%">
              <Input
                width="100%"
                textAlign="center"
                placeholder={
                  nav === Nav.CREATE
                    ? t(
                        "Token Address: 0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                      )
                    : t("RewardsDistributor Address:")
                }
                height="40px"
                variant="filled"
                size="sm"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                {...DASHBOARD_BOX_PROPS}
                _placeholder={{ color: "#e0e0e0" }}
                _focus={{ bg: "#121212" }}
                _hover={{ bg: "#282727" }}
                bg="#282727"
              />
            </Center>

            {isDeploying && (
              <Box my={3} w="100%" h="100%">
                <TransactionStepper
                  activeStep={activeStep}
                  tokenData={tokenData}
                  steps={steps}
                />
              </Box>
            )}

            {tokenData?.symbol && (
              <Box px={4} mt={4} width="100%">
                <Button
                  fontWeight="bold"
                  fontSize="2xl"
                  borderRadius="10px"
                  width="100%"
                  height="70px"
                  color={tokenData.overlayTextColor! ?? "#000"}
                  bg={tokenData.color! ?? "#FFF"}
                  _hover={{ transform: "scale(1.02)" }}
                  _active={{ transform: "scale(0.95)" }}
                  // isLoading={isDeploying}
                  disabled={isDeploying}
                  onClick={handleDeploy}
                >
                  {isDeploying
                    ? steps[activeStep]
                    : nav === Nav.CREATE
                    ? t("Deploy RewardsDistributor")
                    : t("Add RewardsDistributor")}
                </Button>
              </Box>
            )}
          </Column>
        </Box>
      </ModalContent>
    </Modal>
  );
};

export default AddRewardsDistributorModal;

enum Nav {
  CREATE = "Create",
  ADD = "ADD",
}
