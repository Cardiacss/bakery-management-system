import { useState } from 'react';
import api from './api';

const emptyProduct = { product_name: '', price: '' };

function Products({ products, setProducts, setError }) {
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [actionError, setActionError] = useState('');

  const resetForm = () => {
    setForm(emptyProduct);
    setEditingId(null);
    setActionError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setActionError('');
    setIsSaving(true);

    const payload = {
      product_name: form.product_name.trim(),
      price: Number(form.price),
    };

    try {
      if (editingId !== null) {
        const response = await api.patch(`/products/${editingId}`, payload);
        setProducts((current) => current.map((product) => (
          String(product.idProd) === String(editingId) ? response.data : product
        )));
      } else {
        const response = await api.post('/products', payload);
        setProducts((current) => [...current, response.data]);
      }
      resetForm();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Unable to save this product.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.idProd);
    setForm({ product_name: product.product_name, price: String(product.price) });
    setActionError('');
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete ${product.product_name}? This cannot be undone.`)) {
      return;
    }

    setActionError('');
    try {
      await api.delete(`/products/${product.idProd}`);
      setProducts((current) => current.filter((item) => String(item.idProd) !== String(product.idProd)));
      if (String(editingId) === String(product.idProd)) {
        resetForm();
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to delete this product.';
      setActionError(message);
      setError(message);
    }
  };

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Products</h1>
          <p>Create and maintain the products available in your bakery.</p>
        </div>
        <div className="admin">Admin</div>
      </div>

      <div className="products-layout">
        <section className="product-form-panel">
          <div className="section-heading">
            <h2>{editingId === null ? 'New product' : 'Edit product'}</h2>
            <p>{editingId === null ? 'Add an item to your product list.' : 'Update the selected product details.'}</p>
          </div>

          {actionError && <p className="error product-error" role="alert">{actionError}</p>}

          <form className="product-form" onSubmit={handleSubmit}>
            <label>
              <span>Product name</span>
              <input
                value={form.product_name}
                onChange={(event) => setForm({ ...form, product_name: event.target.value })}
                placeholder="e.g. Mie Goreng"
                required
              />
            </label>
            <label>
              <span>Price (Rp)</span>
              <input
                type="number"
                value={form.price}
                onChange={(event) => setForm({ ...form, price: event.target.value })}
                min="1"
                step="1"
                placeholder="e.g. 3500"
                required
              />
            </label>
            <div className="form-actions">
              <button className="button button--primary" type="submit" disabled={isSaving}>
                {isSaving ? 'Saving…' : editingId === null ? 'Add product' : 'Save changes'}
              </button>
              {editingId !== null && (
                <button className="button button--secondary" type="button" onClick={resetForm}>Cancel</button>
              )}
            </div>
          </form>
        </section>

        <section className="product-list-panel">
          <div className="section-heading section-heading--row">
            <div>
              <h2>All products</h2>
              <p>{products.length} product{products.length === 1 ? '' : 's'} in your catalogue.</p>
            </div>
          </div>

          {products.length === 0 ? (
            <p className="empty">No products yet. Add your first product on the left.</p>
          ) : (
            <div className="product-table-wrap">
              <table>
                <thead>
                  <tr><th>Product</th><th className="sales-cell">Price</th><th aria-label="Actions" /></tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.idProd}>
                      <td>{product.product_name}</td>
                      <td className="sales-cell">Rp {Number(product.price).toLocaleString('id-ID')}</td>
                      <td className="table-actions">
                        <button type="button" onClick={() => handleEdit(product)}>Edit</button>
                        <button className="delete-action" type="button" onClick={() => handleDelete(product)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

export default Products;
