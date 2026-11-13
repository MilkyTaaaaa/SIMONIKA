import { useCallback, useState } from 'react';

// status: idle | loading | success | denied | unavailable | timeout | error
export function useGeolocation() {
  const [state, setState] = useState({ status: 'idle', position: null });

  const refresh = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setState({ status: 'unavailable', position: null });
      return;
    }
    setState({ status: 'loading', position: null });
    navigator.geolocation.getCurrentPosition(
      (p) =>
        setState({
          status: 'success',
          position: {
            latitude: p.coords.latitude,
            longitude: p.coords.longitude,
            accuracy: p.coords.accuracy,
            timestamp: p.timestamp,
          },
        }),
      (err) => {
        const status = err.code === 1 ? 'denied' : err.code === 2 ? 'unavailable' : err.code === 3 ? 'timeout' : 'error';
        setState({ status, position: null });
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }, []);

  return { ...state, refresh };
}
