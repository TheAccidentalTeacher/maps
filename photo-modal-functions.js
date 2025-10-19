// ═══════════════════════════════════════════════════
// PHOTO MODAL with AI-Generated Captions! 🎨🧠
// Add these functions to your index.html after toggleCard()
// ═══════════════════════════════════════════════════

/**
 * Open photo in full-screen modal with AI-generated caption
 */
async function openPhotoModal(photoIndex) {
    if (!window.currentPhotos || !window.currentPhotos[photoIndex]) {
        console.error('❌ Photo not found:', photoIndex);
        return;
    }
    
    const photo = window.currentPhotos[photoIndex];
    const modal = document.getElementById('photo-modal');
    const img = document.getElementById('photo-modal-image');
    const photographer = document.getElementById('photo-modal-photographer');
    const photographerLink = document.getElementById('photo-modal-photographer-link');
    const title = document.getElementById('photo-modal-title');
    const description = document.getElementById('photo-modal-description');
    const relevance = document.getElementById('photo-modal-relevance');
    const searchQuery = document.getElementById('photo-search-query');
    const loading = document.getElementById('photo-modal-loading');
    
    if (!modal) return;
    
    // Show modal
    modal.classList.add('active');
    img.src = photo.url;
    img.alt = photo.description || 'Location photo';
    photographer.textContent = photo.photographer;
    photographerLink.href = photo.photographerUrl || '#';
    title.textContent = photo.description || currentLocation || 'Photo Details';
    
    // Add source badge
    if (photo.source) {
        photographer.textContent = `${photo.photographer} (${photo.source})`;
    }
    
    if (photo.searchQuery) {
        searchQuery.textContent = photo.searchQuery;
        searchQuery.parentElement.style.display = 'block';
    } else {
        searchQuery.parentElement.style.display = 'none';
    }
    
    // ⚠️ ADD AI DISCLOSURE IF AI-GENERATED
    let existingDisclosure = document.querySelector('.ai-disclosure');
    if (existingDisclosure) {
        existingDisclosure.remove();
    }
    
    if (photo.isAIGenerated) {
        const aiDisclosure = document.createElement('div');
        aiDisclosure.className = 'ai-disclosure';
        aiDisclosure.innerHTML = `
            <h4>⚠️ AI-Generated Educational Visualization</h4>
            <p>This image was created by artificial intelligence to help visualize 
            <strong>${photo.searchQuery || photo.description}</strong> when authentic photography was unavailable. 
            While AI-generated, the content is based on geographic and cultural facts.</p>
            
            <details style="margin-top: 12px;">
                <summary style="cursor: pointer; color: #fbbf24; font-size: 13px; font-weight: 600;">Technical Details</summary>
                <ul style="margin-top: 8px; padding-left: 20px; color: #cbd5e1; font-size: 12px;">
                    <li><strong>Model:</strong> ${photo.aiModel || 'Unknown'}</li>
                    <li><strong>Generated:</strong> ${photo.generatedAt ? new Date(photo.generatedAt).toLocaleString() : 'Unknown'}</li>
                    <li><strong>Source:</strong> ${photo.source}</li>
                </ul>
            </details>
        `;
        
        const modalInfo = document.querySelector('.photo-modal-info');
        if (modalInfo) {
            modalInfo.insertBefore(aiDisclosure, modalInfo.firstChild);
        }
    }
    
    loading.classList.remove('hidden');
    description.innerHTML = '<p style="color: #94a3b8;">🧠 Generating educational caption with AI...</p>';
    relevance.style.display = 'none';
    
    // Generate AI caption
    await generatePhotoCaption(photo, description, relevance, loading);
    
    console.log('📸 Opened photo modal:', photo.searchQuery || photo.description);
}

/**
 * Close photo modal
 */
function closePhotoModal() {
    const modal = document.getElementById('photo-modal');
    if (modal) {
        modal.classList.remove('active');
        console.log('📸 Closed photo modal');
    }
}

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePhotoModal();
});

/**
 * Generate AI caption for photo
 */
async function generatePhotoCaption(photo, descElement, relevanceElement, loadingElement) {
    try {
        const locationName = currentLocation || 'this location';
        const countryName = window.currentLocationData?.country || '';
        
        console.log('🧠 Generating AI caption for:', photo.searchQuery);
        
        // Try calling backend
        const response = await fetch(`/.netlify/functions/generate-photo-caption`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                photo, 
                location: locationName, 
                country: countryName 
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            const parts = data.caption.split('This photo is relevant because');
            
            if (parts.length === 2) {
                descElement.innerHTML = `<p>${parts[0].trim()}</p>`;
                relevanceElement.textContent = 'This photo is relevant because' + parts[1].trim();
                relevanceElement.style.display = 'block';
            } else {
                descElement.innerHTML = `<p>${data.caption}</p>`;
            }
            
            loadingElement.classList.add('hidden');
            console.log('✅ AI caption generated successfully');
            return;
        }
        
        // Fallback
        const fallbackCaption = `This ${photo.searchQuery || 'photograph'} captures an important aspect of ${locationName}. ${photo.description || 'This location'} represents the unique character and culture of this region. Students can learn about geography, culture, and history by studying images like this from different parts of the world.`;
        
        descElement.innerHTML = `<p>${fallbackCaption}</p>`;
        relevanceElement.textContent = `This photo helps students visualize ${locationName} and understand its unique characteristics.`;
        relevanceElement.style.display = 'block';
        loadingElement.classList.add('hidden');
        
        console.log('ℹ️ Using fallback caption (AI endpoint not available)');
        
    } catch (error) {
        console.error('❌ Error generating photo caption:', error);
        descElement.innerHTML = `<p>${photo.description || 'This photograph shows an important location feature.'} Click the photographer's name to see more of their work!</p>`;
        relevanceElement.style.display = 'none';
        loadingElement.classList.add('hidden');
    }
}
