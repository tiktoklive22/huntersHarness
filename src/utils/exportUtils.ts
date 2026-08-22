import { toPng } from 'html-to-image';

export async function exportDashboardToPng(
  elementId: string,
  fileName: string = 'KSK_Area_Harness_Follow_Up.png'
): Promise<boolean> {
  const node = document.getElementById(elementId);
  if (!node) {
    console.error('Target export element not found');
    return false;
  }

  // Save original styling
  const originalWidth = node.style.width;
  const originalMinWidth = node.style.minWidth;
  const originalMaxWidth = node.style.maxWidth;

  try {
    // Add fixed landscape class to force exactly 1440px 4-column layout
    node.classList.add('export-landscape-mode');
    node.style.width = '1440px';
    node.style.minWidth = '1440px';
    node.style.maxWidth = '1440px';

    // Wait a brief tick to let layout adjust
    await new Promise((resolve) => setTimeout(resolve, 80));

    // Generate high-resolution PNG (pixelRatio 2.2 for crisp report-level clarity)
    const dataUrl = await toPng(node, {
      quality: 0.98,
      backgroundColor: '#F8FAFC',
      pixelRatio: 2.2,
      cacheBust: true,
      skipFonts: true,
      fontEmbedCSS: '',
      width: 1440,
      filter: (child: Node) => {
        if (child instanceof HTMLElement) {
          if (child.classList.contains('no-print') || child.classList.contains('no-export')) {
            return false;
          }
        }
        return true;
      },
    });

    const link = document.createElement('a');
    link.download = fileName;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (error) {
    console.error('Failed to export dashboard image:', error);
    return false;
  } finally {
    // Always restore original styles and remove export mode class
    node.classList.remove('export-landscape-mode');
    node.style.width = originalWidth;
    node.style.minWidth = originalMinWidth;
    node.style.maxWidth = originalMaxWidth;
  }
}
