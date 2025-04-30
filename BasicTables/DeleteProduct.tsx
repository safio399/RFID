import { Trash2, X, CheckCircle } from "lucide-react";
import { t } from "i18next";
import { db } from "../../../server/firestore";
import { doc, deleteDoc } from "firebase/firestore";
import { Order } from "./types";

interface DeleteProductProps {
  tableData: Order[];
  setTableData: React.Dispatch<React.SetStateAction<Order[]>>;
  deleteMode: boolean;
  setDeleteMode: React.Dispatch<React.SetStateAction<boolean>>;
  selectedItems: string[];
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function DeleteProduct({
  
  setTableData,
  deleteMode,
  setDeleteMode,
  selectedItems,
  setSelectedItems,
}: DeleteProductProps) {
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
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-4 z-10 animate-fade-in-up">
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
          <div className="flex justify-end gap-2 mt-4">
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
}