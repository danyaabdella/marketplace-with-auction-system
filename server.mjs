import { createServer } from "node:http";
import { initializeSocket } from "./libs/socket.js";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer((req, res) => {
        // Handle socket.io requests
        if (req.url?.startsWith('/socket.io/')) {
            return;
        }
        // Handle Next.js requests
        handle(req, res);
    });
    
    // Initialize socket.io with the HTTP server
    initializeSocket(httpServer);

    httpServer.listen(port, () => {
        console.log(`Server running on http://${hostname}:${port}`);
    });
});
  



  
