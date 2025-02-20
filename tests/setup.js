// Increase timeout for tests
jest.setTimeout(10000);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled promise rejection:', err);
});
