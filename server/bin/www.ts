#!/usr/bin/env node

/**
 * Module dependencies.
 */
import "../env";
import app from "../app";
import debugLib from "debug";
import http from "http";
const debug = debugLib("reldo-api:server");

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT ?? "8080");

if (!port) {
  console.error("Invalid port configuration. Exiting...");
  process.exit(1);
}

app.set("port", port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or default port.
 */
function normalizePort(val: string | number | undefined): number | string {
  if (val === undefined) {
    return 8080; // Default port
  }

  const port = typeof val === "string" ? parseInt(val, 10) : val;

  if (isNaN(port)) {
    // Named pipe
    return val;
  }

  if (port >= 0) {
    // Port number
    return port;
  }

  return 8080; // Fallback to default port
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

  // Handle specific error codes with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening(): void {
  const addr = server.address();

  if (!addr) {
    console.error("Server address is not available. Exiting...");
    process.exit(1);
  }

  const bind = typeof addr === "string" ? `Pipe ${addr}` : `Port ${addr.port}`;
  debug("Listening on " + bind);
}
