import { useState } from "react";
import { useTranslation } from 'react-i18next';
import Badge from "../../../components/ui/badge/Badge";
import { db } from "../../../server/firestore";
import { collection, addDoc } from "firebase/firestore";
import { Order } from "./types";

interface AddProductProps {
  onAdd: (item: Omit<Order, "id">) => void;
}

export default function AddProduct({ onAdd }: AddProductProps) {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState<Omit<Order, "id">>({
    Product: {
      image: "",
      name: "",
      category: "",
    },
    manufacturing: 0,
    expirationDate: 0,
    validation: "",
    quantity: 0,
    price: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (["name", "category", "image"].includes(name)) {
      setNewItem(prev => ({
        ...prev,
        Product: {
          ...prev.Product,
          [name]: value,
        },
      }));
    } else {
      setNewItem(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const docRef = await addDoc(collection(db, "product"), newItem);
      const newItemWithId = { ...newItem, id: docRef.id };
      onAdd(newItemWithId);
      setShowForm(false);
      setNewItem({
        Product: { image: "", name: "", category: "" },
        manufacturing: 0,
        expirationDate: 0,
        validation: "",
        quantity: 0,
        price: 0,
      });
      console.log("Product added to Firestore and updated locally ✅", newItemWithId);
    } catch (error) {
      console.error("Error adding product to Firestore ❌", error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <>
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="rounded-full border border-gray-300 bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 text-sm font-medium text-white shadow-lg hover:bg-blue-700"
        >
          {t("Add Product")}
        </button>
      )}

      {showForm && (
        <div className="mt-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg p-6 w-full max-w-xl mx-auto transition-all duration-300">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
            {t("Add")} {t("New")} {t("Product")}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
            <input
              name="name"
              value={newItem.Product.name}
              onChange={handleChange}
              placeholder={t("Name")}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition;"
            />
            <input
              name="category"
              value={newItem.Product.category}
              onChange={handleChange}
              placeholder={t("Category")}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition;"
            />

            <input
              name="manufacturing"
              value={newItem.manufacturing}
              onChange={handleChange}
              placeholder={t("Manufacturing Date")}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition;"
            />
            <input
              name="expirationDate"
              value={newItem.expirationDate}
              onChange={handleChange}
              placeholder={t("Expiration Date")}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition;"
            />
            <input
              name="validation"
              value={newItem.validation}
              onChange={handleChange}
              placeholder={t("Validation")}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition;"
            />
            <input
              name="quantity"
              value={newItem.quantity}
              onChange={handleChange}
              placeholder={t("Quantity")}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition;"
            />
            <input
              name="price"
              value={newItem.price}
              onChange={handleChange}
              placeholder={t("Price")}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition;"
            />
          </div>
          <div className="flex items-center gap-4 pt-8">
            <label
              htmlFor="imageUpload"
              className="cursor-pointer inline-block px-4 py-2 bg-blue-600 text-white text-sm rounded-lg shadow hover:bg-blue-700 transition"
            >
              {t("Upload Product Image")}
            </label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setNewItem(prev => ({
                      ...prev,
                      Product: {
                        ...prev.Product,
                        image: reader.result as string,
                      },
                    }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            {newItem.Product.image && (
              <div className="relative w-16 h-16">
                <img
                  src={newItem.Product.image}
                  alt="Preview"
                  className="w-full h-full object-cover rounded border border-gray-300 dark:border-gray-600"
                />
                <button
                  onClick={() =>
                    setNewItem(prev => ({
                      ...prev,
                      Product: {
                        ...prev.Product,
                        image: "",
                      },
                    }))
                  }
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-700"
                  title="Remove"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end mt-6 gap-3">
            <button onClick={handleSubmit}>
              <Badge size="md" color="success">
                {t("Submit")}
              </Badge>
            </button>
            <button onClick={handleCancel}>
              <Badge size="md" color="error">
                {t("Cancel")}
              </Badge>
            </button>
          </div>
        </div>
      )}
    </>
  );
}