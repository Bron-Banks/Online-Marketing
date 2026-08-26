let apiURL = process.env.REACT_APP_APIURL
console.log('API URL:', apiURL);

const signIn = async (user) => {
    try {
        let response = await fetch(apiURL + '/users/signin', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user) 
        });
        return await response.json();  
    } catch (err) {
        console.log('Sign-in error:', err);
        throw err; 
    }
};

const register = async (user) => {
    try {
        let response = await fetch(apiURL + '/users/register', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        return await response.json(); 
    } catch (err) {
        console.log(err);
        throw new Error("Registration failed: " + err.message);
    }
};

const update = async (userID, user) => {
    try {
      console.log("Sending data to backend:", { userID, user });
      let response = await fetch(apiURL + `/users/edit/${userID}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
  
      console.log("Response status:", response.status);
      const result = await response.json();
      console.log("Update response:", result);
  
      if (!response.ok) {
        throw new Error(result.message || "Update failed");
      }
  
      return result;
    } catch (err) {
      console.error("Error during update:", err);
      throw err;
    }
};  


const read = async (userId) => {
    console.log("Inside read() with userId:", userId); // Debug log
    try {
      const response = await fetch(`${apiURL}/users/get/${userId}`);
      console.log("Response status:", response.status); // Debug log
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Data returned from server:", data);
      return data;
    } catch (error) {
      console.error("Error in read function:", error);
      throw error;
    }
};
  
export { signIn, register, read, update }