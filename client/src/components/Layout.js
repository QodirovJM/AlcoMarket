import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Layout({ children }) {
  const role = localStorage.getItem('role');
  const isAuth = !!localStorage.getItem('token');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const logoSrc = theme === 'dark' ? '/images/logo-dark.png' : '/images/logo-light.png';
  const backgroundImage = theme === 'dark'
    ? 'url(/images/bg-dark.png)'
    : 'url(/images/bg-light.jpg)';
  const headerColor = theme === 'dark' ? '#1b3e2b' : '#fff1d6';
  const textColor = theme === 'dark' ? 'white' : 'black';

  useEffect(() => {
    document.body.className = '';
    document.body.style.backgroundImage = backgroundImage;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'repeat';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.color = textColor;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      <header
        className="py-3 px-4 d-flex justify-content-between align-items-center"
        style={{ backgroundColor: headerColor, color: textColor }}
      >
        <Link to="/" className="text-decoration-none d-flex align-items-center">
          <img src={logoSrc} alt="AlcoMarket" style={{ height: 60 }} />
        </Link>
        <nav className="d-flex align-items-center flex-wrap gap-2">
          <button
            className={`btn btn-sm ${theme === 'dark' ? 'btn-light' : 'btn-outline-secondary'}`}
            onClick={toggleTheme}
          >
            {theme === 'dark' ? '☀️ Светлая' : '🌙 Тёмная'}
          </button>
          <Link to="/" className={`btn btn-sm ${theme === 'dark' ? 'btn-light' : 'btn-outline-primary'}`}>Главная</Link>
          {role === 'admin' && (
            <Link to="/items/new" className={`btn btn-sm ${theme === 'dark' ? 'btn-light' : 'btn-outline-success'}`}>
              ➕ Товар
            </Link>
          )}
          {role === 'user' && (
            <Link to="/cart" className={`btn btn-sm ${theme === 'dark' ? 'btn-light' : 'btn-outline-warning'}`}>
              🛒 Корзина
            </Link>
          )}
          {isAuth ? (
            <button className={`btn btn-sm ${theme === 'dark' ? 'btn-light' : 'btn-outline-danger'}`} onClick={handleLogout}>
              Выйти
            </button>
          ) : (
            <Link to="/login" className={`btn btn-sm ${theme === 'dark' ? 'btn-light' : 'btn-outline-success'}`}>
              Войти
            </Link>
          )}
        </nav>
      </header>

      <main className="container py-4 flex-grow-1">
        {children}
      </main>

      <footer
        className={`mt-auto py-5 ${theme === 'dark' ? 'bg-dark text-white' : 'bg-light text-dark'}`}
        style={{ borderTop: '1px solid #ccc' }}
        >
        <div className="container">
            <div className="row">
            {/* Блок 1 — Логотип и описание */}
            <div className="col-md-4 mb-4">
                <div className="d-flex align-items-center mb-2">
                <img
                    src={logoSrc}
                    alt="AlcoMarket"
                    style={{ height: 50, marginRight: '10px' }}
                />
                <h5 className="mb-0">AlcoMarket</h5>
                </div>
                <p style={{ maxWidth: '300px' }}>
                Лучшие напитки со всего мира. Алкоголь только для лиц старше 18 лет.
                </p>
            </div>

            {/* Блок 2 — Навигация */}
            <div className="col-md-4 mb-4">
                <h6>Навигация</h6>
                <ul className="list-unstyled">
                <li><Link to="/" className="text-decoration-none text-reset">Главная</Link></li>
                <li><Link to="/items" className="text-decoration-none text-reset">Каталог</Link></li>
                <li><Link to="/cart" className="text-decoration-none text-reset">Корзина</Link></li>
                <li><Link to="/login" className="text-decoration-none text-reset">Войти</Link></li>
                <li><Link to="/register" className="text-decoration-none text-reset">Регистрация</Link></li>
                </ul>
            </div>

            {/* Блок 3 — Контакты */}
            <div className="col-md-4 mb-4">
                <h6>Контакты</h6>
                <p>Email: <a href="mailto:support@alcomarket.ru" className="text-decoration-none text-reset">support@alcomarket.ru</a></p>
                <p>Телефон: +7 (495) 123-45-67</p>
                <div className="d-flex gap-2">
                <a href="#" className="text-reset">Instagram</a>
                <a href="#" className="text-reset">Telegram</a>
                <a href="#" className="text-reset">VK</a>
                </div>
            </div>
            </div>

            <div className="text-center mt-4 small text-muted">
            &copy; {new Date().getFullYear()} AlcoMarket — Все права защищены. <br />
            Продажа алкогольной продукции разрешена лицам старше 18 лет.
            </div>
        </div>
        </footer>

    </div>
  );
}

export default Layout;
