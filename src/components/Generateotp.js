// generateOTP.js
const generateOTP = () => {
    let otp = '';
    for (let i = 0; i < 5; i++) {
      const digit = Math.floor(Math.random() * 10);
      otp += digit;
    }
    return otp;
  }
  
  export default generateOTP;
  