// authUtils.js or helpers.js
function isLoggedIn() {
    const authToken = sessionStorage.getItem('authToken');
    return authToken !== null && authToken !== undefined;
  }
  
  export default isLoggedIn; // Or export other functions if needed
  