import { v4 as uuidv4 } from 'uuid';

export function renderDashboard(container, onLogout, onEditOverlay) {
  let overlays = [];
  
  const render = async () => {
    try {
      const { getOverlays, deleteOverlay, logoutUser } = await import('../storage.js');
      overlays = await getOverlays();
      
      container.innerHTML = `
        <div class="dashboard">
          <div class="dashboard-header">
            <h1>My Overlays</h1>
            <div>
              <button id="createOverlayBtn" class="btn-primary btn-lg">Create New Overlay</button>
              <button id="logoutBtn" class="btn-outline btn-lg">Sign Out</button>
            </div>
          </div>
          
          <div class="overlay-list">
            ${overlays.length > 0 
              ? overlays.map(overlay => `
                <div class="overlay-card">
                  <h3>${overlay.title || 'Untitled Overlay'}</h3>
                  <p>${overlay.targetUrl || 'No target URL'}</p>
                  <div class="overlay-card-actions">
                    <button class="edit-btn" data-id="${overlay.id}">Edit</button>
                    <button class="share-btn" data-id="${overlay.id}">Share</button>
                    <button class="preview-btn" data-id="${overlay.id}">Preview</button>
                    <button class="delete-btn" data-id="${overlay.id}">Delete</button>
                  </div>
                </div>
              `).join('')
              : '<div class="empty-state"><h3>No overlays yet</h3><p>Create your first overlay to get started</p><button id="emptyStateCreateBtn" class="btn-primary btn-lg">Create New Overlay</button></div>'
            }
          </div>
        </div>
      `;
      
      // Add event listeners
      document.getElementById('createOverlayBtn').addEventListener('click', () => {
        onEditOverlay();
      });
      
      // Add empty state create button listener if it exists
      const emptyStateBtn = document.getElementById('emptyStateCreateBtn');
      if (emptyStateBtn) {
        emptyStateBtn.addEventListener('click', () => {
          onEditOverlay();
        });
      }
      
      document.getElementById('logoutBtn').addEventListener('click', async () => {
        await logoutUser();
        if (onLogout) onLogout();
      });
      
      document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const overlayId = btn.getAttribute('data-id');
          onEditOverlay(overlayId);
        });
      });
      
      document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const overlayId = btn.getAttribute('data-id');
          showShareModal(overlayId);
        });
      });
      
      document.querySelectorAll('.preview-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const overlayId = btn.getAttribute('data-id');
          showPreview(overlayId);
        });
      });
      
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const overlayId = btn.getAttribute('data-id');
          if (confirm('Are you sure you want to delete this overlay?')) {
            await deleteOverlay(overlayId);
            render();
          }
        });
      });
    } catch (error) {
      container.innerHTML = `<p>Error loading dashboard: ${error.message}</p>`;
    }
  };
  
  const showShareModal = (overlayId) => {
    const overlay = overlays.find(o => o.id === overlayId);
    if (!overlay) return;
    
    const shareUrl = `${window.location.origin}/overlay.html?id=${overlayId}`;
    
    const modal = document.createElement('div');
    modal.className = 'share-modal';
    modal.innerHTML = `
      <div class="share-container">
        <button class="share-close">&times;</button>
        <h2>Share Overlay</h2>
        <p>Share this URL with anyone to display your overlay on ${overlay.targetUrl || 'any website'}:</p>
        <div class="share-url">
          <input type="text" value="${shareUrl}" readonly id="shareUrlInput" />
          <button id="copyUrlBtn">Copy</button>
        </div>
        <p class="share-instructions">
          <strong>Instructions:</strong><br>
          1. Copy this URL<br>
          2. Share it with your audience<br>
          3. When they visit this URL, they'll see the target website with your overlay
        </p>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.share-close').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    document.getElementById('copyUrlBtn').addEventListener('click', () => {
      const input = document.getElementById('shareUrlInput');
      input.select();
      document.execCommand('copy');
      alert('URL copied to clipboard!');
    });
  };
  
  const showPreview = async (overlayId) => {
    try {
      const { getOverlayById } = await import('../storage.js');
      const overlay = await getOverlayById(overlayId);
      
      const previewModal = document.createElement('div');
      previewModal.className = 'overlay-preview';
      previewModal.innerHTML = `
        <div class="preview-container">
          <div class="preview-header">
            <h2>Preview: ${overlay.title || 'Untitled Overlay'}</h2>
            <button class="preview-close">&times;</button>
          </div>
          <div class="preview-content">
            <iframe src="${overlay.targetUrl}" class="preview-iframe"></iframe>
            <div class="web-overlay">
              <div class="overlay-content">
                <button class="overlay-close">&times;</button>
                <h1>${overlay.title || 'Untitled Overlay'}</h1>
                ${overlay.sections.map(section => `
                  <div class="overlay-section">
                    ${section.title ? `<h2>${section.title}</h2>` : ''}
                    ${section.type === 'video' ? `
                      <video class="overlay-video" controls>
                        <source src="${section.content}" type="video/mp4">
                        Your browser does not support the video tag.
                      </video>
                    ` : section.type === 'image' ? `
                      <img class="overlay-image" src="${section.content}" alt="${section.title || 'Image'}" />
                    ` : `
                      <div class="overlay-text">${section.content}</div>
                    `}
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(previewModal);
      
      previewModal.querySelector('.preview-close').addEventListener('click', () => {
        document.body.removeChild(previewModal);
      });
      
      previewModal.querySelector('.overlay-close').addEventListener('click', () => {
        previewModal.querySelector('.web-overlay').style.display = 'none';
      });
    } catch (error) {
      alert(`Error loading preview: ${error.message}`);
    }
  };
  
  render();
}
