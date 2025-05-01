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
        quantity: 10, // Changed from string to number
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
        quantity: 10,
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
        quantity: 10,
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
        quantity: 10,
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
        quantity: 10,
        price: "500 DA",
      }
    ];
  });
 

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
    const normalizedUid = uid.toUpperCase();
    
    // Check if this is one of our test products
    const productName = productMap[normalizedUid];
    if (!productName) return; // Not a test product
    
    // Find matching product in tableData by name
    setTableData(prevData => 
      prevData.map(item => 
        item.Product.name === productName
          ? { ...item, quantity: Math.max(0, item.quantity - 1) }
          : item
      )
    );
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <TagScan 
         
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