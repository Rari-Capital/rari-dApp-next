

import { Button, Image, keyframes, usePrefersReducedMotion } from "@chakra-ui/react"


const spin = keyframes`
  from { transform: rotateY(0deg); }
  to { transform: rotateY(360deg); }
`

export const PluginMigratorButton = ({ onOpen }: { onOpen: any }) => {
    const prefersReducedMotion = usePrefersReducedMotion()

    const animation = prefersReducedMotion
        ? undefined
        : `${spin} infinite 5s linear`
    return (
        <Button onClick={onOpen} position="fixed" 
        bottom={0} right={0} m={10} bg="none"
        transition="transform 0.2s ease 0s"
        boxSize={"75px"}
        _hover={{
            transform: "translateY(-10px)",
        }}>
            <Image animation={animation} src="/static/icons/convex.svg" h="100%" w="100%" 
               
            />
        </Button>
    )
}

export default PluginMigratorButton