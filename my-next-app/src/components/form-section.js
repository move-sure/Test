// components/FormSection.js
'use client';

/**
 * FormSection component to create collapsible sections in the form
 * 
 * @param {Object} props
 * @param {string} props.title - Section title
 * @param {React.ReactNode} props.children - Section content
 */
const FormSection = ({ title, children }) => {
  return (
    <div className="bg-white shadow-md rounded-lg border border-gray-300 overflow-hidden mb-6">
      <div className="bg-gray-100 px-4 py-3 border-b border-gray-300">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="p-5">
        {children}
      </div>
    </div>
  );
};

export default FormSection;