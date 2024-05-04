"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"

export default function ServiceButton({ name, path }) {
    const [show, setShow] = useState(false)

    const { ref, inView } = useInView({
        threshold: 1
    })

    useEffect(() => {
        if (inView && !show) {
            setShow(true)
        }
    }, [inView])

    return (
        <Link href={path}>
            <button
                className={`block transition ease-in-out duration-1000 border bg-cyan-500 rounded-2xl p-3 text-white hover:scale-105 hover:bg-cyan-700 w-44 text-lg ${
                    show ? "scale-100 opacity-100" : "scale-0 opacity-0"
                }`}
                ref={ref}
            >
                {name}
            </button>
        </Link>
    )
}
