export const api = {
  async authenticateSeller(encryptedId: string) {
    const response = await fetch('/api/v1/seller/authenticate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ auth: encryptedId }),
    });
    if (!response.ok) throw new Error('Failed to authenticate seller');
    return await response.json();
  },
  // Add more seller endpoints as needed
};