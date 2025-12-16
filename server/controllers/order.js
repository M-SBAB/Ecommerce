import Order from '../models/order.js';
import Product from '../models/products.js';
import User from '../models/user.js';

// Place a new order
export const placeOrder = async (req, res) => {
  try {
    const {
      userId,
      customerName,
      email,
      phoneNumber,
      address,
      city,
      state,
      zipCode,
      country,
      items, // Array of {productId, quantity}
      paymentMethod,
    } = req.body;

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ ErrorMessage: 'User not found' });
    }

    // Validate and process order items
    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ ErrorMessage: 'Order must contain at least one item' });
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      // Validate product exists
      const product = await Product.findById(item.productId);
      if (!product) {
        return res
          .status(404)
          .json({ ErrorMessage: `Product not found: ${item.productId}` });
      }

      // Check if sufficient stock is available
      if (product.quantity < item.quantity) {
        return res.status(400).json({
          ErrorMessage: `Insufficient stock for ${product.productName}. Available: ${product.quantity}, Requested: ${item.quantity}`,
        });
      }

      // Calculate subtotal
      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;

      // Add to order items
      orderItems.push({
        productId: product._id,
        productName: product.productName,
        price: product.price,
        quantity: item.quantity,
        subtotal: subtotal,
      });

      // Update product stock
      product.quantity -= item.quantity;
      await product.save();
    }

    // Create new order
    const newOrder = new Order({
      userId,
      customerName,
      email,
      phoneNumber,
      address,
      city,
      state,
      zipCode,
      country,
      items: orderItems,
      totalAmount,
      paymentMethod: paymentMethod || 'cash_on_delivery',
      status: 'pending',
      paymentStatus: 'pending',
    });

    await newOrder.save();

    res.status(201).json({
      message: 'Order placed successfully!',
      order: newOrder,
    });
  } catch (error) {
    res.status(500).json({ ErrorMessage: error.message });
  }
};

// Get all orders for a specific user
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId })
      .populate('items.productId', 'productName category')
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ ErrorMessage: error.message });
  }
};

// Get all orders (admin only)
export const getAllOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = '',
      startDate = '',
      endDate = '',
    } = req.query;

    // Build query
    const query = {};

    // Status filter
    if (status && status !== 'All') {
      query.status = status;
    }

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        query.createdAt.$lte = endDateTime;
      }
    }

    // Search filter (order ID, customer name, product name)
    if (search) {
      const orders = await Order.find(query)
        .populate('userId', 'username email')
        .populate('items.productId', 'productName category');

      const filteredOrders = orders.filter((order) => {
        const searchLower = search.toLowerCase();
        const matchesId = order._id
          .toString()
          .toLowerCase()
          .includes(searchLower);
        const matchesCustomer = order.customerName
          ?.toLowerCase()
          .includes(searchLower);
        const matchesProduct = order.items.some((item) =>
          item.productName?.toLowerCase().includes(searchLower)
        );
        return matchesId || matchesCustomer || matchesProduct;
      });

      // Pagination after filtering
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;
      const paginatedOrders = filteredOrders
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(startIndex, endIndex);

      return res.status(200).json({
        orders: paginatedOrders,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(filteredOrders.length / limitNum),
          totalOrders: filteredOrders.length,
          ordersPerPage: limitNum,
        },
      });
    }

    // Count total documents
    const total = await Order.countDocuments(query);

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const orders = await Order.find(query)
      .populate('userId', 'username email')
      .populate('items.productId', 'productName category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      orders,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalOrders: total,
        ordersPerPage: limitNum,
      },
    });
  } catch (error) {
    res.status(500).json({ ErrorMessage: error.message });
  }
};

// Get single order by ID
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate('userId', 'username email')
      .populate('items.productId', 'productName category description');

    if (!order) {
      return res.status(404).json({ ErrorMessage: 'Order not found' });
    }

    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ ErrorMessage: error.message });
  }
};

// Update order status (admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = [
      'pending',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ ErrorMessage: 'Invalid order status' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ ErrorMessage: 'Order not found' });
    }

    // If order is being cancelled, restore product stock
    if (status === 'cancelled' && order.status !== 'cancelled') {
      for (const item of order.items) {
        const product = await Product.findById(item.productId);
        if (product) {
          product.quantity += item.quantity;
          await product.save();
        }
      }
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      message: 'Order status updated successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({ ErrorMessage: error.message });
  }
};

// Cancel order (user can cancel their own orders)
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { userId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ ErrorMessage: 'Order not found' });
    }

    // Check if user owns the order
    if (order.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ ErrorMessage: 'Unauthorized to cancel this order' });
    }

    // Only allow cancellation if order is pending or processing
    if (!['pending', 'processing'].includes(order.status)) {
      return res.status(400).json({
        ErrorMessage: `Cannot cancel order with status: ${order.status}`,
      });
    }

    // Restore product stock
    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.quantity += item.quantity;
        await product.save();
      }
    }

    order.status = 'cancelled';
    await order.save();

    res.status(200).json({
      message: 'Order cancelled successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({ ErrorMessage: error.message });
  }
};

// Update payment status (admin only)
export const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentStatus } = req.body;

    const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded'];
    if (!validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({ ErrorMessage: 'Invalid payment status' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ ErrorMessage: 'Order not found' });
    }

    order.paymentStatus = paymentStatus;
    await order.save();

    res.status(200).json({
      message: 'Payment status updated successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({ ErrorMessage: error.message });
  }
};
