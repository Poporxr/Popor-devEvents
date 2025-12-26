'use client';
import { useState } from 'react';


const BookEvent = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      setSubmitted(true);
    }, 1000);
  }


  return (
    <div id='book-event'>
      {submitted ? (
        <p className='text-sm'>Thank you for booking! A confirmation email has been sent to {email}.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor='email' >Email Address</label>
            <input
              type='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Enter Your Email' />
          </div>
          <button
            type='submit'
            className='button-submit'
            disabled={!email}
          >
            Book Now
          </button>
        </form>
      )}
    </div>
  );
};

export default BookEvent;