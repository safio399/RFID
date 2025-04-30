import { useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../ui/table";
import Badge from "../../../components/ui/badge/Badge";
import { db } from "../../../server/firestore"; 
import { collection, addDoc,deleteDoc,updateDoc,  doc } from "firebase/firestore";
import { Trash2, X, CheckCircle } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { t } from "i18next";




// Interface for Order
export interface Order {
  id: number;
  Product: {
    image: string;
    name: string;
    category: string;
  };
  manufacturing: string;
  expirationDate: string;
  validation: string;
  quantity: string;
  price: string;
}

// AddProduct Component
function AddProduct({ onAdd }: { onAdd: (item: Omit<Order, "id">) => void }) {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState<Omit<Order, "id">>({
    Product: {
      image: "",
      name: "",
      category: "",
    },
    manufacturing: "",
    expirationDate: "",
    validation: "",
    quantity: "",
    price: "",
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
      
      // Save the new item to Firestore
      const docRef = await addDoc(collection(db, "product"), newItem);
  
      // Add the new item with its Firestore ID to local state
      const newItemWithId = { ...newItem, id: docRef.id };
  
      // Call onAdd to update the local state, so it appears on the page
      onAdd(newItemWithId);
  
      // Reset the form and hide it
      setShowForm(false);
      setNewItem({
        Product: { image: "", name: "", category: "" },
        manufacturing: "",
        expirationDate: "",
        validation: "",
        quantity: "",
        price: "",
      });
  
      // Log success
      console.log("Product added to Firestore and updated locally ✅", newItemWithId);
    } catch (error) {
      // Handle errors
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
    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">{t("Add")} {t("New")} {t("Product")}</h2>
    
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
      <button
        onClick={handleSubmit}
        
      >
        <Badge
        size="md"
        color="success"
        >
        {t("Submit")}
        </Badge>
        
      </button>
      <button
        onClick={handleCancel}
        
      >
        <Badge
        size="md"
        color="error"
        >
        {t("Cancel")}
        </Badge>
      </button>
    </div>
  </div>
)}

    </>
  );
 
  
}
const DeleteProduct = ({
  
  setTableData,
  deleteMode,
  setDeleteMode,
  selectedItems,
  setSelectedItems,
}: {
  tableData: Order[];
  setTableData: React.Dispatch<React.SetStateAction<Order[]>>;
  deleteMode: boolean;
  setDeleteMode: React.Dispatch<React.SetStateAction<boolean>>;
  selectedItems: string[];
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const handleDelete = async () => {
    
    try {
      for (const itemId of selectedItems) {
        const docRef = doc(db, "product", itemId);
        await deleteDoc(docRef);
      }

      setTableData((prev) =>
        prev.filter((item) => !selectedItems.includes(item.id.toString()))
      );
      setSelectedItems([]);
      setDeleteMode(false);
    } catch (error) {
      console.error("Error deleting items:", error);
    }
  };

  return (
    <div className="relative my-6">
    <button
      onClick={() => setDeleteMode(!deleteMode)}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-tr from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg transition-all duration-200"
    >
      <Trash2 className="w-5 h-5" />
      {deleteMode ? t("Cancel") : t("Delete")}
    </button>
  
    {deleteMode && (
      <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-4  z-10 animate-fade-in-up">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-red-500 mt-1" />
          <div>
            <h4 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-1">
              {t("Confirm Deletion")}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("This action cannot be undone. Proceed?")}
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4 ">
          <button
            onClick={handleDelete}
            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg shadow-sm transition"
          >
            <Trash2 className="w-4 h-4 inline mr-1" />
            {t("Confirm")}
          </button>
          <button
            onClick={() => setDeleteMode(false)}
            className="px-4 py-1.5 text-sm rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <X className="w-4 h-4 inline mr-1" />
            {t("Cancel")}
          </button>
        </div>
      </div>
    )}
  </div>
  



  );
};


