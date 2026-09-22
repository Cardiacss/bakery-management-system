import { useState } from 'react';
import api from './api';

const dateForInput = (date) => [
  date.getFullYear(),
  String(date.getMonth() + 1).padStart(2, '0'),
  String(date.getDate()).padStart(2, '0'),
].join('-');

const today = dateForInput(new Date());
const emptyRecord = { prod_date: today, idprod: '', made: '', sold: '' };

const inputDate = (value) => value ? new Date(value).toISOString().slice(0, 10) : '';

function DailyProduction({ products, dailyProd, setDailyProd, setError }) {
  const [form, setForm] = useState(emptyRecord);
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [actionError, setActionError] = useState('');
  const [filterDate, setFilterDate] = useState(today);

  const resetForm = () => {
    setForm(emptyRecord);
    setEditingId(null);
    setActionError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setActionError('');
    setIsSaving(true);
    const payload = {
      prod_date: form.prod_date,
      idprod: Number(form.idprod),
      made: Number(form.made),
      sold: Number(form.sold),
    };

    try {
      if (editingId !== null) {
        const response = await api.patch(`/daily-prod/${editingId}`, payload);
        setDailyProd((current) => current.map((record) => (
          String(record.iddaily) === String(editingId) ? response.data : record
        )));
      } else {
        const response = await api.post('/daily-prod', payload);
        setDailyProd((current) => [response.data, ...current]);
      }
      resetForm();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Unable to save this production record.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (record) => {
    setEditingId(record.iddaily);
    setForm({
      prod_date: inputDate(record.prod_date),
      idprod: String(record.product.idProd),
      made: String(record.made),
      sold: String(record.sold),
    });
    setActionError('');
  };

  const handleDelete = async (record) => {
    if (!window.confirm(`Delete the ${record.product.product_name} production record? This cannot be undone.`)) {
      return;
    }

    setActionError('');
    try {
      await api.delete(`/daily-prod/${record.iddaily}`);
      setDailyProd((current) => current.filter((item) => String(item.iddaily) !== String(record.iddaily)));
      if (String(editingId) === String(record.iddaily)) {
        resetForm();
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to delete this production record.';
      setActionError(message);
      setError(message);
    }
  };

  const records = [...dailyProd].sort((a, b) => new Date(b.prod_date) - new Date(a.prod_date));
  const filteredRecords = filterDate
    ? records.filter((record) => inputDate(record.prod_date) === filterDate)
    : records;
  const filteredSold = filteredRecords.reduce((total, record) => total + record.sold, 0);
  const filteredSales = filteredRecords.reduce((total, record) => total + Number(record.sales || 0), 0);

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Daily Production</h1>
          <p>Record what was baked and sold each day.</p>
        </div>
        <div className="admin">Admin</div>
      </div>

      <div className="products-layout production-layout">
        <section className="product-form-panel">
          <div className="section-heading">
            <h2>{editingId === null ? 'New record' : 'Edit record'}</h2>
            <p>Track production and sales for one product.</p>
          </div>

          {products.length === 0 ? (
            <p className="empty">Add a product before creating a production record.</p>
          ) : (
            <form className="product-form" onSubmit={handleSubmit}>
              {actionError && <p className="error product-error" role="alert">{actionError}</p>}
              <label>
                <span>Date</span>
                <input type="date" value={form.prod_date} onChange={(event) => setForm({ ...form, prod_date: event.target.value })} required />
              </label>
              <label>
                <span>Product</span>
                <select value={form.idprod} onChange={(event) => setForm({ ...form, idprod: event.target.value })} required>
                  <option value="" disabled>Select a product</option>
                  {products.map((product) => <option key={product.idProd} value={product.idProd}>{product.product_name}</option>)}
                </select>
              </label>
              <div className="quantity-fields">
                <label>
                  <span>Made</span>
                  <input type="number" min="0" step="1" value={form.made} onChange={(event) => setForm({ ...form, made: event.target.value })} required />
                </label>
                <label>
                  <span>Sold</span>
                  <input type="number" min="0" step="1" value={form.sold} onChange={(event) => setForm({ ...form, sold: event.target.value })} required />
                </label>
              </div>
              <div className="form-actions">
                <button className="button button--primary" type="submit" disabled={isSaving}>{isSaving ? 'Saving…' : editingId === null ? 'Add record' : 'Save changes'}</button>
                {editingId !== null && <button className="button button--secondary" type="button" onClick={resetForm}>Cancel</button>}
              </div>
            </form>
          )}
        </section>

        <section className="product-list-panel">
          <div className="section-heading">
            <h2>Production history</h2>
            <p>{filteredRecords.length} record{filteredRecords.length === 1 ? '' : 's'} shown.</p>
          </div>
          <div className="table-toolbar">
            <label className="date-filter">
              <span>Filter by date</span>
              <input type="date" value={filterDate} onChange={(event) => setFilterDate(event.target.value)} />
            </label>
            {filterDate && <button className="clear-filter" type="button" onClick={() => setFilterDate('')}>Clear filter</button>}
          </div>
          {filteredRecords.length === 0 ? (
            <p className="empty">{filterDate ? 'No production records for this date.' : 'No production records yet.'}</p>
          ) : (
            <div className="product-table-wrap">
              <table>
                <thead><tr><th>Date</th><th>Product</th><th className="number-cell">Made</th><th className="number-cell">Sold</th><th className="number-cell">Unsold</th><th className="sales-cell">Sales</th><th aria-label="Actions" /></tr></thead>
                <tbody>
                  {filteredRecords.map((record) => (
                    <tr key={record.iddaily}>
                      <td>{inputDate(record.prod_date)}</td>
                      <td>{record.product.product_name}</td>
                      <td className="number-cell">{record.made}</td><td className="number-cell">{record.sold}</td><td className="number-cell">{record.unsold}</td><td className="sales-cell">Rp {Number(record.sales || 0).toLocaleString('id-ID')}</td>
                      <td className="table-actions"><button type="button" onClick={() => handleEdit(record)}>Edit</button><button className="delete-action" type="button" onClick={() => handleDelete(record)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="daily-totals">
            <div className="daily-total-card">
              <span>Items sold</span>
              <strong>{filteredSold}</strong>
            </div>
            <div className="daily-total-card daily-total-card--accent">
              <span>Total sales</span>
              <strong>Rp {filteredSales.toLocaleString('id-ID')}</strong>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default DailyProduction;
