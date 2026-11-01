// context/SocketContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({
    children,
    enabled,
}: {
    children: React.ReactNode;
    enabled: boolean;
}) => {
    const [socketState, setSocketState] = useState<{ enabled: boolean; socket: Socket } | null>(
        null
    );

    useEffect(() => {
        if (!enabled) {
            return;
        }

        let disposed = false;
        const socketInstance = io(
            process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:3001/connect1',
            {
                autoConnect: false,
                auth: (callback) => {
                    void fetch('/api/socket/token', { cache: 'no-store' })
                        .then(async (response) => {
                            if (!response.ok) {
                                throw new Error(
                                    `Failed to obtain socket token: ${response.status}`
                                );
                            }

                            const payload: { token?: unknown } = await response.json();
                            if (typeof payload.token !== 'string') {
                                throw new Error('Socket token response is invalid.');
                            }

                            if (!disposed) {
                                callback({ token: payload.token });
                            }
                        })
                        .catch((error: unknown) => {
                            if (!disposed) {
                                console.error('Unable to obtain WebSocket token:', error);
                                callback({});
                            }
                        });
                },
            }
        );
        socketInstance.on('connect_error', (error) => {
            console.error('WebSocket connection failed:', error.message);
        });

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSocketState({ enabled, socket: socketInstance });
        socketInstance.connect();

        return () => {
            disposed = true;
            socketInstance.disconnect();
        };
    }, [enabled]);

    const socket = socketState?.enabled === enabled && enabled ? socketState.socket : null;

    useEffect(() => {
        if (!socket) {
            return;
        }

        const sendHeartbeat = () => {
            if (socket.connected) {
                socket.emit('heartbeat');
            }
        };

        socket.on('connect', sendHeartbeat);
        const heartbeatTimer = window.setInterval(sendHeartbeat, 60_000);
        sendHeartbeat();

        return () => {
            socket.off('connect', sendHeartbeat);
            window.clearInterval(heartbeatTimer);
        };
    }, [socket]);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
