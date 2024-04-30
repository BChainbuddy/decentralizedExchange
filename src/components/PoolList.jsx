import { redirect } from "next/dist/server/api-utils"
import Link from "next/link"
import { useReadContract } from "wagmi"
import POOLTRACKER_ABI from "../constants/PoolTrackerAbi.json"
import POOLTRACKER_ADDRESS from "../constants/PoolTrackerAddress.json"
import Pool from "./Pool"

export default function PoolList({ poolList }) {
    console.log(poolList)
    return (
        <div>
            {poolList ? (
                <>
                    {poolList.map(pool => (
                        <Pool pool={pool} />
                    ))}
                </>
            ) : (
                <p>No pools available</p>
            )}
        </div>
    )
}
