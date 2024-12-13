import { useState, useEffect } from "react";

export function useProfile(email) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!email) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    setLoading(true);

    fetch(`/api/signup?email=${email}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch profile data");
        }
      })
      .then((data) => {
        setData(data);
        setError(null);
      })
      .catch((error) => {
        setError(error.message || "Error fetching profile data");
        setData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [email]); // Only run when email changes

  return { loading, data, error };
}
