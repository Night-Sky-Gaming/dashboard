module.exports = {
  apps: [
    {
      name: 'andromeda-dashboard',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/dashboard',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: '/var/www/dashboard/logs/err.log',
      out_file: '/var/www/dashboard/logs/out.log',
      log_file: '/var/www/dashboard/logs/combined.log',
      time: true,
    },
  ],
};
