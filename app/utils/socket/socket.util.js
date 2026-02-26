/**
 * @file app/utils/socket/socket.util.js
 * @description Socket.IO utility for central management of socket communication
 */

import { Server } from 'socket.io';

let io = null;

/**
 * Initialize Socket.IO instance
 * @param {import('http').Server} server 
 */
export function initSocket(server) {
    io = new Server(server, {
        cors: {
            origin: "*", // Adjust this based on your security requirements
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('새로운 접속:', socket.id);

        // 기사님 전용 방 입장
        socket.on('join_room', (riderId) => {
            socket.join(`rider_${riderId}`);
            console.log(`기사님 ${riderId}번 방 입장`);
        });

        socket.on('disconnect', () => {
            console.log('접속 해제:', socket.id);
        });
    });

    return io;
}

/**
 * Get the initialized io instance
 */
export function getIO() {
    if (!io) {
        throw new Error('Socket.IO has not been initialized. Please call initSocket first.');
    }
    return io;
}

/**
 * Emit to all connected clients
 */
export function emitToAll(event, data) {
    if (io) {
        io.emit(event, data);
    }
}

/**
 * Emit to a specific rider room
 */
export function emitToRider(riderId, event, data) {
    if (io) {
        io.to(`rider_${riderId}`).emit(event, data);
    }
}

export default {
    initSocket,
    getIO,
    emitToAll,
    emitToRider
};
