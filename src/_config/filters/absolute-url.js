export function absoluteUrl(url, base) {
  if (!url) {
    return url;
  }

  try {
    return new URL(url, base).toString();
  } catch (error) {
    return url;
  }
}
