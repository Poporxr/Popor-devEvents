'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';

interface BookEventProps {
  slug: string;
}

const BookEvent: React.FC<BookEventProps> = ({ slug }) => {
  const [email, setEmail] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);

    // Basic client-side email validation for faster feedback
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, slug }),
      });

      const result = (await response.json()) as {
        message: string;
        fieldErrors?: { email?: string; slug?: string };
        error?: string;
      };

      if (!response.ok) {
        // Prefer field-specific error if available, otherwise fallback to generic message
        const fieldError = result.fieldErrors?.email || result.fieldErrors?.slug;
        setError(fieldError || result.error || result.message || 'Failed to create booking.');
        return;
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error while booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id='book-event'>
      {submitted ? (
        <p className='text-sm'>Thank you for booking! A confirmation email has been sent to {email}.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor='email'>Email Address</label>
            <input
              type='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Enter Your Email'
              disabled={isSubmitting}
            />
          </div>
          {error && <p className='mt-2 text-sm text-red-500'>{error}</p>}
          <button
            type='submit'
            className='button-submit'
            disabled={!email || isSubmitting}
          >
            {isSubmitting ? 'Booking...' : 'Book Now'}
          </button>
        </form>
      )}
    </div>
  );
};

export default BookEvent;
