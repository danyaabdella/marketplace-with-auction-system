import { useState, useEffect } from "react";
 

export function useProfile(email) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notify, setNotify] = useState([]);
  // const socket = io('/participant');

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

  // useEffect(() => {
  //   const fetchNotifications = async () => {
  //     try {
  //       const response = await fetch('/api/notification'); // Fetch notifications from the API
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch notifications');
  //       }
  //       const data = await response.json();

  //       if (Array.isArray(data)) { // Ensure it's an array
  //         setNotify(data);
  //         console.log('Fetched Notifications:', data); // Log fetched notifications
  //       }
  //     } catch (error) {
  //       console.error('Error fetching notifications:', error);
  //     }
  //   };
  useEffect(() => {
    socket.on("newBidIncrement", (data) => {
      console.log("New Bid Notification:", data);
      setNotify((prev) => [...prev, data]); // Append new notifications
    });

    return () => {
      socket.off("newBidIncrement"); // Cleanup on unmount
    };
  }, []);

    // fetchNotifications();
  // }, []);

  return {
    notify, // Return notifications
    loading, data, error
  };
}
