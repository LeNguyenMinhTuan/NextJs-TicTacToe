"use client"; 
import { useRouter } from 'next/navigation'

export default function Menu() {
    const router = useRouter()

    const redirectToBot = () => {
        router.push('/one-players')
    }

    const redirectToTwoPlayers = () => {
        router.push('/two-players')
    }

    return (
        <div className="modal show">
            <div className="modal__title">Mode</div>
            <button onClick={redirectToBot}>1 Player</button>
            <button onClick={redirectToTwoPlayers}>2 Players</button>
        </div>
    )
}