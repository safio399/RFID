import { useState, useEffect } from "react";

interface TagScanProps {
  initialInventory: Record<string, { product: string, quantity: number }>;
  productMap: Record<string, string>;
  onProductScanned: (uid: string) => void;
}

export default function TagScan({ initialInventory, productMap, onProductScanned }: TagScanProps) {
  const [scans, setScans] = useState<{ uid: string; product: string; quantity: number }[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [inventory, setInventory] = useState(initialInventory);

  useEffect(() => {
    const socket = new WebSocket("ws://your-ip-address");

    socket.onmessage = async (event) => {
      let data;
      if (event.data instanceof Blob) {
        const text = await event.data.text();
        data = JSON.parse(text);
      } else {
        data = JSON.parse(event.data);
      }

      console.log("✅ Data received:", data);
      const { uid } = data;
      const product = productMap[uid] || "Unknown Product";

      // Update inventory and notify parent
      if (inventory[uid]) {
        const updatedInventory = { ...inventory };
        updatedInventory[uid].quantity -= 1;
        
        if (updatedInventory[uid].quantity === 5) {
          socket.send(JSON.stringify({ action: 'beep', uid }));
          console.log("send action");
        }

        setInventory(updatedInventory);
        onProductScanned(uid); // Notify parent component
        
        setScans(prev => [{ uid, product, quantity: updatedInventory[uid].quantity }, ...prev]);
      }

      // Highlight the new scan
      setHighlightedIndex(0);
      setTimeout(() => setHighlightedIndex(null), 1000);
      
      // Play sound
      const audio = new Audio("/_beep_.mp3");
      audio.play();
    };

    return () => socket.close();
  }, [inventory, productMap, onProductScanned]);

  return (
    <div className="tag-scan-container p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-4">
      <h3 className="text-lg font-semibold mb-2 dark : text-white">Recent Scans</h3>
      <div className="scan-list max-h-40 overflow-y-auto">
        {scans.map((scan, index) => (
          <div 
            key={`${scan.uid}-${index}`}
            className={`p-2 mb-1 rounded ${highlightedIndex === index ? 'bg-blue-100 dark:bg-blue-900' : 'bg-white dark:bg-gray-700'}`}
          >
            <p>Product: {scan.product}</p>
            <p>UID: {scan.uid}</p>
            <p>Remaining: {scan.quantity}</p>
          </div>
        ))}
      </div>
    </div>
  );
}