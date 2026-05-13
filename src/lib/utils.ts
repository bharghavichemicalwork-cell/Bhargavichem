/**
 * Transforms a Google Drive sharing link into a direct download link that can be used as an image source.
 * 
 * Example Input: https://drive.google.com/file/d/1pj9lRYBtsyKRAMeOifhyLHfsJOU4WKr3/view?usp=sharing
 * Example Output: https://drive.google.com/uc?export=view&id=1pj9lRYBtsyKRAMeOifhyLHfsJOU4WKr3
 */
export function getGoogleDriveDirectLink(url: string | undefined | null): string {
    if (!url) return '/placeholder.png';

    // If it's already a direct link or not a Google Drive link, return as is
    if (!url.includes('drive.google.com')) return url;

    // Handle /file/d/ID/view format
    const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
        return `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
    }

    // Handle ?id=ID format (if it exists)
    const idParamMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idParamMatch && idParamMatch[1]) {
        return `https://drive.google.com/uc?export=view&id=${idParamMatch[1]}`;
    }

    return url;
}
