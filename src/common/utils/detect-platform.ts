export function detectPlatform(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    const cleanHost = hostname.replace(/^www\./, '');
    const parts = cleanHost.split('.');
    const platform = parts.length > 1 ? parts[parts.length - 2] : cleanHost;
    return platform.toLowerCase();
  } catch {
    return 'other';
  }
}
