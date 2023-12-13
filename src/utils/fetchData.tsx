const fetchData = async (url: string) => {
    const res = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
    }
    );
    if (!res.ok || res.status >= 300 ) {
        throw new Error('Service Error: ' + res.status)
    }  
    return await res.json();
}

export default fetchData;