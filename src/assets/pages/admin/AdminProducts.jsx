import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API = "http://localhost:3001/products";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("all");

  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState("add"); // NEW
  const [editingId, setEditingId] = useState(null); // NEW

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    images: "",
    brand: "",
    description: ""
  });

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API);
      setProducts(res.data);
    } catch {
      toast.error("Failed to load inventory");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      category: "",
      price: "",
      stock: "",
      images: "",
      brand: "",
      description: ""
    });
    setMode("add");
    setEditingId(null);
  };

  const addProduct = async () => {
    const payload = {
      name: form.name.trim(),
      category: form.category.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      images: [form.images.trim()],
      brand: form.brand.trim(),
      description: form.description.trim()
    };

    try {
      await axios.post(API, payload);
      toast.success("Piece added to collection");
      resetForm();
      setShowForm(false);
      fetchProducts();
    } catch {
      toast.error("Check server connection");
    }
  };

  
  const startEdit = (product) => {
    setForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      images: Array.isArray(product.images) ? product.images[0] : product.images,
      brand: product.brand,
      description: product.description
    });

    setEditingId(product.id);
    setMode("edit");
    setShowForm(true);
  };

  const updateProduct = async () => {
    const payload = {
      name: form.name.trim(),
      category: form.category.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      images: [form.images.trim()],
      brand: form.brand.trim(),
      description: form.description.trim()
    };

    try {
      await axios.put(`${API}/${editingId}`, payload);
      toast.success("Product updated");
      resetForm();
      setShowForm(false);
      fetchProducts();
    } catch {
      toast.error("Update failed");
    }
  };


  const deleteProduct = async (id) => {
    if (window.confirm("Archive this item?")) {
      await axios.delete(`${API}/${id}`);
      toast.success("Item removed");
      fetchProducts();
    }
  };

  const filteredProducts =
    category === "all"
      ? products
      : products.filter(p =>
          p.category.toLowerCase() === category.toLowerCase()
        );

  const isInvalid =
    !form.name.trim() ||
    !form.category.trim() ||
    !form.price ||
    !form.stock ||
    !form.images?.trim();

  return (
    <div className="space-y-10 pb-20">

  
      <button
        onClick={() => {
          setShowForm(v => !v);
          if (!showForm) resetForm();
        }}
        className="px-4 py-2 border border-[#c8a97e]/30 text-[#c8a97e] text-xs uppercase tracking-widest"
      >
        {showForm ? "Close Form" : "Add New Product"}
      </button>

      {showForm && (
        <section className="bg-[#1a140e]/40 border border-[#c8a97e]/10 p-8 rounded-sm">
          <h3 className="text-xl font-serif italic mb-8 text-white">
            {mode === "add"
              ? "Inventory Registration"
              : "Edit Product"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4 md:col-span-2 grid grid-cols-2 gap-4">
              <input name="name" placeholder="Piece Name"
                value={form.name} onChange={handleChange}
                className="admin-input col-span-2" />

              <input name="brand" placeholder="Brand/Designer"
                value={form.brand} onChange={handleChange}
                className="admin-input" />

              <select name="category"
                value={form.category}
                onChange={handleChange}
                className="admin-input">
                <option value="">Select Category</option>
                <option value="chairs">CHAIRS</option>
                <option value="storage">STORAGE</option>
                <option value="decor">DECOR</option>
                <option value="dining">DINING</option>
                <option value="sofa">SOFA</option>
                <option value="shelf">SHELF</option>
              </select>

              <input name="price" type="number" placeholder="Price (₹)"
                value={form.price} onChange={handleChange}
                className="admin-input" />

              <input name="stock" type="number" placeholder="Stock Units"
                value={form.stock} onChange={handleChange}
                className="admin-input" />

              <input name="images" placeholder="Image URL"
                value={form.images} onChange={handleChange}
                className="admin-input col-span-2" />

              <textarea name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="admin-input col-span-2 h-24 pt-3" />
            </div>

            <div className="flex flex-col justify-end">
              {mode === "add" ? (
                <button
                  onClick={addProduct}
                  disabled={isInvalid}
                  className="w-full h-14 bg-[#c8a97e]"
                >
                  Add to Collection
                </button>
              ) : (
                <button
                  onClick={updateProduct}
                  disabled={isInvalid}
                  className="w-full h-14 bg-green-600 text-white"
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      <section>
        <div className="flex justify-between items-end mb-8">
          <h3 className="text-xl font-serif italic text-white">
            Live Inventory
          </h3>

          <select value={category}
            onChange={e => setCategory(e.target.value)}
            className="bg-transparent border-b border-[#c8a97e]/30 text-[#c8a97e]">
            <option value="all">ALL PIECES</option>
            <option value="chairs">CHAIRS</option>
            <option value="storage">STORAGE</option>
            <option value="decor">DECOR</option>
            <option value="dining">DINING</option>
            <option value="sofa">SOFA</option>
            <option value="shelf">SHELF</option>
          </select>
        </div>

        <table className="w-full">
          <tbody>
            {filteredProducts.map(p => (
              <tr key={p.id} className="border-b border-[#c8a97e]/10">
                <td>
                  <img
                    src={Array.isArray(p.images) ? p.images[0] : p.images}
                    className="w-12 h-14 object-cover"
                    alt={p.name}
                  />
                </td>

                <td>
                  <p className="text-white">{p.name}</p>
                  <p className="text-[10px] text-[#c8a97e]/40">
                    {p.brand}
                  </p>
                </td>

                <td className="uppercase text-xs">{p.category}</td>

                <td>₹{p.price.toLocaleString()}</td>

                <td>
                  <span className={`px-2 py-1 text-xs border ${
                    p.stock < 5
                      ? "border-rose-900 text-rose-500"
                      : "border-[#c8a97e]/20 text-[#c8a97e]"
                  }`}>
                    {p.stock} units
                  </span>
                </td>

                <td className="text-right space-x-4">
                  <button
                    onClick={() => startEdit(p)}
                    className="text-blue-400 text-xs uppercase"
                  >
                    [ Edit ]
                  </button>

                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="text-rose-600 text-xs uppercase"
                  >
                    [ Delete ]
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <style jsx>{`
        .admin-input {
          background: rgba(15, 10, 7, 0.6);
          border: 1px solid rgba(200, 169, 126, 0.2);
          color: #e6c89c;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        }
        .admin-input:focus {
          border-color: #c8a97e;
        }
      `}</style>
    </div>
  );
}