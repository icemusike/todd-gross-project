export function renderOverlayEditor(container, overlayId, onSave, onCancel) {
  let overlay = {
    title: '',
    targetUrl: '',
    sections: []
  };
  
  const render = async () => {
    try {
      if (overlayId) {
        const { getOverlayById } = await import('../storage.js');
        overlay = await getOverlayById(overlayId);
      }
      
      container.innerHTML = `
        <div class="overlay-editor">
          <div class="editor-header">
            <h1>${overlayId ? 'Edit Overlay' : 'Create New Overlay'}</h1>
          </div>
          
          <form class="editor-form" id="overlayForm">
            <div class="form-group">
              <label for="title">Overlay Title</label>
              <input type="text" id="title" value="${overlay.title || ''}" placeholder="Enter a title for your overlay" required />
            </div>
            
            <div class="form-group">
              <label for="targetUrl">Target Website URL</label>
              <input type="url" id="targetUrl" value="${overlay.targetUrl || ''}" placeholder="https://example.com" required />
              <small>This is the website where your overlay will appear</small>
            </div>
            
            <h2>Content Sections</h2>
            <div id="sectionsContainer">
              ${overlay.sections && overlay.sections.length > 0 
                ? overlay.sections.map((section, index) => renderSection(section, index)).join('')
                : ''}
            </div>
            
            <button type="button" id="addSectionBtn" class="add-section-btn">+ Add Section</button>
            
            <div class="editor-actions">
              <button type="button" class="cancel-btn" id="cancelBtn">Cancel</button>
              <button type="submit" class="save-btn">Save Overlay</button>
            </div>
          </form>
        </div>
      `;
      
      // Add event listeners
      document.getElementById('addSectionBtn').addEventListener('click', () => {
        addSection();
      });
      
      document.getElementById('cancelBtn').addEventListener('click', () => {
        if (onCancel) onCancel();
      });
      
      document.getElementById('overlayForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = document.getElementById('title').value;
        const targetUrl = document.getElementById('targetUrl').value;
        
        // Collect sections
        const sections = [];
        const sectionElements = document.querySelectorAll('.section-container');
        
        sectionElements.forEach(sectionEl => {
          const type = sectionEl.querySelector('select').value;
          const title = sectionEl.querySelector('.section-title').value;
          const content = sectionEl.querySelector('.section-content-input').value;
          
          sections.push({
            type,
            title,
            content
          });
        });
        
        const updatedOverlay = {
          ...overlay,
          id: overlayId,
          title,
          targetUrl,
          sections
        };
        
        try {
          const { saveOverlay } = await import('../storage.js');
          const savedId = await saveOverlay(updatedOverlay);
          
          if (onSave) onSave(savedId);
        } catch (error) {
          alert(`Error saving overlay: ${error.message}`);
        }
      });
      
      // Add event listeners for existing sections
      addSectionEventListeners();
      
      // If no sections, add one by default
      if (!overlay.sections || overlay.sections.length === 0) {
        addSection();
      }
    } catch (error) {
      container.innerHTML = `<p>Error loading editor: ${error.message}</p>`;
    }
  };
  
  const renderSection = (section = { type: 'text', title: '', content: '' }, index) => {
    return `
      <div class="section-container" data-index="${index}">
        <div class="section-header">
          <h3>Section ${index + 1}</h3>
          <button type="button" class="remove-section-btn" data-index="${index}">&times;</button>
        </div>
        
        <div class="section-content">
          <div class="form-group">
            <label>Section Type</label>
            <select class="section-type">
              <option value="text" ${section.type === 'text' ? 'selected' : ''}>Text</option>
              <option value="image" ${section.type === 'image' ? 'selected' : ''}>Image</option>
              <option value="video" ${section.type === 'video' ? 'selected' : ''}>Video</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Section Title (optional)</label>
            <input type="text" class="section-title" value="${section.title || ''}" placeholder="Section title" />
          </div>
          
          <div class="form-group">
            <label>${section.type === 'text' ? 'Text Content' : section.type === 'image' ? 'Image URL' : 'Video URL'}</label>
            ${section.type === 'text' 
              ? `<textarea class="section-content-input" rows="4" placeholder="Enter your text content here...">${section.content || ''}</textarea>` 
              : `<input type="url" class="section-content-input" value="${section.content || ''}" placeholder="${section.type === 'image' ? 'https://example.com/image.jpg' : 'https://example.com/video.mp4'}" />`
            }
          </div>
        </div>
      </div>
    `;
  };
  
  const addSection = () => {
    const sectionsContainer = document.getElementById('sectionsContainer');
    const newIndex = sectionsContainer.children.length;
    
    const newSectionHtml = renderSection({ type: 'text', title: '', content: '' }, newIndex);
    sectionsContainer.insertAdjacentHTML('beforeend', newSectionHtml);
    
    // Add event listeners for the new section
    addSectionEventListeners();
  };
  
  const addSectionEventListeners = () => {
    // Add event listeners for remove buttons
    document.querySelectorAll('.remove-section-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        removeSection(index);
      });
    });
    
    // Add event listeners for section type changes
    document.querySelectorAll('.section-type').forEach(select => {
      select.addEventListener('change', (e) => {
        const sectionContainer = e.target.closest('.section-container');
        const contentGroup = sectionContainer.querySelector('.section-content .form-group:last-child');
        const currentValue = contentGroup.querySelector('.section-content-input').value;
        
        const type = e.target.value;
        const label = contentGroup.querySelector('label');
        
        if (type === 'text') {
          label.textContent = 'Text Content';
          contentGroup.innerHTML = `
            <label>Text Content</label>
            <textarea class="section-content-input" rows="4" placeholder="Enter your text content here...">${currentValue}</textarea>
          `;
        } else {
          label.textContent = type === 'image' ? 'Image URL' : 'Video URL';
          contentGroup.innerHTML = `
            <label>${type === 'image' ? 'Image URL' : 'Video URL'}</label>
            <input type="url" class="section-content-input" value="${currentValue}" placeholder="${type === 'image' ? 'https://example.com/image.jpg' : 'https://example.com/video.mp4'}" />
          `;
        }
      });
    });
  };
  
  const removeSection = (indexToRemove) => {
    const sectionsContainer = document.getElementById('sectionsContainer');
    const sectionToRemove = document.querySelector(`.section-container[data-index="${indexToRemove}"]`);
    
    if (sectionToRemove) {
      sectionsContainer.removeChild(sectionToRemove);
      
      // Update indices for remaining sections
      const remainingSections = document.querySelectorAll('.section-container');
      remainingSections.forEach((section, newIndex) => {
        section.setAttribute('data-index', newIndex);
        section.querySelector('h3').textContent = `Section ${newIndex + 1}`;
        section.querySelector('.remove-section-btn').setAttribute('data-index', newIndex);
      });
    }
  };
  
  render();
}
