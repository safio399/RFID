import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../ui/table";
import { useTranslation } from 'react-i18next';
import AddProduct from "./AddProduct";
import DeleteProduct from "./DeleteProduct";
import ProductRow from "./Row";
import { Order } from "./types";
import TagScan from "./TagScan";

// Cache key constant
const PRODUCTS_CACHE_KEY = "products_data";
const productMap: Record<string, string> = {
  "63980E90": "Size Up",
  "33563AAF": "Renee",
  "B32E3591": "NARS",
  "33E41EAF": "Nivea",
  "F3C29FF7": "Saint Laurent",
};

export default function ProductTable() {
  const [deleteMode, setDeleteMode] = useState(false);
  const { t } = useTranslation();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [tableData, setTableData] = useState<Order[]>(() => {
    // Initialize state from cache if available
    const cachedData = localStorage.getItem(PRODUCTS_CACHE_KEY);
    return cachedData ? JSON.parse(cachedData) : [
      
     
    ];
  });
  const initialInventory = tableData.reduce((acc, product) => {
    if (product.uid) {
      acc[product.uid] = {
        product: product.Product.name,
        quantity: product.quantity
      };
    }
    return acc;
  }, {} as Record<string, { product: string, quantity: number }>);

  // Save to cache whenever tableData changes
  useEffect(() => {
    localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(tableData));
  }, [tableData]);

  const handleAddProduct = (newProduct: Omit<Order, "id">) => {
    // Generate a unique ID (using timestamp for better uniqueness)
    const newId = Date.now();
    const updatedData = [...tableData, { id: newId, ...newProduct }];
    setTableData(updatedData);
  };

  const handleProductScanned = (uid: string) => {
    setTableData(prevData => 
      prevData.map(item => 
        item.uid === uid 
          ? { ...item, quantity: Math.max(0, item.quantity - 1) } 
          : item
      )
    );
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <TagScan 
        initialInventory={initialInventory} 
        productMap={productMap}
        onProductScanned={handleProductScanned}
      />
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
              <ProductRow
                key={order.id}
                order={order}
                deleteMode={deleteMode}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
                setTableData={setTableData}
              />
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