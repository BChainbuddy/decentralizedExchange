export default function Modal({ isVisible, onClose, children }) {
    if (!isVisible) return null

    const close = e => {
        if (e.target.id === "modal") {
            onClose()
        }
    }

    return (
        <div
            id="modal"
            className="fixed inset-0 bg-opacity backdrop-blur-sm flex justify-center items-center"
            onClick={close}
        >
            <div className="w-[600px] flex flex-col py-10 rounded-lg modal bg-cyan-800">
                {children}
            </div>
        </div>
    )
}
