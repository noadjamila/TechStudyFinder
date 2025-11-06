import styles from './QuizLayout.module.css'
import Progressbar from "../components/quiz/Progressbar";

export interface QuizLayoutProps {
  currentIndex: number,
  questionsTotal: number,
  children: any
}

const QuizLayout: React.FC<QuizLayoutProps> = ({ currentIndex, questionsTotal, children }) => {
    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <Progressbar current={currentIndex} total={questionsTotal} />
                <main className={styles.middle}>
                    {children}
                </main>
            </div>
        </div>
    )
}

export default QuizLayout;