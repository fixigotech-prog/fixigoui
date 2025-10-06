# Enhanced Services API Endpoints

## Property Types & Sizes

### GET /api/property-types
Get all property types
```json
Response: [
  {
    "id": 1,
    "name": "apartment",
    "sizes": [
      {"id": 1, "name": "1BHK", "size_range": "300-500 sqft", "base_multiplier": 1.0},
      {"id": 2, "name": "2BHK", "size_range": "500-800 sqft", "base_multiplier": 1.5}
    ]
  }
]
```

### GET /api/property-types/:id/sizes
Get sizes for specific property type
```json
Response: [
  {"id": 1, "name": "1BHK", "size_range": "300-500 sqft", "base_multiplier": 1.0}
]
```

## Service Sub-items

### GET /api/subcategories/:id/sub-items
Get sub-items for a subcategory
```json
Response: [
  {
    "id": 1,
    "name": "Deep Kitchen Cleaning",
    "description": "Complete kitchen deep cleaning",
    "base_price": 500.00,
    "duration_minutes": 120,
    "pricing": [
      {"property_size_id": 1, "size_name": "1BHK", "price": 500.00},
      {"property_size_id": 2, "size_name": "2BHK", "price": 750.00}
    ]
  }
]
```

### POST /api/service-sub-items
Create service sub-item
```json
Request: {
  "subcategory_id": 1,
  "name": "Deep Kitchen Cleaning",
  "description": "Complete kitchen deep cleaning",
  "base_price": 500.00,
  "duration_minutes": 120
}
```

### PUT /api/service-sub-items/:id
Update service sub-item

### DELETE /api/service-sub-items/:id
Delete service sub-item

## Service Pricing

### POST /api/service-pricing
Set pricing for service based on property size
```json
Request: {
  "service_sub_item_id": 1,
  "property_size_id": 1,
  "price": 500.00
}
```

### GET /api/service-pricing/calculate
Calculate total price for services
```json
Request: {
  "property_size_id": 1,
  "service_items": [
    {"service_sub_item_id": 1, "quantity": 1},
    {"service_sub_item_id": 2, "quantity": 2}
  ]
}
Response: {
  "subtotal": 1500.00,
  "items": [
    {"service_sub_item_id": 1, "unit_price": 500.00, "total": 500.00},
    {"service_sub_item_id": 2, "unit_price": 500.00, "total": 1000.00}
  ]
}
```

## Bookings with Enhanced Features

### POST /api/bookings
Create booking with property details and tip
```json
Request: {
  "property_type_id": 1,
  "property_size_id": 2,
  "address": "123 Main St, City",
  "scheduled_date": "2024-01-15",
  "scheduled_time": "10:00:00",
  "tip_amount": 50.00,
  "special_instructions": "Please call before arriving",
  "service_items": [
    {"service_sub_item_id": 1, "quantity": 1},
    {"service_sub_item_id": 2, "quantity": 1}
  ]
}
Response: {
  "booking_id": 123,
  "total_amount": 1250.00,
  "tip_amount": 50.00,
  "order_number": "ORD-2024-001"
}
```

### GET /api/bookings/:id
Get booking details with items
```json
Response: {
  "id": 123,
  "property_type": "apartment",
  "property_size": "2BHK",
  "address": "123 Main St",
  "scheduled_date": "2024-01-15",
  "scheduled_time": "10:00:00",
  "total_amount": 1250.00,
  "tip_amount": 50.00,
  "status": "confirmed",
  "items": [
    {
      "service_name": "Deep Kitchen Cleaning",
      "quantity": 1,
      "unit_price": 750.00,
      "total_price": 750.00
    }
  ]
}
```

### PUT /api/bookings/:id
Update booking

### DELETE /api/bookings/:id
Cancel booking

## Orders Management

### POST /api/orders
Create order from booking
```json
Request: {
  "booking_id": 123
}
Response: {
  "order_id": 456,
  "order_number": "ORD-2024-001",
  "status": "created"
}
```

### GET /api/orders
Get all orders (with filters)
```json
Query params: ?status=pending&professional_id=123&date=2024-01-15
Response: [
  {
    "id": 456,
    "order_number": "ORD-2024-001",
    "booking": {
      "property_type": "apartment",
      "property_size": "2BHK",
      "address": "123 Main St"
    },
    "status": "assigned",
    "professional": {
      "id": 789,
      "name": "John Doe"
    },
    "total_amount": 1250.00,
    "tip_amount": 50.00
  }
]
```

### GET /api/orders/:id
Get order details

### PUT /api/orders/:id/assign
Assign professional to order
```json
Request: {
  "professional_id": 789
}
```

### PUT /api/orders/:id/status
Update order status
```json
Request: {
  "status": "in_progress",
  "started_at": "2024-01-15T10:00:00Z"
}
```

### PUT /api/orders/:id/complete
Complete order
```json
Request: {
  "completed_at": "2024-01-15T14:00:00Z",
  "completion_notes": "Work completed successfully"
}
```

## Tips Management

### POST /api/tips
Add tip for professional
```json
Request: {
  "order_id": 456,
  "professional_id": 789,
  "amount": 100.00
}
Response: {
  "tip_id": 101,
  "payment_status": "pending"
}
```

### GET /api/tips
Get tips (for professionals/customers)
```json
Query params: ?professional_id=789&customer_id=123&order_id=456
Response: [
  {
    "id": 101,
    "order_number": "ORD-2024-001",
    "amount": 100.00,
    "payment_status": "paid",
    "created_at": "2024-01-15T15:00:00Z"
  }
]
```

### PUT /api/tips/:id/pay
Process tip payment
```json
Request: {
  "payment_method": "card",
  "payment_reference": "pay_123456"
}
```

## Dashboard APIs

### GET /api/dashboard/customer
Customer dashboard data
```json
Response: {
  "active_bookings": 2,
  "completed_orders": 15,
  "total_spent": 12500.00,
  "recent_bookings": [...],
  "favorite_services": [...]
}
```

### GET /api/dashboard/professional
Professional dashboard data
```json
Response: {
  "pending_orders": 3,
  "completed_today": 2,
  "earnings_today": 1500.00,
  "tips_received": 250.00,
  "upcoming_orders": [...],
  "performance_stats": {...}
}
```

### GET /api/dashboard/admin
Admin dashboard data
```json
Response: {
  "total_orders": 1250,
  "revenue_today": 25000.00,
  "active_professionals": 45,
  "pending_orders": 23,
  "recent_orders": [...],
  "revenue_chart": {...}
}
```

## Search & Filters

### GET /api/services/search
Search services with filters
```json
Query params: ?category=cleaning&property_type=apartment&property_size=2&location=city
Response: {
  "services": [...],
  "total_count": 25,
  "filters": {
    "categories": [...],
    "property_types": [...],
    "price_ranges": [...]
  }
}
```