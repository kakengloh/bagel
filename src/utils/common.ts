export const normalizeURLPath = (text: string): string => {
  // Prepend slash
  if (text[0] !== '/') {
    text = '/' + text;
  }

  if (text === '/') {
    return text;
  }

  // Remove trailing slash
  return decodeURI(text).replace(/\/+/g, '/').replace(/\/+$/, '');
};
