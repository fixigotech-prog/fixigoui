// Sample Booking Flow Implementation

// 1. Get property types and sizes
const getPropertyOptions = async () => {
  try {
    const response = await axios.get('/api/property-types');
    return response.data;
  } catch (error) {
    console.error('Error fetching property options:', error);
  }
};

// 2. Get services for subcategory with pricing
const getServicesWithPricing = async (subcategoryId, propertySizeId) => {
  try {
    const response = await axios.get(`/api/subcategories/${subcategoryId}/sub-items`);
    const services = response.data;
    
    // Filter pricing for selected property size
    return services.map(service => ({
      ...service,
      price: service.pricing.find(p => p.property_size_id === propertySizeId)?.price || service.base_price
    }));
  } catch (error) {
    console.error('Error fetching services:', error);
  }
};

// 3. Calculate total price
const calculateTotal = async (propertySizeId, serviceItems) => {
  try {
    const response = await axios.post('/api/service-pricing/calculate', {
      property_size_id: propertySizeId,
      service_items: serviceItems
    });
    return response.data;
  } catch (error) {
    console.error('Error calculating total:', error);
  }
};

// 4. Create booking with tip
const createBooking = async (bookingData) => {
  try {
    const response = await axios.post('/api/bookings', {
      property_type_id: bookingData.propertyTypeId,
      property_size_id: bookingData.propertySizeId,
      address: bookingData.address,
      scheduled_date: bookingData.date,
      scheduled_time: bookingData.time,
      tip_amount: bookingData.tipAmount || 0,
      special_instructions: bookingData.instructions,
      service_items: bookingData.serviceItems
    });
    
    // Automatically create order
    const orderResponse = await axios.post('/api/orders', {
      booking_id: response.data.booking_id
    });
    
    return {
      booking: response.data,
      order: orderResponse.data
    };
  } catch (error) {
    console.error('Error creating booking:', error);
  }
};

// 5. Add tip after service completion
const addTip = async (orderId, professionalId, amount) => {
  try {
    const response = await axios.post('/api/tips', {
      order_id: orderId,
      professional_id: professionalId,
      amount: amount
    });
    
    // Process payment
    const paymentResponse = await axios.put(`/api/tips/${response.data.tip_id}/pay`, {
      payment_method: 'card',
      payment_reference: 'pay_' + Date.now()
    });
    
    return paymentResponse.data;
  } catch (error) {
    console.error('Error adding tip:', error);
  }
};

// Sample usage in React component
const BookingComponent = () => {
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [tipAmount, setTipAmount] = useState(0);
  
  useEffect(() => {
    loadPropertyTypes();
  }, []);
  
  const loadPropertyTypes = async () => {
    const types = await getPropertyOptions();
    setPropertyTypes(types);
  };
  
  const handleBooking = async (formData) => {
    const bookingData = {
      propertyTypeId: formData.propertyType,
      propertySizeId: formData.propertySize,
      address: formData.address,
      date: formData.date,
      time: formData.time,
      tipAmount: tipAmount,
      instructions: formData.instructions,
      serviceItems: selectedServices.map(service => ({
        service_sub_item_id: service.id,
        quantity: service.quantity
      }))
    };
    
    const result = await createBooking(bookingData);
    if (result) {
      alert(`Booking created! Order number: ${result.order.order_number}`);
    }
  };
  
  return (
    <div>
      {/* Property selection */}
      <select onChange={(e) => setPropertyType(e.target.value)}>
        {propertyTypes.map(type => (
          <option key={type.id} value={type.id}>{type.name}</option>
        ))}
      </select>
      
      {/* Service selection */}
      {/* Tip amount input */}
      <input 
        type="number" 
        placeholder="Tip amount (optional)"
        value={tipAmount}
        onChange={(e) => setTipAmount(parseFloat(e.target.value) || 0)}
      />
      
      {/* Booking form */}
    </div>
  );
};