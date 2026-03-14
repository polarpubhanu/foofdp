export let mockDonations = [
    {
        _id: 'mock-1',
        foodItem: 'Bread & Pastries',
        quantity: '5kg',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        expiryDate: new Date(Date.now() + 86400000).toISOString(),
        status: 'Delivered',
        donor: { name: 'Local Bakery' },
        location: { address: 'Delhi Gate, New Delhi', coordinates: { lat: 28.6389, lng: 77.2425 } },
        ngoLocation: { lat: 28.5355, lng: 77.3910 } // Noida NGO
    },
    {
        _id: 'mock-2',
        foodItem: 'Fruit Basket',
        quantity: '10kg',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        expiryDate: new Date(Date.now() + 172800000).toISOString(),
        status: 'Accepted',
        donor: { name: 'Fruit Mart' },
        location: { address: 'Marine Drive, Mumbai', coordinates: { lat: 18.9439, lng: 72.8231 } },
        ngoLocation: { lat: 19.0760, lng: 72.8777 } // BKC NGO
    },
    {
        _id: 'mock-3',
        foodItem: 'Fresh Rice & Curry',
        quantity: '20 Meals',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        expiryDate: new Date(Date.now() + 43200000).toISOString(),
        status: 'Pending',
        donor: { name: 'Guest User' },
        location: { address: 'Alliance University, Bangalore', coordinates: { lat: 12.9716, lng: 77.5946 } },
        ngoLocation: { lat: 12.9279, lng: 77.6271 }, // HSR Layout NGO
        deliveryPartner: null,
        pickupStatus: 'None'
    },
    {
        _id: 'mock-4',
        foodItem: 'Sandwiches & Salads',
        quantity: '15 Meals',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        expiryDate: new Date(Date.now() + 43200000).toISOString(),
        status: 'PickedUp',
        donor: { name: 'Corporate Cafe' },
        location: { address: 'Cyber City, Gurgaon', coordinates: { lat: 28.4906, lng: 77.0892 } },
        ngoLocation: { lat: 28.4595, lng: 77.0266 }, // Gurgaon NGO
        deliveryPartner: null,
        pickupStatus: 'None'
    }
];

export const updateMockDonation = (id, updates) => {
    const index = mockDonations.findIndex(d => d._id === id);
    if (index !== -1) {
        mockDonations[index] = { ...mockDonations[index], ...updates };
        return mockDonations[index];
    }
    return null;
};

export const addMockDonation = (donation) => {
    const newDonation = {
        _id: `mock-${Date.now()}`,
        status: 'Pending',
        createdAt: new Date().toISOString(),
        ...donation
    };
    mockDonations.unshift(newDonation);
    return newDonation;
};
