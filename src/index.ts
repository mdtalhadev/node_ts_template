import app from "./app";

const port = process.env.PORT || 3001;

const server = app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});


server.on("error", (error) => {
  console.log(`[server]: Error occurred: ${error}`);
  server.close();
  process.exit(1);
}
);

server.on("close", () => {
  console.log("[server]: Server closed");
  
});