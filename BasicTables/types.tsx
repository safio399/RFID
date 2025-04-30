export interface Order {
    id: number | string;
    uid?: string; // Add RFID UID field
    Product: {
      image: string;
      name: string;
      category: string;
    };
    manufacturing: number;
    expirationDate: number;
    validation: string;
    quantity: number; // Changed from string to number
    price: number;
  }