import fs from 'fs';
import path from 'path';

export const insertMockData = async (sellerId: string) => {
  const dataDir = path.resolve(__dirname, '../../data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

  const mockFlowers = [
    {
      seller_id: sellerId,
      image_url: 'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg',
      name: 'Sunflower Delight',
      description: 'Bright and cheerful sunflower arrangement',
      price: 45,
      items: ['sunflowers', 'eucalyptus', 'ribbon'],
      status: 'active',
    },
    {
      seller_id: sellerId,
      image_url: 'https://images.pexels.com/photos/1458678/pexels-photo-1458678.jpeg',
      name: 'Rose Romance',
      description: 'Classic red roses in elegant arrangement',
      price: 65,
      items: ['red roses', 'baby breath', 'wrapping'],
      status: 'active',
    },
  ];

  const mockCustomRequests = [
    {
      buyer_telegram_id: 987654321,
      buyer_name: 'Alice Johnson',
      image_url: 'https://images.pexels.com/photos/1179863/pexels-photo-1179863.jpeg',
      prompt: 'I need a beautiful wedding bouquet with white flowers and greenery',
      items: ['white roses', 'lilies', 'eucalyptus', 'ribbon'],
      status: 'open',
    },
    {
      buyer_telegram_id: 123987456,
      buyer_name: 'Bob Smith',
      image_url: 'https://images.pexels.com/photos/1488515/pexels-photo-1488515.jpeg',
      prompt: 'Anniversary bouquet with mixed colorful flowers',
      items: ['tulips', 'carnations', 'daisies'],
      status: 'open',
    },
  ];

  const mockOrders = [
    {
      seller_id: sellerId,
      buyer_telegram_id: 555666777,
      buyer_name: 'Emma Wilson',
      image_url: 'https://images.pexels.com/photos/1458678/pexels-photo-1458678.jpeg',
      price: 55,
      status: 'pending_pickup',
    },
  ];

  try {
    fs.writeFileSync(path.join(dataDir, 'flowers.json'), JSON.stringify(mockFlowers, null, 2));
    fs.writeFileSync(path.join(dataDir, 'custom_requests.json'), JSON.stringify(mockCustomRequests, null, 2));
    fs.writeFileSync(path.join(dataDir, 'orders.json'), JSON.stringify(mockOrders, null, 2));
  } catch (error) {
    console.error('Error inserting mock data:', error);
  }
};
