// components/BiltyForm.js
'use client';

import { useState, useEffect } from 'react';
import AutocompleteInput from './Autocomplete';
import { getLatestEntryByField } from './datafetch';
import FormSection from './form-section';

/**
 * Main Bilty form component with autofill functionality
 * 
 * @param {Object} props
 * @param {Function} props.onSubmit - Function called when the form is submitted
 * @param {boolean} props.isSubmitting - Whether the form is currently submitting
 */
const BiltyForm = ({ onSubmit, isSubmitting = false }) => {
  // Initialize form state with empty values for all fields
  const [formData, setFormData] = useState({
    gr_no: '',
    city_code: '',
    city: '',
    transport_name: '',
    transport_gst: '',
    transport_mobile: '',
    bilty_date: new Date().toISOString().split('T')[0],
    
    consignor_name: '',
    consignor_gst: '',
    consignor_mobile: '',
    
    consignee_name: '',
    consignee_gst: '',
    consignee_mobile: '',
    
    eway_bill_aadhar_pan: '',
    invoice_date: new Date().toISOString().split('T')[0],
    invoice_value: '',
    invoice_no: '',
    pvt_marks: '',
    
    weight: '',
    content: '',
    no_of_packages: '',
    rate: '',
    freight_amount: '',
    payment_mode: 'to-pay',
    delivery_type: 'godown-delivery',
    
    labour_charge: '0',
    bilty_charge: '0',
    toll_tax: '0',
    pf: '0',
    other_charge: '0',
    total_amount: '0',
    
    remarks: '',
  });

  // Fetch data when city_code changes
  const fetchCityData = async (cityCode) => {
    if (!cityCode || cityCode.trim() === '') return;
    
    try {
      const data = await getLatestEntryByField('city_code', cityCode, [
        'city', 'transport_name', 'transport_gst', 'transport_mobile', 'rate'
      ]);
      
      if (data) {
        setFormData(prev => ({
          ...prev,
          city: data.city || prev.city,
          transport_name: data.transport_name || prev.transport_name,
          transport_gst: data.transport_gst || prev.transport_gst,
          transport_mobile: data.transport_mobile || prev.transport_mobile,
          rate: data.rate || prev.rate
        }));
      }
    } catch (error) {
      console.error('Error fetching city data:', error);
    }
  };

  // Fetch data when consignor_name changes
  const fetchConsignorData = async (consignorName) => {
    if (!consignorName || consignorName.trim() === '') return;
    
    try {
      const data = await getLatestEntryByField('consignor_name', consignorName, [
        'consignor_gst', 'consignor_mobile'
      ]);
      
      if (data) {
        setFormData(prev => ({
          ...prev,
          consignor_gst: data.consignor_gst || prev.consignor_gst,
          consignor_mobile: data.consignor_mobile || prev.consignor_mobile
        }));
      }
    } catch (error) {
      console.error('Error fetching consignor data:', error);
    }
  };

  // Fetch data when consignee_name changes
  const fetchConsigneeData = async (consigneeName) => {
    if (!consigneeName || consigneeName.trim() === '') return;
    
    try {
      const data = await getLatestEntryByField('consignee_name', consigneeName, [
        'consignee_gst', 'consignee_mobile'
      ]);
      
      if (data) {
        setFormData(prev => ({
          ...prev,
          consignee_gst: data.consignee_gst || prev.consignee_gst,
          consignee_mobile: data.consignee_mobile || prev.consignee_mobile
        }));
      }
    } catch (error) {
      console.error('Error fetching consignee data:', error);
    }
  };

  // Handle input change for any field
  const handleChange = (field) => (value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Calculate freight and total amount when weight or rate changes
  useEffect(() => {
    const weight = parseFloat(formData.weight) || 0;
    const rate = parseFloat(formData.rate) || 0;
    
    if (weight && rate) {
      const freightAmount = weight * rate;
      
      setFormData(prev => ({
        ...prev,
        freight_amount: freightAmount.toFixed(2)
      }));
    }
  }, [formData.weight, formData.rate]);

  // Calculate total amount when any charge changes
  useEffect(() => {
    const freightAmount = parseFloat(formData.freight_amount) || 0;
    const labourCharge = parseFloat(formData.labour_charge) || 0;
    const biltyCharge = parseFloat(formData.bilty_charge) || 0;
    const tollTax = parseFloat(formData.toll_tax) || 0;
    const pf = parseFloat(formData.pf) || 0;
    const otherCharge = parseFloat(formData.other_charge) || 0;
    
    const totalAmount = freightAmount + labourCharge + biltyCharge + tollTax + pf + otherCharge;
    
    setFormData(prev => ({
      ...prev,
      total_amount: totalAmount.toFixed(2)
    }));
  }, [
    formData.freight_amount,
    formData.labour_charge,
    formData.bilty_charge,
    formData.toll_tax,
    formData.pf,
    formData.other_charge
  ]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-gray-950">
      {/* Transport Details Section */}
      <FormSection title="Transport Details">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AutocompleteInput
            id="gr_no"
            label="GR No"
            value={formData.gr_no}
            onChange={handleChange('gr_no')}
            field="gr_no"
            required
          />
          
          <AutocompleteInput
            id="city_code"
            label="City Code"
            value={formData.city_code}
            onChange={handleChange('city_code')}
            onSuggestionSelect={fetchCityData}
            field="city_code"
            required
          />
          
          <AutocompleteInput
            id="city"
            label="City"
            value={formData.city}
            onChange={handleChange('city')}
            field="city"
            required
          />
          
          <AutocompleteInput
            id="transport_name"
            label="Transport Name"
            value={formData.transport_name}
            onChange={handleChange('transport_name')}
            field="transport_name"
            required
          />
          
          <AutocompleteInput
            id="transport_gst"
            label="Transport GST"
            value={formData.transport_gst}
            onChange={handleChange('transport_gst')}
            field="transport_gst"
          />
          
          <AutocompleteInput
            id="transport_mobile"
            label="Transport Mobile"
            value={formData.transport_mobile}
            onChange={handleChange('transport_mobile')}
            field="transport_mobile"
          />
          
          <div className="mb-4">
            <label htmlFor="bilty_date" className="block text-sm font-medium text-gray-700 mb-1">
              Bilty Date <span className="text-red-500">*</span>
            </label>
            <input
              id="bilty_date"
              type="date"
              value={formData.bilty_date}
              onChange={(e) => handleChange('bilty_date')(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </FormSection>

      {/* Consignor & Consignee Section */}
      <FormSection title="Consignor & Consignee Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Consignor Column */}
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-700">Consignor (Sender)</h3>
            <AutocompleteInput
              id="consignor_name"
              label="Consignor Name"
              value={formData.consignor_name}
              onChange={handleChange('consignor_name')}
              onSuggestionSelect={fetchConsignorData}
              field="consignor_name"
              required
            />
            
            <AutocompleteInput
              id="consignor_gst"
              label="Consignor GST"
              value={formData.consignor_gst}
              onChange={handleChange('consignor_gst')}
              field="consignor_gst"
            />
            
            <AutocompleteInput
              id="consignor_mobile"
              label="Consignor Mobile"
              value={formData.consignor_mobile}
              onChange={handleChange('consignor_mobile')}
              field="consignor_mobile"
            />
          </div>
          
          {/* Consignee Column */}
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-700">Consignee (Receiver)</h3>
            <AutocompleteInput
              id="consignee_name"
              label="Consignee Name"
              value={formData.consignee_name}
              onChange={handleChange('consignee_name')}
              onSuggestionSelect={fetchConsigneeData}
              field="consignee_name"
              required
            />
            
            <AutocompleteInput
              id="consignee_gst"
              label="Consignee GST"
              value={formData.consignee_gst}
              onChange={handleChange('consignee_gst')}
              field="consignee_gst"
            />
            
            <AutocompleteInput
              id="consignee_mobile"
              label="Consignee Mobile"
              value={formData.consignee_mobile}
              onChange={handleChange('consignee_mobile')}
              field="consignee_mobile"
            />
          </div>
        </div>
      </FormSection>

      {/* Invoice Details Section */}
      <FormSection title="Invoice & Goods Details">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AutocompleteInput
            id="invoice_no"
            label="Invoice No"
            value={formData.invoice_no}
            onChange={handleChange('invoice_no')}
            field="invoice_no"
          />
          
          <div className="mb-4">
            <label htmlFor="invoice_date" className="block text-sm font-medium text-gray-700 mb-1">
              Invoice Date
            </label>
            <input
              id="invoice_date"
              type="date"
              value={formData.invoice_date}
              onChange={(e) => handleChange('invoice_date')(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="invoice_value" className="block text-sm font-medium text-gray-700 mb-1">
              Invoice Value
            </label>
            <input
              id="invoice_value"
              type="number"
              step="0.01"
              value={formData.invoice_value}
              onChange={(e) => handleChange('invoice_value')(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <AutocompleteInput
            id="eway_bill_aadhar_pan"
            label="E-way Bill/Aadhar/PAN"
            value={formData.eway_bill_aadhar_pan}
            onChange={handleChange('eway_bill_aadhar_pan')}
            field="eway_bill_aadhar_pan"
          />
          
          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Content <span className="text-red-500">*</span>
            </label>
            <input
              id="content"
              type="text"
              value={formData.content}
              onChange={(e) => handleChange('content')(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="pvt_marks" className="block text-sm font-medium text-gray-700 mb-1">
              Private Marks
            </label>
            <input
              id="pvt_marks"
              type="text"
              value={formData.pvt_marks}
              onChange={(e) => handleChange('pvt_marks')(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </FormSection>

      {/* Freight Details Section */}
      <FormSection title="Freight Details">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="mb-4">
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
              Weight (kg) <span className="text-red-500">*</span>
            </label>
            <input
              id="weight"
              type="number"
              step="0.01"
              value={formData.weight}
              onChange={(e) => handleChange('weight')(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="no_of_packages" className="block text-sm font-medium text-gray-700 mb-1">
              No. of Packages <span className="text-red-500">*</span>
            </label>
            <input
              id="no_of_packages"
              type="number"
              value={formData.no_of_packages}
              onChange={(e) => handleChange('no_of_packages')(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="rate" className="block text-sm font-medium text-gray-700 mb-1">
              Rate (per kg) <span className="text-red-500">*</span>
            </label>
            <input
              id="rate"
              type="number"
              step="0.01"
              value={formData.rate}
              onChange={(e) => handleChange('rate')(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="freight_amount" className="block text-sm font-medium text-gray-700 mb-1">
              Freight Amount <span className="text-red-500">*</span>
            </label>
            <input
              id="freight_amount"
              type="number"
              step="0.01"
              value={formData.freight_amount}
              onChange={(e) => handleChange('freight_amount')(e.target.value)}
              required
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="payment_mode" className="block text-sm font-medium text-gray-700 mb-1">
              Payment Mode <span className="text-red-500">*</span>
            </label>
            <select
              id="payment_mode"
              value={formData.payment_mode}
              onChange={(e) => handleChange('payment_mode')(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="paid">Paid</option>
              <option value="to-pay">To-Pay</option>
              <option value="free-of-cost">Free of Cost</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="delivery_type" className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Type <span className="text-red-500">*</span>
            </label>
            <select
              id="delivery_type"
              value={formData.delivery_type}
              onChange={(e) => handleChange('delivery_type')(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="door-delivery">Door Delivery</option>
              <option value="godown-delivery">Godown Delivery</option>
            </select>
          </div>
        </div>

        {/* Additional Charges */}
        <div className="mt-4">
          <h4 className="text-md font-medium text-gray-700 mb-3">Additional Charges</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="mb-4">
              <label htmlFor="labour_charge" className="block text-sm font-medium text-gray-700 mb-1">
                Labour Charge
              </label>
              <input
                id="labour_charge"
                type="number"
                step="0.01"
                // components/BiltyForm.js (continued from previous artifact)
                value={formData.labour_charge}
                onChange={(e) => handleChange('labour_charge')(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="bilty_charge" className="block text-sm font-medium text-gray-700 mb-1">
                Bilty Charge
              </label>
              <input
                id="bilty_charge"
                type="number"
                step="0.01"
                value={formData.bilty_charge}
                onChange={(e) => handleChange('bilty_charge')(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="toll_tax" className="block text-sm font-medium text-gray-700 mb-1">
                Toll Tax
              </label>
              <input
                id="toll_tax"
                type="number"
                step="0.01"
                value={formData.toll_tax}
                onChange={(e) => handleChange('toll_tax')(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="pf" className="block text-sm font-medium text-gray-700 mb-1">
                P.F.
              </label>
              <input
                id="pf"
                type="number"
                step="0.01"
                value={formData.pf}
                onChange={(e) => handleChange('pf')(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="other_charge" className="block text-sm font-medium text-gray-700 mb-1">
                Other Charge
              </label>
              <input
                id="other_charge"
                type="number"
                step="0.01"
                value={formData.other_charge}
                onChange={(e) => handleChange('other_charge')(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label htmlFor="total_amount" className="block text-sm font-medium text-gray-700 mb-1">
              Total Amount
            </label>
            <input
              id="total_amount"
              type="number"
              step="0.01"
              value={formData.total_amount}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-bold"
            />
          </div>
        </div>
      </FormSection>

      {/* Remarks Section */}
      <FormSection title="Additional Information">
        <div className="mb-4">
          <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1">
            Remarks
          </label>
          <textarea
            id="remarks"
            value={formData.remarks}
            onChange={(e) => handleChange('remarks')(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          ></textarea>
        </div>
      </FormSection>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-2 rounded-md text-white font-medium ${
            isSubmitting ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {isSubmitting ? 'Saving...' : 'Save Bilty'}
        </button>
      </div>
    </form>
  );
};

export default BiltyForm;