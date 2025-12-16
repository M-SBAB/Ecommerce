import Order from '../models/order.js';
import Product from '../models/products.js';
import User from '../models/user.js';

// Get overall dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    // Get current date for time-based calculations
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Total Revenue (all paid orders)
    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Revenue this month
    const monthRevenueResult = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'paid',
          createdAt: { $gte: startOfMonth },
        },
      },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const monthRevenue = monthRevenueResult[0]?.total || 0;

    // Revenue last month
    const lastMonthRevenueResult = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'paid',
          createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
        },
      },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const lastMonthRevenue = lastMonthRevenueResult[0]?.total || 0;

    // Calculate revenue growth percentage
    const revenueGrowth =
      lastMonthRevenue > 0
        ? (
            ((monthRevenue - lastMonthRevenue) / lastMonthRevenue) *
            100
          ).toFixed(2)
        : 0;

    // Total Orders
    const totalOrders = await Order.countDocuments();
    const monthOrders = await Order.countDocuments({
      createdAt: { $gte: startOfMonth },
    });
    const lastMonthOrders = await Order.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    });
    const ordersGrowth =
      lastMonthOrders > 0
        ? (((monthOrders - lastMonthOrders) / lastMonthOrders) * 100).toFixed(2)
        : 0;

    // Orders by status
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Total Products
    const totalProducts = await Product.countDocuments();

    // Low stock products (quantity < 10)
    const lowStockCount = await Product.countDocuments({
      quantity: { $lt: 10 },
    });

    // Out of stock products
    const outOfStockCount = await Product.countDocuments({ quantity: 0 });

    // Total inventory value
    const inventoryValueResult = await Product.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ['$price', '$quantity'] } },
        },
      },
    ]);
    const inventoryValue = inventoryValueResult[0]?.total || 0;

    // Total Users
    const totalUsers = await User.countDocuments();
    const monthUsers = await User.countDocuments({
      createdAt: { $gte: startOfMonth },
    });
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    });
    const usersGrowth =
      lastMonthUsers > 0
        ? (((monthUsers - lastMonthUsers) / lastMonthUsers) * 100).toFixed(2)
        : 0;

    // Users by role
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        revenue: {
          total: totalRevenue,
          thisMonth: monthRevenue,
          lastMonth: lastMonthRevenue,
          growth: parseFloat(revenueGrowth),
        },
        orders: {
          total: totalOrders,
          thisMonth: monthOrders,
          lastMonth: lastMonthOrders,
          growth: parseFloat(ordersGrowth),
          byStatus: ordersByStatus,
        },
        products: {
          total: totalProducts,
          lowStock: lowStockCount,
          outOfStock: outOfStockCount,
          inventoryValue: inventoryValue,
        },
        users: {
          total: totalUsers,
          thisMonth: monthUsers,
          lastMonth: lastMonthUsers,
          growth: parseFloat(usersGrowth),
          byRole: usersByRole,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      ErrorMessage: 'Failed to fetch dashboard statistics',
      error: error.message,
    });
  }
};

// Get revenue trends over time (last 12 months)
export const getRevenueTrends = async (req, res) => {
  try {
    const { months = 12 } = req.query;

    const monthsAgo = new Date();
    monthsAgo.setMonth(monthsAgo.getMonth() - parseInt(months));

    const revenueTrends = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'paid',
          createdAt: { $gte: monthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          revenue: 1,
          orders: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: revenueTrends,
    });
  } catch (error) {
    console.error('Error fetching revenue trends:', error);
    res.status(500).json({
      success: false,
      ErrorMessage: 'Failed to fetch revenue trends',
      error: error.message,
    });
  }
};

// Get order trends and distribution
export const getOrderTrends = async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days));

    // Orders by day
    const dailyOrders = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: daysAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 },
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day',
            },
          },
          count: 1,
          revenue: 1,
        },
      },
    ]);

    // Payment method distribution
    const paymentMethods = await Order.aggregate([
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' },
        },
      },
    ]);

    // Payment status distribution
    const paymentStatus = await Order.aggregate([
      {
        $group: {
          _id: '$paymentStatus',
          count: { $sum: 1 },
          amount: { $sum: '$totalAmount' },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        dailyOrders,
        paymentMethods,
        paymentStatus,
      },
    });
  } catch (error) {
    console.error('Error fetching order trends:', error);
    res.status(500).json({
      success: false,
      ErrorMessage: 'Failed to fetch order trends',
      error: error.message,
    });
  }
};

