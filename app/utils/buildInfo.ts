/**
 * Build Information Utility
 * Provides build version and date information
 */

// Build date is set at build time via environment variable
// Version comes from package.json via environment variable or defaults
export const getBuildInfo = () => {
  // Try to get build date from environment (set at build time)
  // If not available, use current date (for development)
  const buildDate = process.env.NEXT_PUBLIC_BUILD_DATE 
    ? new Date(process.env.NEXT_PUBLIC_BUILD_DATE).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
  
  // Version from environment or default
  const buildVersion = process.env.NEXT_PUBLIC_BUILD_VERSION || '0.1.0';
  
  return {
    version: buildVersion,
    date: buildDate,
  };
};

/**
 * Format build info for display
 */
export const formatBuildInfo = (): string => {
  const { version, date } = getBuildInfo();
  return `v${version} • ${date}`;
};

