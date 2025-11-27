/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.discordapp.com'],
  },
  // Expose server-side environment variables
  serverRuntimeConfig: {
    DATABASE_PATH: process.env.DATABASE_PATH,
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
    DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,
    DISCORD_API_ENABLED: process.env.DISCORD_API_ENABLED,
  },
  // Expose public environment variables
  publicRuntimeConfig: {
    DISCORD_BOT_NAME: process.env.NEXT_PUBLIC_DISCORD_BOT_NAME,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('better-sqlite3');
    }
    return config;
  },
}

module.exports = nextConfig
