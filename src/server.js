import browserSync from 'browser-sync';

// Setup basic server
export function dev_server(config) {
  console.log(`Serving ${config.server_folder} on port ${config.server_port}`);
  browserSync({
    server: {
      port: config.server_port,
      baseDir: config.server_folder
    }
  });
}
