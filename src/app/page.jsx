import Content from "@/components/Content"
import Footer from "@/components/Footer"
import ServiceButton from "@/components/ServiceButton"
import Image from "next/image"

export default function HomePage() {
    return (
        <>
            <div className="backgroundImage">
                <Image src="/background2.jpeg" layout="fill" />
                <div className="logoContainer">
                    <p className="logo">
                        <span className="logo1">SEA</span> <span className="logo2">SWAP</span>
                    </p>
                    <p className="text">Dex and liquidity pool provider</p>
                </div>
            </div>
            <div className="text-gray-400 px-[10vw] pt-20 pb-32 flex flex-col items-center">
                <div className="">
                    <p className="text-4xl font-bold text-center textYellowShadow">SEA SWAP</p>
                    <p className="w-[600px] text-lg text-justify mt-5">
                        Welcome to SEA SWAP, your portal to the future of decentralized trading. As
                        a premier decentralized exchange (DEX) and liquidity provider, SEA SWAP
                        harnesses the power of automated market maker (AMM) mechanisms to ensure
                        seamless and efficient trading experiences. By integrating advanced AMM
                        technology, we facilitate direct and secure transactions, allowing users to
                        engage with the digital currency market dynamically and with confidence.
                        Discover the potential of SEA SWAP, where every trade moves you forward.
                    </p>
                </div>
                <div className="space-y-32 w-full mt-32">
                    <Content
                        headline={"Discover Easy and Secure Trading on Our Top-Tier Platform"}
                        text={
                            "Welcome to our cutting-edge trading platform, where you can effortlessly exchange digital tokens with utmost security. Built on pioneering decentralized technology, our exchange offers you direct and private transactions without the need for middlemen. Enjoy high-quality, top-tier trading that puts you in complete control, ensuring faster transactions, enhanced security, and a superior trading experience designed just for you."
                        }
                        img_src={"/Swap.png"}
                        isOnLeft={true}
                    />
                    <Content
                        headline={"Provide Liquidity and Earn Yield Rewards"}
                        text={
                            "Join our dynamic Liquidity Pools and boost your trading impact! By providing liquidity to existing pools, you not only facilitate smoother trades but also earn yield rewards as a token of appreciation. Our platform empowers you to become an integral part of the trading ecosystem, allowing you to claim rewards regularly while contributing to market stability and efficiency"
                        }
                        img_src={"/Pools.png"}
                        isOnLeft={false}
                    />
                    <Content
                        headline={"Launch Your Own Liquidity Pool: Innovate and Earn"}
                        text={
                            "Take the lead and launch your own liquidity pool on our platform. By creating a new pool, you open up opportunities for traders to exchange tokens while you earn yield rewards from the transactions. It's a powerful way to contribute to the ecosystem, influence trading dynamics, and gain returns on your investments. Start your pool today and become a pivotal part of our trading community."
                        }
                        img_src={"/Deploy.png"}
                        isOnLeft={true}
                    />
                </div>
                <div id="Services" className="w-full text-center mt-44">
                    <p className="text-3xl textYellowShadow">START WITH OUR SERVICES</p>
                    <div className="flex flex-row justify-center items-center space-x-10 mt-10 textYellowShadow">
                        <ServiceButton name={"DEX"} path={"/dex"} />
                        <ServiceButton name={"POOLS"} path={"/pools"} />
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
