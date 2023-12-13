import { useState, useEffect } from 'react'

export default function useFetch(initUrl: string) {
    const [url, setUrl] = useState(initUrl);
    const [data, setData] = useState();
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchCall = async () => {
        try {
            setLoading(true);
            const res = await fetch(url, {
                method: 'GET',
                headers: { Accept: 'application/json' },
            });
            if (!res.ok || res.status >= 300) {
                setError('Error getting data with status ' + res.status);
            }
            let result = await res.json();
            setData(result);
            setLoading(false);
        } catch(err: any) {
            setError(err?.message || 'network error');
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchCall();
    }, [url]);

    return {data, isLoading, error, setUrl};
}