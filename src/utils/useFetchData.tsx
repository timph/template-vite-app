import { useState, useEffect } from "react";

export default function useFetchData<T>(initUrl: string) {
  const [data, setData] = useState<T>();
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState(initUrl);

  const fetchData = async () => {
    setIsLoading(true);

    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" }
    });

    if (response.ok) {
      const result = await response.json();
      console.log(result)
      setData(result);
    } else {
      console.error("Failed to fetch pokemon.");
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  return { data, isLoading, setUrl };
}
