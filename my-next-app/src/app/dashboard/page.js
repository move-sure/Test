// app/bilty/page.js
'use client';

import { useState } from 'react';
import BiltyForm from '../../components/formsection';
import { submitBiltyForm } from '../../components/datafetch';

/**
 * Main Bilty form page
 * This component handles form submission and displays success/error messages
 */
export default function BiltyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState({
    success: null,
    message: null
  });

  /**
   * Handle form submission
   * @param {Object} formData - The complete form data
   */
  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setSubmitResult({ success: null, message: null });

    try {
      const result = await submitBiltyForm(formData);
      
      if (result.success) {
        setSubmitResult({
          success: true,
          message: `Bilty successfully created with GR No: ${formData.gr_no}`
        });
        
        // Optional: Reset form or redirect to a new page
        // You can pass a reset function to the BiltyForm component if needed
      } else {
        setSubmitResult({
          success: false, 
          message: `Failed to create bilty: ${result.error?.message || 'Unknown error'}`
        });
      }
    } catch (error) {
      console.error('Error submitting bilty form:', error);
      setSubmitResult({
        success: false,
        message: `Error: ${error.message || 'An unexpected error occurred'}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Transport Bilty Entry</h1>
        <p className="text-gray-600 mt-2">
          Fill in all the required details to create a new transport bilty.
        </p>
      </header>

      {submitResult.success !== null && (
        <div 
          className={`mb-6 p-4 rounded-md ${
            submitResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          <p className="font-medium">{submitResult.message}</p>
        </div>
      )}

      <BiltyForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}