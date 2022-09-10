export const info = (...contents: unknown[]) => {
  console.info('INFO:', ...contents);
};

export const error = (...contents: unknown[]) => {
  console.error('ERROR:', ...contents);
};
