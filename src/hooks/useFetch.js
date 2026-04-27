import { useState, useEffect, useCallback } from "react";

const useFetch = (fetchFn, dependencies = [], immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const dependencyKey = JSON.stringify(dependencies);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchFn(...args);
      setData(response.data || response);
      return response;
    } catch (err) {
      setError(err.message || "Something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    let isMounted = true;

    if (immediate) {
      Promise.resolve().then(() => {
        if (isMounted) execute();
      });
    }

    return () => {
      isMounted = false;
    };
  }, [execute, immediate, dependencyKey]);

  return {
    data,
    loading,
    error,
    execute,
    setData,
  };
};

export default useFetch;
