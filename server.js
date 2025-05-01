const WebSocket = require('ws');

const PORT = 8080;
const wss = new WebSocket.Server({ port: PORT });

let espSocket = null;
let clients = [];

console.log(`📡 WebSocket Server running on ws://localhost:${PORT}`);

wss.on('connection', (socket) => {
  console.log('🔗 New client connected');

  socket.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log("📨 Message received:", data);

      // Determine if it's ESP32 (UID only) or client (action/uid)
      if (data.uid && !data.action) {
        // 📥 UID from ESP32
        console.log("📡 UID from ESP32:", data.uid);
        // Relay to all React clients
        clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ uid: data.uid }));
          }
        });
      } else if (data.action && data.uid) {
        // 🔁 Action from React client (e.g., beep command)
        if (espSocket && espSocket.readyState === WebSocket.OPEN) {
          console.log(`🔔 Sending action "${data.action}" for UID ${data.uid} to ESP32`);
          espSocket.send(JSON.stringify(data));
        }
      }

    } catch (err) {
      console.error("❌ Error handling message:", err);
    }
  });

  // Identify the socket
  socket.on('close', () => {
    console.log('❌ Client disconnected');

    if (socket === espSocket) {
      console.log('⚡ ESP32 disconnected');
      espSocket = null;
    } else {
      clients = clients.filter((client) => client !== socket);
    }
  });

  // Initial role handshake (ESP32 must send { type: "esp" })
  socket.once('message', (message) => {
    try {
      const init = JSON.parse(message);
      if (init.type === 'esp') {
        espSocket = socket;
        console.log("🧠 ESP32 identified and registered");
      } else {
        clients.push(socket);
        console.log("🖥️ Web client registered");
      }
    } catch (err) {
      console.error("❌ Handshake error:", err);
    }
  });
});
