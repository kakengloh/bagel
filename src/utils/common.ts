export const normalizeURLPath = (text: string): string => {
  // Prepend slash
  if (text[0] !== '/') {
    text = '/' + text;
  }

  // Remove trailing slash
  return text.replace(/\/+$/, '');
};

export const noop = () => {};
