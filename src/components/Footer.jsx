import React from "react"

const Footer = () => {
    return (
        <footer className="bg-black py-6 text-sm mt-20 text-center text-white space-y-1">
            <p className="">Connect with me:</p>
            <p>
                <a
                    href="https://github.com/BChainbuddy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mr-3"
                >
                    GitHub
                </a>
                |
                <a href="mailto:cc.jakapotokar@gmail.com" className="ml-3">
                    Email Me
                </a>
            </p>
            <p>
                Icons provided by{" "}
                <a href="https://icons8.com" target="_blank" rel="noopener noreferrer">
                    Icons8
                </a>
            </p>
            <p>© 2024 by Jaka Potokar. All rights reserved.</p>
        </footer>
    )
}

export default Footer
