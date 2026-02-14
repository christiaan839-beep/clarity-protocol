/* ═══════════════════════════════════════════════════════════════
   PDF MANAGER
   PDF downloads, in-app viewing, tracking
   ═══════════════════════════════════════════════════════════════ */

class PDFManager {
    constructor() {
        this.downloads = this.loadDownloads();
    }

    loadDownloads() {
        const saved = localStorage.getItem('clarity_pdf_downloads');
        return saved ? JSON.parse(saved) : {};
    }

    saveDownloads() {
        localStorage.setItem('clarity_pdf_downloads', JSON.stringify(this.downloads));
    }

    async downloadPDF(pdfUrl, fileName) {
        try {
            // Track download
            this.trackDownload(pdfUrl);

            // Create download link
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = fileName || pdfUrl.split('/').pop();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Show success toast
            this.showToast(`✅ Downloaded: ${fileName || 'PDF'}`);

            // Track with analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'pdf_download', {
                    event_category: 'content',
                    event_label: fileName
                });
            }

            return true;
        } catch (error) {
            console.error('PDF download failed:', error);
            this.showToast('❌ Download failed. Please try again.');
            return false;
        }
    }

    async viewPDF(pdfUrl, title) {
        // Create modal viewer
        const modal = document.createElement('div');
        modal.className = 'pdf-viewer-modal';
        modal.innerHTML = `
            <div class="pdf-viewer-container">
                <div class="pdf-viewer-header">
                    <h3>${title || 'PDF Viewer'}</h3>
                    <div class="pdf-viewer-actions">
                        <button class="btn-pdf-download" title="Download">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                        </button>
                        <button class="btn-pdf-close" title="Close">✕</button>
                    </div>
                </div>
                <div class="pdf-viewer-body">
                    <iframe src="${pdfUrl}" frameborder="0"></iframe>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('visible'), 100);

        // Download button
        modal.querySelector('.btn-pdf-download').addEventListener('click', () => {
            this.downloadPDF(pdfUrl, title + '.pdf');
        });

        // Close button
        modal.querySelector('.btn-pdf-close').addEventListener('click', () => {
            modal.classList.remove('visible');
            setTimeout(() => modal.remove(), 300);
        });

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('visible');
                setTimeout(() => modal.remove(), 300);
            }
        });

        // Track view
        this.trackDownload(pdfUrl);
    }

    trackDownload(pdfUrl) {
        if (!this.downloads[pdfUrl]) {
            this.downloads[pdfUrl] = {
                count: 0,
                firstDownload: Date.now(),
                lastDownload: null
            };
        }

        this.downloads[pdfUrl].count++;
        this.downloads[pdfUrl].lastDownload = Date.now();
        this.saveDownloads();
    }

    getDownloadCount(pdfUrl) {
        return this.downloads[pdfUrl]?.count || 0;
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('visible'), 100);
        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// ═══ EXPORT ═══
export { PDFManager };
