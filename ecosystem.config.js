module.exports = {
  apps: [
    {
      name: 'andromeda-dashboard',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/dashboard',
      instances: 1,
      exec_mode: 'fork', // Use fork mode instead of cluster to prevent worker issues
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      // Kill timeout to ensure clean restarts
      kill_timeout: 5000,
      // Wait time before restart
      wait_ready: true,
      listen_timeout: 10000,
      error_file: '/var/www/dashboard/logs/err.log',
      out_file: '/var/www/dashboard/logs/out.log',
      log_file: '/var/www/dashboard/logs/combined.log',
      time: true,
    },
  ],
};
