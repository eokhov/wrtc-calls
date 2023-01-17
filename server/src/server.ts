import express, {Application} from 'express';
import {Server as SocketIOServer} from 'socket.io';
import {createServer, Server as HTTPServer} from 'node:http';
import cors from 'cors';

export class Server {
    private httpServer: HTTPServer;
    private app: Application;
    private io: SocketIOServer;

    private readonly DEFAULT_PORT = 1337;
    private activeSockets: string[] = [];

    constructor() {
        this.app = express();

        this.app.use(cors());

        this.httpServer = createServer(this.app);
        this.io = new SocketIOServer(this.httpServer);

        this.handleSocketConnection();
    }

    private handleSocketConnection() {
        this.io.on('connection', (socket) => {
            console.log('User connected');

            const existingSocket = this.activeSockets.find(
                existing => existing == socket.id
            );

            if(!existingSocket) {
                this.activeSockets.push(socket.id);

                socket.emit('update-user-list', {
                    users: this.activeSockets.filter(
                        existing => existing != socket.id
                    )
                });

                socket.broadcast.emit('update-user-list', {
                    users: [socket.id]
                });
            }

            socket.on('call-user', data => {
                socket.to(data.to).emit('call-made', {
                    offer: data.offer,
                    socket: socket.id
                });
            });

            socket.on('make-answer', data => {
                socket.to(data.to).emit('answer-made', {
                    socket: socket.id,
                    answer: data.answer
                });
            });

            socket.on('disconnect', () => {
                this.activeSockets = this.activeSockets.filter(
                  existingSocket => existingSocket != socket.id
                );
                socket.broadcast.emit('remove-user', {
                  socketId: socket.id
                });
            });
        })
    }

    public listen(cb: (port: number) => void) {
        this.httpServer.listen(this.DEFAULT_PORT, () => {
            cb(this.DEFAULT_PORT);
        });
    }
}