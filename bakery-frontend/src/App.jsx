import { useEffect, useState } from 'react';
import api from './api';
import './App.css';
import Login from './Login';
import Products from './Products';
import DailyProduction from './DailyProduction';

function App() {
  const [products, setProducts] = useState([]);
  const [dailyProd, setDailyProd] = useState([]);
  const [error, setError] = useState('');
  const [page, setPage] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => Boolean(localStorage.getItem('access_token')),
  );

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const fetchData = async () => {
      try {
        const [productsResponse, dailyProdResponse] = await Promise.all([
          api.get('/products'),
          api.get('/daily-prod'),
        ]);

        setProducts(productsResponse.data);
        setDailyProd(dailyProdResponse.data);
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to load dashboard',
        );
      }
    };

    void fetchData();
  }, [isAuthenticated]);

  const now = new Date();
  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-');
  const todayProduction = dailyProd.filter((item) => (
    String(item.prod_date).slice(0, 10) === today
  ));

  const totalMade = todayProduction.reduce(
    (total, item) => total + item.made,
    0,
  );

  const totalSold = todayProduction.reduce(
    (total, item) => total + item.sold,
    0,
  );

  const totalUnsold = todayProduction.reduce(
    (total, item) => total + item.unsold,
    0,
  );

  const totalSales = todayProduction.reduce(
    (total, item) => total + Number(item.sales || 0),
    0,
  );

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="app">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="logo">
          <span className="logo-mark">Bakery</span>
          <span className="logo-sub">Admin</span>
        </div>

        <nav className="nav">
          <button className={page === 'dashboard' ? 'active' : ''} onClick={() => setPage('dashboard')}>Dashboard</button>
          <button className={page === 'products' ? 'active' : ''} onClick={() => setPage('products')}>Products</button>
          <button className={page === 'production' ? 'active' : ''} onClick={() => setPage('production')}>Daily Production</button>
        </nav>

        <div className="logout">
          <button onClick={handleLogout}>Log out</button>
        </div>

      </aside>

      {/* Main Content */}
      <main className="main">

        {page === 'products' ? (
          <Products products={products} setProducts={setProducts} setError={setError} />
        ) : page === 'production' ? (
          <DailyProduction products={products} dailyProd={dailyProd} setDailyProd={setDailyProd} setError={setError} />
        ) : (
          <>

        {/* Header */}
        <div className="topbar">

          <div>
            <h1>Dashboard</h1>
            <p>Today’s production and sales at a glance.</p>
          </div>

          <div className="admin">Admin</div>

        </div>

        {error && <p className="error">{error}</p>}

        {/* Summary Strip */}
        <div className="summary">

          <div className="stat">
            <p className="stat-label">Total made</p>
            <p className="stat-value">{totalMade}</p>
          </div>

          <div className="stat">
            <p className="stat-label">Total sold</p>
            <p className="stat-value">{totalSold}</p>
          </div>

          <div className="stat">
            <p className="stat-label">Unsold</p>
            <p className="stat-value stat-value--warn">{totalUnsold}</p>
          </div>

          <div className="stat stat--accent">
            <p className="stat-label">Total sales</p>
            <p className="stat-value">
              Rp {totalSales.toLocaleString('id-ID')}
            </p>
          </div>

        </div>

        {/* Main Dashboard Content */}
        <div className="content-grid">

          {/* Daily Production */}
          <section className="panel">

            <h2>Today’s production</h2>

            {todayProduction.length === 0 ? (
              <p className="empty">No production records for today yet.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Made</th>
                    <th>Sold</th>
                    <th>Unsold</th>
                  </tr>
                </thead>
                <tbody>
                  {todayProduction.slice(0, 5).map((item) => (
                    <tr key={item.iddaily}>
                      <td>{item.product.product_name}</td>
                      <td>{item.made}</td>
                      <td>{item.sold}</td>
                      <td>{item.unsold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

          </section>

          {/* Products */}
          <section className="panel">

            <h2>Products</h2>

            {products.length === 0 ? (
              <p className="empty">No products found.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {products.slice(0, 5).map((product) => (
                    <tr key={product.idProd}>
                      <td>{product.product_name}</td>
                      <td>Rp {Number(product.price).toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

          </section>

        </div>

          </>
        )}

      </main>

    </div>
  );
}

export default App;