// BasicTableOne Component
export default function BasicTableOne() {
  const [deleteMode, setDeleteMode] = useState(false);
  const { t } = useTranslation();
  

const [selectedItems, setSelectedItems] = useState<string[]>([]);
const [editMode, setEditMode] = useState(false); // New state to manage edit mode
  const [editedItem, setEditedItem] = useState<Order | null>(null); // Holds the item being edited
  const [tableData, setTableData] = useState<Order[]>([
    {
      id: 1,
      Product: {
        image: "/images/product/SL.jpg",
        name: "Saint Lauren",
        category: "Perfume",
      },
      manufacturing: "2020",
      expirationDate: "2025",
      validation: "19-04-2025 12:00",
      quantity: "10",
      price: "500 DA",
    },
    {
      id: 2,
      Product: {
        image: "/images/product/NARS.jpg",
        name: "NARS",
        category: "Foundation",
      },
      manufacturing: "2020",
      expirationDate: "2025",
      validation: "19-04-2025 12:00",
      quantity: "10",
      price: "500 DA",
    },
    {
      id: 3,
      Product: {
        image: "/images/product/Nivea.jpg",
        name: "Nivea",
        category: "Stick",
      },
      manufacturing: "2020",
      expirationDate: "2025",
      validation: "19-04-2025 12:00",
      quantity: "10",
      price: "500 DA",
    },
    {
      id: 4,
      Product: {
        image: "/images/product/Renee.jpg",
        name: "Renee",
        category: "Lip Stick",
      },
      manufacturing: "2020",
      expirationDate: "2025",
      validation: "19-04-2025 12:00",
      quantity: "10",
      price: "500 DA",
    },
    {
      id: 5,
      Product: {
        image: "/images/product/sizeUP.jpg",
        name: "Size Up",
        category: "Mascara",
      },
      manufacturing: "2020",
      expirationDate: "2025",
      validation: "19-04-2025 12:00",
      quantity: "10",
      price: "500 DA",
    },
  ]);
 
 
  
  // Handle Edit button click
 const handleEditClick = (order: Order) => {
  setEditMode(true);
  setEditedItem({ ...order }); // Copy the data of the item into the editedItem
};
 // Handle input change for editing
 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Order) => {
  if (editedItem) {
    setEditedItem({ ...editedItem, [field]: e.target.value });
    
    
  }
};
// Handle Save button click after editing
const handleSaveEdit = async () => {
  if (editedItem) {
    try {
      const docRef = doc(db, "product", editedItem.id.toString()); 
      await updateDoc(docRef, {
        Product: {
          image: editedItem.Product.image,
          name: editedItem.Product.name,
          category: editedItem.Product.category,
        },
        manufacturing: editedItem.manufacturing,
        expirationDate: editedItem.expirationDate,
        validation: editedItem.validation,
        quantity: editedItem.quantity,
        price: editedItem.price,
      });
      
      setTableData(prev => prev.map(item => item.id === editedItem.id ? editedItem : item));
    } catch (error) {
      console.error("Error updating Firestore:", error);
    }
    setEditMode(false);
    setEditedItem(null);
  }
};
// Handle Cancel button click for editing
const handleCancelEdit = () => {
  setEditMode(false); // Exit edit mode without saving changes
  setEditedItem(null); // Clear the edited item
};
const handleNestedInputChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  parent: keyof Order,
  child: string
) => {
  const value = e.target.value;

  setEditedItem(prev => {
    if (!prev) return prev;

    return {
      ...prev,
      [parent]: {
        ...(prev[parent] as any),
        [child]: value,
      },
    };
  });
};


  const handleAddProduct = (newProduct: Omit<Order, "id">) => {
    const newId = tableData.length + 1; // Assuming new products get incremental IDs
    setTableData([...tableData, { id: newId, ...newProduct }]);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
            {deleteMode && (
                  <TableCell isHeader className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === tableData.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems(tableData.map((item) => item.id.toString()));
                        } else {
                          setSelectedItems([]);
                        }
                      }}
                    />
                  </TableCell>
                )}
          
          
              
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                {t("Product")}
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                {t("Manufacturing")}
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                {t("Expiration Date")}
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                {t("Validation")}
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                {t("Quantity")}
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                {t("Price")}
              </TableCell>
            
           </TableRow>
          </TableHeader>
            

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {tableData.map((order) => (
              <TableRow key={order.id}>
                 {deleteMode && (
          <TableCell>
            <input
              type="checkbox"
              checked={selectedItems.includes(order.id.toString())}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedItems((prev) => [...prev, order.id.toString()]);
                } else {
                  setSelectedItems((prev) =>
                    prev.filter((id) => id !== order.id.toString())
                  );
                }
              }}
            />
          </TableCell>
        )}
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 overflow-hidden rounded-full">
                      <img width={40} height={40} src={order.Product.image} alt={order.Product.name} />
                    </div>
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {editMode && editedItem?.id === order.id ? (
                      <input
                        type="string"
                        value={editedItem?.Product.name}
                        onChange={(e) => handleNestedInputChange(e, "Product", "name")}
                      />
                    ) : (
                      order.Product.name
                    )}
                      </span>
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                      {editMode && editedItem?.id === order.id ? (
                      <input
                        type="string"
                        value={editedItem?.Product.category}
                        onChange={(e) => handleNestedInputChange(e, "Product", "category")}
                      />
                    ) : (
                      order.Product.category
                    )}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {editMode && editedItem?.id === order.id ? (
                      <input
                        type="string"
                        value={editedItem?.manufacturing}
                        onChange={(e) => handleInputChange(e, "manufacturing")}
                      />
                    ) : (
                      order.manufacturing
                    )}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {editMode && editedItem?.id === order.id ? (
                      <input
                        type="string"
                        value={editedItem?.expirationDate}
                        onChange={(e) => handleInputChange(e, "expirationDate")}
                      />
                    ) : (
                      order.expirationDate
                    )}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {editMode && editedItem?.id === order.id ? (
                      <input
                        type="string"
                        value={editedItem?.validation}
                        onChange={(e) => handleInputChange(e, "validation")}
                      />
                    ) : (
                      order.validation
                    )}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                {editMode && editedItem?.id === order.id ? (
                      <input
                        type="string"
                        value={editedItem?.quantity}
                        onChange={(e) => handleInputChange(e, "quantity")}
                      />
                    ) : (
                     order.quantity
                    )}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                {editMode && editedItem?.id === order.id ? (
                      <input
                        type="string"
                        value={editedItem?.price}
                        onChange={(e) => handleInputChange(e, "price")}
                      />
                    ) : (
                     order.price
                    )}
                </TableCell>
                <TableCell className="px-4 py-3 text-right">
                    <div className="flex justify-end items-center">
                      {editMode && editedItem?.id === order.id ? (
                        <>
                          <button className="underline text-green-500" onClick={handleSaveEdit}>
                            <Badge
                              size="md"
                              color="success"
                              >
                              {t("Save")}
                              </Badge>
                            </button>
                          <button className="underline text-red-500 ml-2" onClick={handleCancelEdit}>
                            <Badge
                              size="md"
                              color="error"
                              >
                              {t("Cancel")}
                            </Badge>
                            </button>
                        </>
                      ) : (
                        <button className="underline text-blue-500 mt-4" onClick={() => handleEditClick(order)}>{t("Edit")}</button>
                      )}
                    </div>
                  </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex gap-2 my-4 justify-center items-center">
          <AddProduct onAdd={handleAddProduct} />
        </div>
        <div className="flex gap-2 my-4 justify-center items-center">
        <DeleteProduct
  tableData={tableData}
  setTableData={setTableData}
  deleteMode={deleteMode}
  setDeleteMode={setDeleteMode}
  selectedItems={selectedItems}
  setSelectedItems={setSelectedItems}
/>
        </div>
      </div>
    </div>
  );
}


