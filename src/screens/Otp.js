import React, { useEffect, useState } from 'react';
import '../components/otp.css'; // Replace with your CSS file path
import '@fortawesome/fontawesome-free/css/all.css';
import generateOTP from '../components/Generateotp';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import formData from 'form-data'; 
import Mailgun from 'mailgun.js';

export default function Otp() {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const authToken = sessionStorage.getItem('authToken');
  const decodedToken = jwtDecode(authToken);
  const userId = decodedToken.user.id;

  

  const isAllInputFilled = () => {
    const inputs = document.querySelectorAll(".otp-input");
    return Array.from(inputs).every((input) => input.value);
  };

  const toggleFilledClass = (field) => {
    field.classList.toggle("filled", field.value);
  };

  const handleInput = (e) => {
    const target = e.target;
    toggleFilledClass(target);
    if (target.value !== '' && target.nextElementSibling) {
      target.nextElementSibling.focus();
    }
    verifyOTP();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const inputs = document.querySelectorAll(".otp-input");
    const text = e.clipboardData.getData("text");
    inputs.forEach((item, index) => {
      if (index < text.length) {
        item.value = text[index];
        toggleFilledClass(item);
      }
    });
    verifyOTP();
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 8) {
      e.preventDefault();
      const inputs = document.querySelectorAll(".otp-input");
      inputs.forEach((input, index) => {
        if (input.value === "" && index > 0) {
          input.previousElementSibling.focus();
        }
      });
    }
  };

  useEffect(() => {

    const generatedOTP = generateOTP();
    setOtp(generatedOTP);

    const fetchEmailAndSendOTP = async () => {
      try {
        const response = await fetch(`http://localhost:9015/api/dataget/${window.ID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': authToken
          }
        });

        if (response.ok) {
          const data = await response.json();
          const userEmail = data.email; // Assuming your API returns the email in this format

          const generatedOTP = generateOTP();
          setOtp(generatedOTP);

          // Mailgun Configuration
          const mailgun = new Mailgun(formData);
          const mg = mailgun.client({
            username: 'api', 
            key: 'b6f62306692dd7d21ca0d40f60bc0034-a2dd40a3-adfe4eb5' 
          });

          mg.messages.create('sandbox-123.mailgun.org', {
            from: "Excited User <mailgun@sandbox-123.mailgun.org>",
            to: "harshbelarkha@proton.me", 
            subject: "Your OTP",
            text: `Your OTP for verification is: ${generatedOTP}`
          })
          .then(msg => console.log(msg)) 
          .catch(err => console.error('Error sending email:', err));
        } else {
          console.error('Failed to fetch email address');
          // Handle error accordingly
        }
      } catch (error) {
        console.error('Error fetching email and sending OTP:', error);
        // Handle error gracefully
      }
    };

    fetchEmailAndSendOTP();
  }, []); // Empty dependency array ensures this effect runs only once on mount


  const verifyOTP = async () => {
    if (isAllInputFilled()) {
      const enteredOTP = Array.from(document.querySelectorAll(".otp-input")).map(input => input.value).join('');
      if (enteredOTP === otp) {
        try {
          const response = await fetch(`http://localhost:9015/api/updateEmailVerified/${userId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': authToken
            },
          });

          if (response.ok) {
            console.log('Email verification status updated successfully');
            navigate('/Home');
          } else {
            console.error('Failed to update email verification status');
            alert('Oops, got some error on backend. Try contacting admin or try again.');
          }
        } catch (error) {
          console.error('Error occurred while updating email verification status:', error);
        }
      } else {
        console.error('Incorrect OTP');
        // Handle incorrect OTP (display error message, etc.)
      }
    }
  };

  return (
    <section>
      <div className="container11">
        <h1 className="title">Enter OTP</h1>
        <h2>Your OTP is {otp}</h2> {/* Display the generated OTP */}
        <form id="otp-form">
          <input type="text" className="otp-input" maxLength="1" onInput={handleInput} onPaste={handlePaste} onKeyDown={handleKeyDown} />
          <input type="text" className="otp-input" maxLength="1" onInput={handleInput} onPaste={handlePaste} onKeyDown={handleKeyDown} />
          <input type="text" className="otp-input" maxLength="1" onInput={handleInput} onPaste={handlePaste} onKeyDown={handleKeyDown} />
          <input type="text" className="otp-input" maxLength="1" onInput={handleInput} onPaste={handlePaste} onKeyDown={handleKeyDown} />
          <input type="text" className="otp-input" maxLength="1" onInput={handleInput} onPaste={handlePaste} onKeyDown={handleKeyDown} />
        </form>
      </div>
    </section>
  );
}
