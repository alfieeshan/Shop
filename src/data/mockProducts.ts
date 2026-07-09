import { Product } from '../types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "phone-1",
    name: "iPhone 15 Pro Max",
    description: "Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever. 100% Original Global/LL/A Variant with active international warranty.",
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=70",
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=70"
    ],
    whatsapp_number: "8801712345678",
    category: "Apple",
    price: 142000.00,
    featured: true,
    created_at: "2026-06-01T12:00:00Z"
  },
  {
    id: "phone-2",
    name: "Samsung Galaxy S24 Ultra",
    description: "Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, you can unleash whole new levels of creativity, productivity and possibility. Complete with S Pen and titanium shield framing. 100% Original Official BD variant.",
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=70",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=70"
    ],
    whatsapp_number: "8801712345678",
    category: "Samsung",
    price: 135000.00,
    featured: true,
    created_at: "2026-06-15T14:30:00Z"
  },
  {
    id: "phone-3",
    name: "Google Pixel 8 Pro",
    description: "The all-pro phone engineered by Google. It has the best of Google AI, the most advanced Pixel Camera ever, and can help you get more done, faster. 100% Original and intact factory unlocked.",
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=70",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=70"
    ],
    whatsapp_number: "8801712345678",
    category: "Google",
    price: 98000.00,
    featured: true,
    created_at: "2026-06-20T08:15:00Z"
  },
  {
    id: "phone-4",
    name: "OnePlus 12",
    description: "Redefined flagship specs with Snapdragon 8 Gen 3, 16GB RAM, and legendary Hasselblad Camera system. Experience the silky smooth Trinity Engine performance. 100% Original Global Intact Variant.",
    images: [
      "https://images.unsplash.com/photo-1565849906461-0ee26584179d?w=800&auto=format&fit=crop&q=70"
    ],
    whatsapp_number: "8801712345678",
    category: "OnePlus",
    price: 84500.00,
    featured: false,
    created_at: "2026-07-01T09:00:00Z"
  },
  {
    id: "phone-5",
    name: "iPhone 15 Plus",
    description: "Features Dynamic Island, 48MP Main Camera, durable color-infused glass and aluminum design, and high-efficiency USB-C connectivity. Exceptional battery life tailored for long gaming or navigation runs.",
    images: [
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=70"
    ],
    whatsapp_number: "8801712345678",
    category: "Apple",
    price: 112000.00,
    featured: false,
    created_at: "2026-07-03T16:45:00Z"
  },
  {
    id: "phone-6",
    name: "Samsung Galaxy Z Flip6",
    description: "Compact, eye-catching, and powered by Galaxy AI. Capture beautiful hands-free FlexCam portraits with the ultimate pocketable custom cover screen experience. 100% Genuine product with official warranty.",
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=70"
    ],
    whatsapp_number: "8801712345678",
    category: "Samsung",
    price: 118000.00,
    featured: false,
    created_at: "2026-07-05T11:20:00Z"
  }
];
