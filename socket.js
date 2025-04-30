import WebSocket, { WebSocketServer } from 'ws';

const PORT = 8765;
const wss = new WebSocketServer({ port: PORT });

const rfidMap = {
    "63980E90": "Size Up",
    "33563AAF": "Renee",
    "B32E3591": "NARS",
    "33E41EAF": "Nivea",
    "F3C29FF7": "Saint Laurent",
};

console.log(`✅ WebSocket server is running on ws://192.168.102.185:${PORT}`);

wss.on('connection', ws => {
    console.log('🔌 ESP32 connected');

    ws.on('message', message => {
        console.log('📨 Received:', message.toString());

        try {
            const data = JSON.parse(message);
            const shelf = rfidMap[data.rfid] || "🟡 Unknown Location";
            console.log(`📍 Robot reached: ${shelf}`);
        } catch (err) {
            console.error('❌ Invalid JSON:', message.toString());
        }
    });
});
