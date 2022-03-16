import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Text,
    Flex,
    VStack,
    Spacer,
} from "@chakra-ui/react"

import AppLink from "components/shared/AppLink"

export const PluginInfoModal = ({
    isOpen,
    onClose,
}: {
    isOpen: boolean,
    onClose: () => void,
}) => {


    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader display="flex" width="100%" alignSelf="center">
                        <Text fontSize="lg" mr={4} alignSelf="center">
                            🔌 About Plugins
                        </Text>
                        <ModalCloseButton />
                    </ModalHeader>
                    <ModalBody>

                        <Flex direction="column" height="100%">
                            {/* <AppLink isExternal={true} href="https://www.convexfinance.com/stake"> */}
                            <VStack align={"flex-start"} my={2}>
                                <Text>This pool uses <AppLink href="https://github.com/Rari-Capital/compound-protocol/blob/fuse-plugin-4626/contracts/CErc20PluginRewardsDelegate.sol" isExternal={true}><b>ERC4626 Plugins</b></AppLink>, a new feature in Fuse, that allows specific yield bearing assets to be utilized in a lending/borrowing pool without forfeiting staking rewards.</Text>
                                <Spacer />
                                <Text>
                                    In this pool, you can supply and <b>borrow against Curve LPs</b> while <b>keeping all of your Convex rewards.</b>
                                </Text>
                            </VStack>
                        </Flex>
                    </ModalBody>
                    <ModalFooter mt={2}>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}



export default PluginInfoModal