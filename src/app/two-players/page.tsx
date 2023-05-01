import Board from "../components/board/board";
import styles from '../page.module.css'


export default function TwoPlayers() {
    return (
        <main className={styles.main}>
            <Board isOnePlayer={false}/>
        </main>
    )
}