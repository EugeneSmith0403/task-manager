export default defineNuxtPlugin(() => {
  if (process.client) {
    const originalError = console.error;
    console.error = (...args: any[]) => {
      const message = args[0]?.toString() || '';
      if (message.includes('SES_UNCAUGHT_EXCEPTION') || message.includes('lockdown-install.js')) {
        return;
      }
      originalError.apply(console, args);
    };

    window.addEventListener('error', (event) => {
      if (
        event.message?.includes('SES_UNCAUGHT_EXCEPTION') ||
        event.filename?.includes('lockdown-install.js')
      ) {
        event.preventDefault();
        return false;
      }
    });

    window.addEventListener('unhandledrejection', (event) => {
      const reason = event.reason?.toString() || '';
      if (reason.includes('SES_UNCAUGHT_EXCEPTION') || reason.includes('lockdown-install.js')) {
        event.preventDefault();
        return false;
      }
    });
  }
});

