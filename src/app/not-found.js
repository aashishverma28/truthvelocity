import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <span className={styles.errorCode}>404</span>
      <h1 className={styles.errorTitle}>Headline Not Found</h1>
      <p className={styles.errorDesc}>
        The news article or category page you are looking for may have been moved, renamed, or is temporarily unavailable. We apologize for the editorial gap.
      </p>
      <div className={styles.actions}>
        <Link href="/" className={styles.homeBtn}>
          Go to Home
        </Link>
        <Link href="/search" className={styles.searchBtn}>
          Search Articles
        </Link>
      </div>
    </div>
  );
}
