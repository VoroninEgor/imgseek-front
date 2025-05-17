import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// Callback endpoint
app.post('/api/callback', (req, res) => {
    const productIds = req.body;
    
    if (!Array.isArray(productIds)) {
        return res.status(400).json({ error: 'Expected an array of product IDs' });
    }

    // Emit the product IDs to all connected clients
    io.emit('productIds', productIds);
    
    res.json({ success: true });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 