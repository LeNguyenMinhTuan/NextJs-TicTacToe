export default function Modal(
    { modalTitle, reset }:{ modalTitle: string, reset: () => void }
) {
    return (
        <div className={`modal ${modalTitle ? "show" : ""}`}>
            <div className="modal__title">{modalTitle}</div>
            <button onClick={reset}>New Game</button>
        </div>
    )
}
