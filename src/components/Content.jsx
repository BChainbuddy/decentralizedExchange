"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"

export default function Content({ img_src, headline, text, isOnLeft }) {
    const [show, setShow] = useState(false)

    const { ref, inView } = useInView({
        threshold: 0.5
    })

    useEffect(() => {
        if (inView && !show) {
            setShow(true)
        }
    }, [inView])

    return (
        <div
            className={`flex justify-evenly items-center transition-opacity duration-1000 ease-in ${
                show ? "opacity-100" : "opacity-0"
            }`}
            ref={ref}
        >
            {isOnLeft ? (
                <Image
                    width={400}
                    height={400}
                    src={img_src}
                    className={`transition duration-1000 ${
                        show ? "" : "-translate-x-4 translate-y-4"
                    }`}
                    alt="ConentImage"
                />
            ) : (
                <></>
            )}
            <div
                className={`w-[400px] p-7 rounded-xl text-black contentBox transition duration-1000 ${
                    show
                        ? ""
                        : isOnLeft
                        ? "translate-x-4 translate-y-4"
                        : "-translate-x-4 translate-y-4"
                }`}
            >
                <p className="text-center text-xl">{headline}</p>
                <p className="text-justify text-base mt-3">{text}</p>
            </div>
            {isOnLeft ? (
                <></>
            ) : (
                <Image
                    width={400}
                    height={400}
                    src={img_src}
                    className={`transition duration-1000 ${
                        show ? "" : "translate-x-4 translate-y-4"
                    }`}
                    alt="ContentImage"
                />
            )}
        </div>
    )
}
