import { v4 as uuidv4 } from 'uuid';

// Mock user for direct testing
const DEMO_USER = {
  id: 'demo-user-id',
  email: 'demo@example.com'
};

// Local storage keys
const STORAGE_KEYS = {
  USER: 'web_overlay_user',
  OVERLAYS: 'web_overlay_items'
};

// Auth functions
export const loginUser = (email, password) => {
  // For demo purposes, accept any credentials
  const user = { ...DEMO_USER, email: email || DEMO_USER.email };
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  return Promise.resolve(user);
};

export const registerUser = (email, password) => {
  // For demo purposes, just log them in
  return loginUser(email, password);
};

export const logoutUser = () => {
  localStorage.removeItem(STORAGE_KEYS.USER);
  return Promise.resolve();
};

export const getCurrentUser = () => {
  const userJson = localStorage.getItem(STORAGE_KEYS.USER);
  return userJson ? JSON.parse(userJson) : null;
};

export const onAuthChange = (callback) => {
  // Initial call
  callback(getCurrentUser());
  
  // Listen for storage events (for multi-tab support)
  const handleStorageChange = (e) => {
    if (e.key === STORAGE_KEYS.USER) {
      callback(getCurrentUser());
    }
  };
  
  window.addEventListener('storage', handleStorageChange);
  
  // Return function to remove listener
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
};

// Overlay storage functions
const getStoredOverlays = () => {
  const overlaysJson = localStorage.getItem(STORAGE_KEYS.OVERLAYS);
  return overlaysJson ? JSON.parse(overlaysJson) : [];
};

const saveStoredOverlays = (overlays) => {
  localStorage.setItem(STORAGE_KEYS.OVERLAYS, JSON.stringify(overlays));
};

export const saveOverlay = async (overlayData) => {
  const user = getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  
  const overlayWithUser = {
    ...overlayData,
    userId: user.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  const overlays = getStoredOverlays();
  
  if (overlayData.id) {
    // Update existing overlay
    const index = overlays.findIndex(o => o.id === overlayData.id);
    if (index !== -1) {
      overlays[index] = {
        ...overlayWithUser,
        updatedAt: new Date().toISOString()
      };
    } else {
      throw new Error('Overlay not found');
    }
  } else {
    // Create new overlay
    overlayWithUser.id = uuidv4();
    overlays.push(overlayWithUser);
  }
  
  saveStoredOverlays(overlays);
  return overlayWithUser.id;
};

export const getOverlays = async () => {
  const user = getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  
  const overlays = getStoredOverlays();
  return overlays.filter(overlay => overlay.userId === user.id);
};

export const getOverlayById = async (id) => {
  const overlays = getStoredOverlays();
  const overlay = overlays.find(o => o.id === id);
  
  if (overlay) {
    return overlay;
  } else {
    throw new Error('Overlay not found');
  }
};

export const deleteOverlay = async (id) => {
  const user = getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  
  const overlays = getStoredOverlays();
  const overlay = overlays.find(o => o.id === id);
  
  if (!overlay) throw new Error('Overlay not found');
  if (overlay.userId !== user.id) throw new Error('Not authorized');
  
  const updatedOverlays = overlays.filter(o => o.id !== id);
  saveStoredOverlays(updatedOverlays);
};

// Add some sample data for testing
export const initializeSampleData = () => {
  // Only add sample data if no overlays exist
  const overlays = getStoredOverlays();
  if (overlays.length === 0) {
    const sampleOverlays = [
      {
        id: uuidv4(),
        userId: DEMO_USER.id,
        title: 'Welcome Message',
        targetUrl: 'https://example.com',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sections: [
          {
            type: 'text',
            title: 'Welcome to our site!',
            content: 'Thank you for visiting. This is a sample overlay that demonstrates how you can create custom messages for your visitors.'
          },
          {
            type: 'image',
            title: 'Sample Image',
            content: 'https://picsum.photos/800/400'
          }
        ]
      },
      {
        id: uuidv4(),
        userId: DEMO_USER.id,
        title: 'Product Announcement',
        targetUrl: 'https://mozilla.org',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sections: [
          {
            type: 'text',
            title: 'New Product Launch',
            content: 'We\'re excited to announce our newest product! Check out the details below.'
          },
          {
            type: 'video',
            title: 'Product Demo',
            content: 'https://www.w3schools.com/html/mov_bbb.mp4'
          },
          {
            type: 'text',
            title: 'Limited Time Offer',
            content: 'Get 20% off if you order within the next 24 hours!'
          }
        ]
      }
    ];
    
    saveStoredOverlays(sampleOverlays);
  }
};
