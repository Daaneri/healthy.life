import { Fragment, useEffect, useState } from 'react';
import { Pencil, Trash2, Plus, X, Check, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Product } from '../../types/product';

const EMPTY_FORM = {
  name: '',
  description: '',
  price_retail: '',
  category: '',
  stock: '',
  image_url: '',
  price_per_kg: '',
  price_per_2kg: '',
  price_per_3kg_plus: '',
};

const NEW_CATEGORY_VALUE = '__new__';

interface EditValues {
  name: string;
  price_retail: number;
  stock: number;
  category: string;
  description: string;
  price_per_kg: string;
  price_per_2kg: string;
  price_per_3kg_plus: string;
}

// Convierte un string de input a number | null: vacío = sin escala de precio para ese tramo.
function parseNullableNumber(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === '') return null;
  const n = Number(trimmed);
  return Number.isNaN(n) ? null : n;
}

export function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<EditValues>({
    name: '',
    price_retail: 0,
    stock: 0,
    category: '',
    description: '',
    price_per_kg: '',
    price_per_2kg: '',
    price_per_3kg_plus: '',
  });
  const [editNewCategory, setEditNewCategory] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);
  const [newProduct, setNewProduct] = useState(EMPTY_FORM);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [savingNew, setSavingNew] = useState(false);
  const [uploadingId, setUploadingId] = useState<number | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('name');
    if (error) console.error(error);
    else setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = Array.from(new Set(products.map((p) => p.category))).sort();

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setEditNewCategory('');
    setEditValues({
      name: p.name,
      price_retail: p.price_retail,
      stock: p.stock,
      category: p.category,
      description: p.description || '',
      price_per_kg: p.price_per_kg?.toString() ?? '',
      price_per_2kg: p.price_per_2kg?.toString() ?? '',
      price_per_3kg_plus: p.price_per_3kg_plus?.toString() ?? '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id: number) => {
    const finalCategory =
      editValues.category === NEW_CATEGORY_VALUE ? editNewCategory.trim() : editValues.category;

    if (!editValues.name.trim() || !finalCategory) {
      alert('Nombre y categoría son obligatorios.');
      return;
    }

    const payload = {
      name: editValues.name.trim(),
      price_retail: editValues.price_retail,
      stock: editValues.stock,
      category: finalCategory,
      description: editValues.description,
      price_per_kg: parseNullableNumber(editValues.price_per_kg),
      price_per_2kg: parseNullableNumber(editValues.price_per_2kg),
      price_per_3kg_plus: parseNullableNumber(editValues.price_per_3kg_plus),
    };

    const { error } = await supabase.from('products').update(payload).eq('id', id);

    if (error) {
      console.error(error);
      alert('Error al guardar. Probá de nuevo.');
      return;
    }

    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...payload } : p)));
    setEditingId(null);
  };

  const handleDelete = async (id: number, name: string) => {
    const confirmed = window.confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`);
    if (!confirmed) return;

    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      console.error(error);
      alert('Error al eliminar.');
      return;
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleImageUpload = async (product: Product, file: File) => {
    setUploadingId(product.id);

    const ext = file.name.split('.').pop();
    const safeName = product.name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]/g, '-')
      .toLowerCase();
    const storagePath = `products/${product.id}-${safeName}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(storagePath, file, { upsert: true });

    if (uploadError) {
      console.error(uploadError);
      alert('Error al subir la imagen.');
      setUploadingId(null);
      return;
    }

    const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(storagePath);
    const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;

    const { error: updateError } = await supabase
      .from('products')
      .update({ image_url: publicUrl })
      .eq('id', product.id);

    if (updateError) {
      console.error(updateError);
      alert('La imagen se subió pero no pude actualizar el producto.');
      setUploadingId(null);
      return;
    }

    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, image_url: publicUrl } : p))
    );
    setUploadingId(null);
  };

  const handleCreate = async () => {
    const finalCategory =
      newProduct.category === NEW_CATEGORY_VALUE ? newCategoryInput.trim() : newProduct.category.trim();

    if (!newProduct.name.trim() || !finalCategory) {
      alert('Nombre y categoría son obligatorios.');
      return;
    }

    setSavingNew(true);
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: newProduct.name.trim(),
        description: newProduct.description.trim(),
        price_retail: Number(newProduct.price_retail) || 0,
        price_wholesale: null,
        price_per_kg: parseNullableNumber(newProduct.price_per_kg),
        price_per_2kg: parseNullableNumber(newProduct.price_per_2kg),
        price_per_3kg_plus: parseNullableNumber(newProduct.price_per_3kg_plus),
        category: finalCategory,
        stock: Number(newProduct.stock) || 0,
        image_url: newProduct.image_url.trim(),
      })
      .select()
      .single();

    setSavingNew(false);

    if (error) {
      console.error(error);
      alert('Error al crear el producto.');
      return;
    }

    setProducts((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
    setNewProduct(EMPTY_FORM);
    setNewCategoryInput('');
    setShowNewForm(false);
  };

  if (loading) return <p className="text-center text-gray-400 py-10">Cargando productos...</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-green-800">Productos ({products.length})</h2>
        <button
          onClick={() => setShowNewForm((v) => !v)}
          className="flex items-center gap-1 bg-orange-500 text-white text-sm font-medium px-3 py-2 rounded-lg"
        >
          <Plus className="w-4 h-4" />
          Nuevo producto
        </button>
      </div>

      {showNewForm && (
        <div className="bg-white border border-beige-200 rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Nombre"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="border border-beige-300 rounded-lg px-3 py-2 text-sm"
            />

            <div className="flex flex-col gap-2">
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="border border-beige-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white"
              >
                <option value="">Seleccionar categoría...</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value={NEW_CATEGORY_VALUE}>+ Nueva categoría...</option>
              </select>
              {newProduct.category === NEW_CATEGORY_VALUE && (
                <input
                  type="text"
                  placeholder="Nombre de la categoría nueva"
                  value={newCategoryInput}
                  onChange={(e) => setNewCategoryInput(e.target.value)}
                  className="border border-beige-300 rounded-lg px-3 py-2 text-sm"
                />
              )}
            </div>

            <input
              type="number"
              placeholder="Precio ($)"
              value={newProduct.price_retail}
              onChange={(e) => setNewProduct({ ...newProduct, price_retail: e.target.value })}
              className="border border-beige-300 rounded-lg px-3 py-2 text-sm"
            />
            <input
              type="number"
              placeholder="Stock (unidades)"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
              className="border border-beige-300 rounded-lg px-3 py-2 text-sm"
            />
            <textarea
              placeholder="Descripción (opcional)"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              className="border border-beige-300 rounded-lg px-3 py-2 text-sm sm:col-span-2"
            />

            <div className="sm:col-span-2 border-t border-beige-100 pt-3">
              <p className="text-xs font-medium text-gray-500 mb-2">
                Precios por escala (opcional, dejá vacío si no aplica — ej. mixes en oferta por peso)
              </p>
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="number"
                  placeholder="Precio x 1kg"
                  value={newProduct.price_per_kg}
                  onChange={(e) => setNewProduct({ ...newProduct, price_per_kg: e.target.value })}
                  className="border border-beige-300 rounded-lg px-3 py-2 text-sm"
                />
                <input
                  type="number"
                  placeholder="Precio x 2kg"
                  value={newProduct.price_per_2kg}
                  onChange={(e) => setNewProduct({ ...newProduct, price_per_2kg: e.target.value })}
                  className="border border-beige-300 rounded-lg px-3 py-2 text-sm"
                />
                <input
                  type="number"
                  placeholder="Precio x 3kg+"
                  value={newProduct.price_per_3kg_plus}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price_per_3kg_plus: e.target.value })
                  }
                  className="border border-beige-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400">
            La foto se sube después de crear el producto, desde la tabla de abajo.
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setShowNewForm(false)}
              className="text-sm text-gray-500 px-3 py-2"
            >
              Cancelar
            </button>
            <button
              disabled={savingNew}
              onClick={handleCreate}
              className="bg-green-800 disabled:bg-gray-300 text-white text-sm font-medium px-4 py-2 rounded-lg"
            >
              {savingNew ? 'Guardando...' : 'Guardar producto'}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white border border-beige-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-beige-100 text-left">
            <tr>
              <th className="p-3">Foto</th>
              <th className="p-3">Nombre</th>
              <th className="p-3">Categoría</th>
              <th className="p-3">Precio</th>
              <th className="p-3">Stock</th>
              <th className="p-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <Fragment key={p.id}>
                <tr className="border-t border-beige-100">
                  <td className="p-3">
                    <label className="relative w-12 h-12 block rounded-lg overflow-hidden bg-beige-100 cursor-pointer group">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Upload className="w-4 h-4" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        {uploadingId === p.id ? (
                          <span className="text-white text-[10px]">...</span>
                        ) : (
                          <Upload className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(p, file);
                        }}
                      />
                    </label>
                  </td>
                  <td className="p-3">
                    {editingId === p.id ? (
                      <input
                        type="text"
                        value={editValues.name}
                        onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                        className="border border-beige-300 rounded px-2 py-1 text-sm w-full"
                      />
                    ) : (
                      p.name
                    )}
                  </td>
                  <td className="p-3 text-gray-500">
                    {editingId === p.id ? (
                      <div className="flex flex-col gap-1.5">
                        <select
                          value={editValues.category}
                          onChange={(e) => setEditValues({ ...editValues, category: e.target.value })}
                          className="border border-beige-300 rounded px-2 py-1 text-sm bg-white"
                        >
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                          <option value={NEW_CATEGORY_VALUE}>+ Nueva categoría...</option>
                        </select>
                        {editValues.category === NEW_CATEGORY_VALUE && (
                          <input
                            type="text"
                            placeholder="Nombre de la categoría nueva"
                            value={editNewCategory}
                            onChange={(e) => setEditNewCategory(e.target.value)}
                            className="border border-beige-300 rounded px-2 py-1 text-sm"
                          />
                        )}
                      </div>
                    ) : (
                      p.category
                    )}
                  </td>
                  <td className="p-3">
                    {editingId === p.id ? (
                      <input
                        type="number"
                        value={editValues.price_retail}
                        onChange={(e) =>
                          setEditValues({ ...editValues, price_retail: Number(e.target.value) })
                        }
                        className="border border-beige-300 rounded px-2 py-1 w-24 text-sm"
                      />
                    ) : (
                      `$${p.price_retail.toLocaleString('es-AR')}`
                    )}
                  </td>
                  <td className="p-3">
                    {editingId === p.id ? (
                      <input
                        type="number"
                        value={editValues.stock}
                        onChange={(e) =>
                          setEditValues({ ...editValues, stock: Number(e.target.value) })
                        }
                        className="border border-beige-300 rounded px-2 py-1 w-20 text-sm"
                      />
                    ) : (
                      p.stock
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      {editingId === p.id ? (
                        <>
                          <button onClick={() => saveEdit(p.id)} className="text-green-600">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={cancelEdit} className="text-gray-400">
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEdit(p)} className="text-gray-500 hover:text-green-700">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            className="text-gray-500 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
                {editingId === p.id && (
                  <tr className="bg-beige-50 border-t border-beige-100">
                    <td colSpan={6} className="p-3 space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Descripción
                        </label>
                        <textarea
                          value={editValues.description}
                          onChange={(e) =>
                            setEditValues({ ...editValues, description: e.target.value })
                          }
                          placeholder="Descripción breve del producto..."
                          rows={2}
                          className="w-full border border-beige-300 rounded-lg px-3 py-2 text-sm bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Precios por escala (vacío = no aplica)
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="number"
                            placeholder="x 1kg"
                            value={editValues.price_per_kg}
                            onChange={(e) =>
                              setEditValues({ ...editValues, price_per_kg: e.target.value })
                            }
                            className="border border-beige-300 rounded-lg px-3 py-2 text-sm bg-white"
                          />
                          <input
                            type="number"
                            placeholder="x 2kg"
                            value={editValues.price_per_2kg}
                            onChange={(e) =>
                              setEditValues({ ...editValues, price_per_2kg: e.target.value })
                            }
                            className="border border-beige-300 rounded-lg px-3 py-2 text-sm bg-white"
                          />
                          <input
                            type="number"
                            placeholder="x 3kg+"
                            value={editValues.price_per_3kg_plus}
                            onChange={(e) =>
                              setEditValues({ ...editValues, price_per_3kg_plus: e.target.value })
                            }
                            className="border border-beige-300 rounded-lg px-3 py-2 text-sm bg-white"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}