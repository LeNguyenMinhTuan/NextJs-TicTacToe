import Board from "../components/board/board";
import styles from '../page.module.css'


export default function OnePlayers() {
    return (
        <main className={styles.main}>
            <Board isOnePlayer={true}/>
        </main>
    )
}