// app/bilty/page.js (Updated)
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
          message: `Bilty #${formData.gr_no} successfully created!`
        });
        
        // Optional: Scroll to top after submission
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // You could add form reset logic here if needed
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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl my-8">
        <header className="mb-8 border-b border-blue-200 pb-4">
          <h1 className="text-3xl font-bold text-blue-900">Transport Bilty Entry</h1>
          <p className="text-blue-700 mt-2">
            Complete the form below to create a new transport bilty. Fields marked with <span className="text-red-600">*</span> are required.
          </p>
        </header>

        {submitResult.success !== null && (
          <div 
            className={`mb-8 p-4 rounded-md ${
              submitResult.success ? 'bg-green-100 text-green-800 border border-green-400' : 'bg-red-100 text-red-800 border border-red-400'
            }`}
          >
            <div className="flex items-center">
              {submitResult.success ? (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <p className="font-semibold">{submitResult.message}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg p-6 shadow-inner">
          <BiltyForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </div>
    </div>
  );
}