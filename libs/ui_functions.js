export async function fetchUserData(email) {
    try {
      const response = await fetch(`/api/user?email=${email}`); 
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
  
      const user = await response.json(); 
      return user || {}; 
    } catch (error) {
      console.error("Error fetching user data:", error);
      return {};
    }
  }
  