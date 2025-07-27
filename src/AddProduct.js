import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    pro_name: '',
    pro_description: '',
    fit: '',
    category: '',
    material: '',
    sex: '',
    price: '',
    image_link: ''
  });
  const [specs, setSpecs] = useState([{ quantity: '', size: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSpecChange = (index, e) => {
    const { name, value } = e.target;
    const newSpecs = [...specs];
    newSpecs[index][name] = value;
    setSpecs(newSpecs);
  };

  const addSpecField = () => {
    setSpecs([...specs, { quantity: '', size: '' }]);
  };

  const removeSpecField = (index) => {
    if (specs.length > 1) {
      const newSpecs = specs.filter((_, i) => i !== index);
      setSpecs(newSpecs);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch("http://localhost:8000/product/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          specs: specs.map(spec => ({
            quantity: parseInt(spec.quantity),
            size: spec.size
          }))
        })
      });

      const data = await response.json();
      if (response.ok) {
        alert('Product added successfully!');
        navigate('/');
      } else {
        throw new Error(data.detail || 'Failed to add product');
      }
    } catch (err) {
      console.error("Add product error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mainpage">
      <form className="add-product-form" onSubmit={handleSubmit}>
        <h2>Add New Product</h2>
        
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label>Product Name</label>
          <input
            type="text"
            className="form-control"
            name="pro_name"
            value={formData.pro_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            className="form-control"
            name="pro_description"
            value={formData.pro_description}
            onChange={handleChange}
            rows="4"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Fit</label>
            <input
              type="text"
              className="form-control"
              name="fit"
              value={formData.fit}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              className="form-control"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Material</label>
            <input
              type="text"
              className="form-control"
              name="material"
              value={formData.material}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select
              className="form-control"
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Price (₹)</label>
            <input
              type="number"
              className="form-control"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="url"
              className="form-control"
              name="image_link"
              value={formData.image_link}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Specifications</label>
          <div className="specs-container">
            {specs.map((spec, index) => (
              <div key={index} className="spec-item">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Quantity"
                  name="quantity"
                  value={spec.quantity}
                  onChange={(e) => handleSpecChange(index, e)}
                  min="1"
                  required
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Size"
                  name="size"
                  value={spec.size}
                  onChange={(e) => handleSpecChange(index, e)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => removeSpecField(index)}
                  disabled={specs.length <= 1}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={addSpecField}
            >
              Add More Sizes
            </button>
          </div>
        </div>

        <div className="form-group">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Adding Product...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;