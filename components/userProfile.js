import { useState, useEffect } from "react";
// import {io} from 'socket.io-client';

export function useProfile(email) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 const [notify,setNotify] = useState(null);
  
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
  
  useEffect(()=>{
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notification'); // Fetch notifications from the API
        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }
        const data = await response.json(); 

        if (Array.isArray(data)) { // Ensure it's an array
          setNotify(data);
         console.log('notify',notify);
        console.log('Notifications:', data); // Handle the fetched data
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }
  ,[])
  
  return { 
    loading, data, error
  };
  
}