// Get top selling products
export const getTopProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          productName: { $first: '$items.productName' },
          totalQuantitySold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.subtotal' },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'productmodels',
          localField: '_id',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      {
        $project: {
          _id: 1,
          productName: 1,
          totalQuantitySold: 1,
          totalRevenue: 1,
          orderCount: 1,
          currentStock: { $arrayElemAt: ['$productDetails.quantity', 0] },
          price: { $arrayElemAt: ['$productDetails.price', 0] },
          category: { $arrayElemAt: ['$productDetails.category', 0] },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: topProducts,
    });
  } catch (error) {
    console.error('Error fetching top products:', error);
    res.status(500).json({
      success: false,
      ErrorMessage: 'Failed to fetch top products',
      error: error.message,
    });
  }
};

// Get low stock alerts
export const getLowStockAlerts = async (req, res) => {
  try {
    const { threshold = 10, limit = 20 } = req.query;

    const lowStockProducts = await Product.find({
      quantity: { $lt: parseInt(threshold) },
    })
      .sort({ quantity: 1 })
      .limit(parseInt(limit))
      .select('productName category price quantity createdAt updatedAt');

    // Calculate how many times each low stock product was ordered
    const productIds = lowStockProducts.map((p) => p._id);
    const orderFrequency = await Order.aggregate([
      { $unwind: '$items' },
      {
        $match: {
          'items.productId': { $in: productIds },
        },
      },
      {
        $group: {
          _id: '$items.productId',
          ordersCount: { $sum: 1 },
          totalSold: { $sum: '$items.quantity' },
        },
      },
    ]);

    // Merge order frequency with product data
    const frequencyMap = {};
    orderFrequency.forEach((item) => {
      frequencyMap[item._id.toString()] = {
        ordersCount: item.ordersCount,
        totalSold: item.totalSold,
      };
    });

    const enrichedProducts = lowStockProducts.map((product) => ({
      ...product.toObject(),
      ordersCount: frequencyMap[product._id.toString()]?.ordersCount || 0,
      totalSold: frequencyMap[product._id.toString()]?.totalSold || 0,
      status: product.quantity === 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK',
    }));

    res.status(200).json({
      success: true,
      data: enrichedProducts,
      count: enrichedProducts.length,
    });
  } catch (error) {
    console.error('Error fetching low stock alerts:', error);
    res.status(500).json({
      success: false,
      ErrorMessage: 'Failed to fetch low stock alerts',
      error: error.message,
    });
  }
};

// Get recent orders for dashboard
export const getRecentOrders = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('userId', 'username role')
      .select(
        'customerName totalAmount status paymentStatus paymentMethod createdAt items'
      );

    res.status(200).json({
      success: true,
      data: recentOrders,
    });
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    res.status(500).json({
      success: false,
      ErrorMessage: 'Failed to fetch recent orders',
      error: error.message,
    });
  }
};

// Get category-wise product distribution
export const getCategoryStats = async (req, res) => {
  try {
    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          productCount: { $sum: 1 },
          totalStock: { $sum: '$quantity' },
          totalValue: { $sum: { $multiply: ['$price', '$quantity'] } },
          avgPrice: { $avg: '$price' },
        },
      },
      {
        $sort: { productCount: -1 },
      },
    ]);

    // Get sales by category
    const categorySales = await Order.aggregate([
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'productmodels',
          localField: 'items.productId',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product.category',
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: '$items.subtotal' },
        },
      },
      {
        $sort: { revenue: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        inventory: categoryStats,
        sales: categorySales,
      },
    });
  } catch (error) {
    console.error('Error fetching category stats:', error);
    res.status(500).json({
      success: false,
      ErrorMessage: 'Failed to fetch category statistics',
      error: error.message,
    });
  }
};

// Get recent user registrations
export const getRecentUsers = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('username role createdAt');

    res.status(200).json({
      success: true,
      data: recentUsers,
    });
  } catch (error) {
    console.error('Error fetching recent users:', error);
    res.status(500).json({
      success: false,
      ErrorMessage: 'Failed to fetch recent users',
      error: error.message,
    });
  }
};
