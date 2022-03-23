import { Contract, EventFilter } from "ethers"

export const getRecentEvent = async (
    contract: Contract, 
    filter: (...args: any[]) => EventFilter,
) => {
    const blockNumber = await contract.provider.getBlockNumber()
    const events: any[] = await contract.queryFilter(filter(), blockNumber - 20, blockNumber )

    return events[0]
}

export const decodeEvent = (
    decode: (data: string, topics?: Array<string>) => any, 
    data: string,
    topics: string[]
) => {
    const decodedEvent = decode(data, topics)

    return decodedEvent
}

export const getRecentEventDecoded = async (
    contract: Contract,
    filter: (...args: any[]) => EventFilter,
) => {
    const event = await getRecentEvent(contract, filter)
    const decodedEvent = decodeEvent(event.decode, event.data, event.topics)


    return decodedEvent
}