import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';

function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <NavLink
          to="/garage"
          className={({ isActive }) => `${styles.navBtn} ${isActive ? styles.active : ''}`}
        >
          GARAGE
        </NavLink>
        <NavLink
          to="/winners"
          className={({ isActive }) => `${styles.navBtn} ${isActive ? styles.active : ''}`}
        >
          WINNERS
        </NavLink>
      </nav>

      <div className={styles.logo}>
        <span className={styles.logoText}>ASYNC RACE</span>
      </div>

      <div className={styles.chevrons} aria-hidden="true">
        {'>>>>>>>>>>'}
      </div>
    </header>
  );
}

export default Header;
