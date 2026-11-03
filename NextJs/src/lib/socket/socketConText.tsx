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
        // console.log('[socket] provider effect; enabled:', enabled);
        if (!enabled) {
            // console.log('[socket] connection skipped because provider is disabled');
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
        const handleConnect = () => {
            // console.log('[socket] connected:', socketInstance.id);
        };
        const handleDisconnect = (reason: string) => {
            // console.log('[socket] disconnected:', {
            //     id: socketInstance.id,
            //     reason,
            // });
        };
        const handleConnectError = (error: Error) => {
            console.error('WebSocket connection failed:', error.message);
        };
        const handleServerException = (error: unknown) => {
            console.error('[socket] server exception:', error);
        };

        socketInstance.on('connect', handleConnect);
        socketInstance.on('disconnect', handleDisconnect);
        socketInstance.on('connect_error', handleConnectError);
        socketInstance.on('exception', handleServerException);

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSocketState({ enabled, socket: socketInstance });
        socketInstance.connect();

        return () => {
            disposed = true;
            socketInstance.off('connect', handleConnect);
            socketInstance.off('disconnect', handleDisconnect);
            socketInstance.off('connect_error', handleConnectError);
            socketInstance.off('exception', handleServerException);
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
                // console.log('[socket] heartbeat emitted:', socket.id);
                socket.emit('heartbeat', (response: { ok: boolean } | undefined) => {
                    // if (response?.ok) {
                    //     console.log('[socket] heartbeat acknowledged:', socket.id);
                    // } else {
                    //     console.warn('[socket] heartbeat received no successful acknowledgment');
                    // }
                });
            } else {
                console.log('[socket] heartbeat skipped; socket is disconnected');
            }
        };

        socket.on('connect', sendHeartbeat);
        const heartbeatTimer = window.setInterval(sendHeartbeat, 30_000);
        sendHeartbeat();

        return () => {
            socket.off('connect', sendHeartbeat);
            window.clearInterval(heartbeatTimer);
        };
    }, [socket]);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
