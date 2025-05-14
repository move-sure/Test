// utils/datafetch.js (Updated with bilty list methods)
import supabase from '../app/utils/supabase';

/**
 * Fetches the latest entry from the transport_bilty table based on a specific field and value
 * @param {string} field - The field to search by (e.g., 'city_code', 'consignor_name')
 * @param {string} value - The value to search for
 * @param {Array} selectFields - Fields to select from the database
 * @returns {Promise<Object|null>} - The latest entry or null if not found
 */
export const getLatestEntryByField = async (field, value, selectFields = ['*']) => {
  if (!value || value.trim() === '') return null;

  try {
    const { data, error } = await supabase
      .from('transport_bilty')
      .select(selectFields.join(','))
      .eq(field, value)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error fetching latest entry:', error);
      return null;
    }

    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Exception in getLatestEntryByField:', error);
    return null;
  }
};

/**
 * Fetches the most recent bilty record with all fields
 * @returns {Promise<Object|null>} - The most recent bilty or null if not found
 */
export const getMostRecentBilty = async () => {
  try {
    const { data, error } = await supabase
      .from('transport_bilty')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error fetching most recent bilty:', error);
      return null;
    }

    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Exception in getMostRecentBilty:', error);
    return null;
  }
};

/**
 * Fetches suggestions for a given field based on partial input
 * @param {string} field - The field to search by (e.g., 'city_code', 'consignor_name')
 * @param {string} partialValue - The partial value to search for
 * @param {number} limit - Maximum number of suggestions to return
 * @returns {Promise<Array>} - Array of unique values that match the partial input
 */
export const getSuggestions = async (field, partialValue, limit = 5) => {
  if (!partialValue || partialValue.trim() === '') return [];

  try {
    // Use ilike for case-insensitive partial matching
    const { data, error } = await supabase
      .from('transport_bilty')
      .select(`${field}`)
      .ilike(field, `${partialValue}%`)
      .order(field, { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Error fetching suggestions:', error);
      return [];
    }

    // Extract unique values to avoid duplicates
    const uniqueValues = [...new Set(data.map(item => item[field]))];
    return uniqueValues;
  } catch (error) {
    console.error('Exception in getSuggestions:', error);
    return [];
  }
};

/**
 * Submits the complete bilty form data to Supabase
 * @param {Object} formData - The complete form data to be submitted
 * @returns {Promise<{success: boolean, data?: Object, error?: Object}>}
 */
export const submitBiltyForm = async (formData) => {
  try {
    // Calculate the total amount before submitting
    const freightAmount = parseFloat(formData.freight_amount) || 0;
    const labourCharge = parseFloat(formData.labour_charge) || 0;
    const biltyCharge = parseFloat(formData.bilty_charge) || 0;
    const tollTax = parseFloat(formData.toll_tax) || 0;
    const pf = parseFloat(formData.pf) || 0;
    const otherCharge = parseFloat(formData.other_charge) || 0;
    
    const totalAmount = freightAmount + labourCharge + biltyCharge + tollTax + pf + otherCharge;
    
    const biltyData = {
      ...formData,
      total_amount: totalAmount,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('transport_bilty')
      .insert([biltyData])
      .select();

    if (error) {
      console.error('Error submitting bilty form:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception in submitBiltyForm:', error);
    return { success: false, error };
  }
};

/**
 * Fetches a list of bilty records with pagination
 * @param {number} page - Page number (1-based)
 * @param {number} pageSize - Number of records per page
 * @param {string} sortField - Field to sort by
 * @param {boolean} ascending - Sort direction
 * @param {string} searchTerm - Optional search term
 * @returns {Promise<{data: Array, count: number, error?: Object}>}
 */
export const getBiltyList = async (
  page = 1, 
  pageSize = 10, 
  sortField = 'created_at', 
  ascending = false,
  searchTerm = ''
) => {
  try {
    // Calculate pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Start building the query
    let query = supabase
      .from('transport_bilty')
      .select('id, gr_no, bilty_date, city, transport_name, consignor_name, consignee_name, content, weight, total_amount, payment_mode', { count: 'exact' });

    // Add search if provided
    if (searchTerm) {
      query = query.or(
        `gr_no.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,transport_name.ilike.%${searchTerm}%,` +
        `consignor_name.ilike.%${searchTerm}%,consignee_name.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`
      );
    }

    // Apply sorting and pagination
    const { data, count, error } = await query
      .order(sortField, { ascending })
      .range(from, to);

    if (error) {
      console.error('Error fetching bilty list:', error);
      return { data: [], count: 0, error };
    }

    return { data: data || [], count: count || 0 };
  } catch (error) {
    console.error('Exception in getBiltyList:', error);
    return { data: [], count: 0, error };
  }
};

/**
 * Deletes a bilty record by ID
 * @param {string} id - The UUID of the bilty to delete
 * @returns {Promise<{success: boolean, error?: Object}>}
 */
export const deleteBilty = async (id) => {
  try {
    const { error } = await supabase
      .from('transport_bilty')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting bilty:', error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error('Exception in deleteBilty:', error);
    return { success: false, error };
  }
};

/**
 * Fetches a single bilty record by ID
 * @param {string} id - The UUID of the bilty to fetch
 * @returns {Promise<{data?: Object, error?: Object}>}
 */
export const getBiltyById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('transport_bilty')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching bilty by ID:', error);
      return { error };
    }

    return { data };
  } catch (error) {
    console.error('Exception in getBiltyById:', error);
    return { error };
  }
};