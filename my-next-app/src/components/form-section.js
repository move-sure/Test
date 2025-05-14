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
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-800">{title}</h2>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export default FormSection;