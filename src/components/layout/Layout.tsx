import { ReactNode } from 'react';
import Header from './Header';
import styles from './Layout.module.css';

interface Props {
  children: ReactNode;
}

function Layout({ children }: Props) {
  return (
    <div className={styles.root}>
      <Header />
      <main className={styles.main}>{children}</main>
    </div>
  );
}

export default Layout;
