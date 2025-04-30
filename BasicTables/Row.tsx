import { useState } from "react";
import { TableCell, TableRow } from "../../ui/table";
import Badge from "../../../components/ui/badge/Badge";
import { Order } from "./types";
import { db } from "../../../server/firestore";
import { doc, updateDoc } from "firebase/firestore";
import { useTranslation } from 'react-i18next';

interface ProductRowProps {
  order: Order;
  deleteMode: boolean;
  selectedItems: string[];
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
  setTableData: React.Dispatch<React.SetStateAction<Order[]>>;
}

export default function ProductRow({
  order,
  deleteMode,
  selectedItems,
  setSelectedItems,
  setTableData,
}: ProductRowProps) {
  const { t } = useTranslation();
  const [editMode, setEditMode] = useState(false);
  const [editedItem, setEditedItem] = useState<Order | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Order) => {
    if (editedItem) {
      setEditedItem({ ...editedItem, [field]: e.target.value });
    }
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

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedItem(null);
  };

  const handleEditClick = (order: Order) => {
    setEditMode(true);
    setEditedItem({ ...order });
  };

  return (
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
                <Badge size="md" color="success">
                  {t("Save")}
                </Badge>
              </button>
              <button className="underline text-red-500 ml-2" onClick={handleCancelEdit}>
                <Badge size="md" color="error">
                  {t("Cancel")}
                </Badge>
              </button>
            </>
          ) : (
            <button className="underline text-blue-500 mt-4" onClick={() => handleEditClick(order)}>
              {t("Edit")}
            </button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}