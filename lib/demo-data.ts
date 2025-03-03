export const demoProducts = [
    {
      _id: "prod1",
      merchantDetail: {
        merchantId: "merch1",
        merchantName: "Tech Store",
        merchantEmail: "tech@store.com",
      },
      productName: "Premium Wireless Headphones",
      category: {
        categoryId: "cat1",
        categoryName: "Electronics",
      },
      price: 299.99,
      quantity: 50,
      soldQuantity: 25,
      description: "High-quality wireless headphones with noise cancellation...",
      images: [
        "https://firebasestorage.googleapis.com/v0/b/food-ordering-app-36d12.appspot.com/o/images%2Fchicken1.jpg?alt=media&token=a622973b-445f-4b70-ad29-dd5ffb9edb1a",
        "https://firebasestorage.googleapis.com/v0/b/food-ordering-app-36d12.appspot.com/o/images%2Fchicken.png?alt=media&token=a031e626-baf1-49a0-9c39-fd384f2c39ae",
        "/placeholder.svg?height=600&width=600",
      ],
      variant: ["Black", "Silver", "Rose Gold"],
      size: ["Regular"],
      brand: "SoundMax",
      location: {
        type: "Point",
        coordinates: [38.75, 9.0333],
      },
      review: [
        {
          customerId: "cust1",
          comment: "Great sound quality!",
          rating: 5,
          createdDate: new Date(),
        },
        {
          customerId: "cust2",
          comment: "Good but expensive",
          rating: 4,
          createdDate: new Date(),
        },
      ],
      delivery: "FLAT",
      deliveryPrice: 10,
      isBanned: false,
      isDeleted: false,
    },
    // Add more demo products...
  ]
  
  export const demoCategories = [
    {
      _id: "cat1",
      name: "Electronics",
      description: "Electronic devices and accessories",
      createdBy: "admin1",
    },
    {
      _id: "cat2",
      name: "Fashion",
      description: "Clothing and accessories",
      createdBy: "admin1",
    },
    // Add more categories...
  ]
  
  export const demoOrders = [
    {
      _id: "order1",
      customerDetail: {
        customerId: "cust1",
        customerName: "John Doe",
        phoneNumber: "+1234567890",
        customerEmail: "john@example.com",
        address: {
          state: "Addis Ababa",
          city: "Bole",
        },
      },
      merchantDetail: {
        merchantId: "merch1",
        merchantName: "Tech Store",
        merchantEmail: "tech@store.com",
        phoneNumber: "+1234567890",
        account_name: "Tech Store Inc",
        account_number: "1234567890",
        bank_code: "001",
      },
      products: [
        {
          productId: "prod1",
          productName: "Premium Wireless Headphones",
          quantity: 1,
          price: 299.99,
          delivery: "FLAT",
          deliveryPrice: 10,
        },
      ],
      totalPrice: 309.99,
      status: "Pending",
      paymentStatus: "Paid",
      location: {
        type: "Point",
        coordinates: [38.75, 9.0333],
      },
      transactionRef: "TR123456",
      orderDate: new Date(),
    },
    // Add more orders...
  ]
  
  export const demoUsers = [
    {
      _id: "user1",
      fullName: "John Doe",
      email: "john@example.com",
      role: "customer",
      image: "/placeholder.svg",
      phoneNumber: "+1234567890",
      stateName: "Addis Ababa",
      cityName: "Bole",
    },
    {
      _id: "merch1",
      fullName: "Tech Store",
      email: "tech@store.com",
      role: "merchant",
      image: "/placeholder.svg",
      isMerchant: true,
      tinNumber: "0123456789",
      nationalId: "ID123456",
      phoneNumber: "+1234567890",
      stateName: "Addis Ababa",
      cityName: "Bole",
      account_name: "Tech Store Inc",
      account_number: "1234567890",
      bank_code: "001",
    },
    // Add more users...
  ]
  
  