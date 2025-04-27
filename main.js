import './style.css';
import { renderAuth } from './src/components/Auth.js';
import { renderDashboard } from './src/components/Dashboard.js';
import { renderOverlayEditor } from './src/components/OverlayEditor.js';
import { onAuthChange, initializeSampleData } from './src/storage.js';

// Initialize sample data for testing
initializeSampleData();

const app = document.querySelector('#app');

// Application state
let currentView = 'auth'; // 'auth', 'dashboard', 'editor'
let currentOverlayId = null;

// Render the current view
const renderView = () => {
  app.innerHTML = ''; // Clear the app container
  
  switch (currentView) {
    case 'auth':
      renderAuth(app, () => {
        currentView = 'dashboard';
        renderView();
      });
      break;
      
    case 'dashboard':
      renderDashboard(
        app, 
        () => {
          currentView = 'auth';
          renderView();
        },
        (overlayId) => {
          currentOverlayId = overlayId;
          currentView = 'editor';
          renderView();
        }
      );
      break;
      
    case 'editor':
      renderOverlayEditor(
        app,
        currentOverlayId,
        () => {
          currentView = 'dashboard';
          renderView();
        },
        () => {
          currentView = 'dashboard';
          renderView();
        }
      );
      break;
  }
};

// Check authentication state on load
onAuthChange((user) => {
  if (user) {
    currentView = 'dashboard';
  } else {
    currentView = 'auth';
  }
  renderView();
});

// Initial render
renderView();
