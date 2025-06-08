
const API_BASE_URL = 'http://localhost:3000';
export async function downloadRoster(rosterId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/download/${rosterId}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Download failed: ${response.status}`);
    }

    const blob = await response.blob();
    
    // Extract filename from Content-Disposition header or use default
    const contentDisposition = response.headers.get('content-disposition');
    let filename = 'roster.json';
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Download failed:', error);
    return false;
  }
}