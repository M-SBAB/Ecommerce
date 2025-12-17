import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../Components/StatCard';
import RevenueChart from '../../Components/RevenueChart';
import OrderStatusChart from '../../Components/OrderStatusChart';
import RecentOrdersTable from '../../Components/RecentOrdersTable';
import LowStockAlert from '../../Components/LowStockAlert';
import TopProductsList from '../../Components/TopProductsList';
import DateRangePicker from '../../Components/DateRangePicker';
import FilterDropdown from '../../Components/FilterDropdown';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  RefreshCw,
  AlertCircle,
  Loader2,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  PackageCheck,
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:6001';

// Loading Skeleton Components
const StatCardSkeleton = () => (
  <div className='bg-white rounded-xl p-6 border border-gray-200 shadow-sm animate-pulse'>
    <div className='flex items-start justify-between'>
      <div className='flex-1'>
        <div className='h-4 bg-gray-200 rounded w-24 mb-3'></div>
        <div className='h-8 bg-gray-200 rounded w-32 mb-2'></div>
        <div className='h-3 bg-gray-200 rounded w-20'></div>
      </div>
      <div className='w-12 h-12 bg-gray-200 rounded'></div>
    </div>
  </div>
);

const ChartSkeleton = () => (
  <div className='bg-white rounded-xl p-6 border border-gray-200 shadow-sm animate-pulse'>
    <div className='h-6 bg-gray-200 rounded w-48 mb-6'></div>
    <div className='space-y-3'>
      <div className='h-4 bg-gray-200 rounded w-full'></div>
      <div className='h-4 bg-gray-200 rounded w-5/6'></div>
      <div className='h-4 bg-gray-200 rounded w-4/6'></div>
      <div className='h-32 bg-gray-200 rounded w-full mt-4'></div>
    </div>
  </div>
);

const TableSkeleton = () => (
  <div className='bg-white rounded-xl p-6 border border-gray-200 shadow-sm animate-pulse'>
    <div className='h-6 bg-gray-200 rounded w-40 mb-6'></div>
    <div className='space-y-4'>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className='flex items-center gap-4'>
          <div className='h-4 bg-gray-200 rounded w-20'></div>
          <div className='h-4 bg-gray-200 rounded w-32'></div>
          <div className='h-4 bg-gray-200 rounded w-24'></div>
          <div className='h-4 bg-gray-200 rounded w-16'></div>
        </div>
      ))}
    </div>
  </div>
);

const ListSkeleton = () => (
  <div className='bg-white rounded-xl p-6 border border-gray-200 shadow-sm animate-pulse'>
    <div className='h-6 bg-gray-200 rounded w-32 mb-4'></div>
    <div className='space-y-3'>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className='flex items-center gap-3 bg-gray-50 rounded'
        >
          <div className='w-10 h-10 bg-gray-200 rounded'></div>
          <div className='flex-1'>
            <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
            <div className='h-3 bg-gray-200 rounded w-1/2'></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Dashboard Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='flex items-center justify-center min-h-screen p-4'>
          <div className='text-center max-w-md'>
            <AlertCircle className='w-16 h-16 text-red-500 mx-auto mb-4' />
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>
              Something went wrong
            </h2>
            <p className='text-gray-600 mb-6'>
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className='px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors'
            >
              Reload Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const Stats = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Dashboard data state
  const [dashboardStats, setDashboardStats] = useState(null);
  const [revenueTrends, setRevenueTrends] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  // Filter state
  const [filters, setFilters] = useState({
    dateRange: {
      startDate: null,
      endDate: null,
    },
    orderStatus: '',
    timePeriod: 6,
  });

  // Build query params with filters
  const buildQueryParams = (baseParams = {}) => {
    console.log('Building query params with user:', user);
    if (!user || !user._id) {
      console.error('User or user._id is undefined!', user);
      throw new Error('User not authenticated');
    }
    const params = new URLSearchParams({
      userId: user._id,
      ...baseParams,
    });

    // Add date range filters if present
    if (filters.dateRange.startDate) {
      params.append('startDate', filters.dateRange.startDate);
    }
    if (filters.dateRange.endDate) {
      params.append('endDate', filters.dateRange.endDate);
    }

    // Add order status filter
    if (filters.orderStatus) {
      params.append('status', filters.orderStatus);
    }

    return params.toString();
  };

  // Fetch all dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setError(null);

      // Fetch main dashboard stats with filters
      const statsRes = await fetch(
        `${API_BASE_URL}/dashboard/stats?${buildQueryParams()}`
      );
      const statsData = await statsRes.json();

      if (!statsData.success) {
        throw new Error(
          statsData.ErrorMessage || 'Failed to fetch dashboard stats'
        );
      }

      setDashboardStats(statsData.data);

      // Fetch revenue trends with time period filter
      const revenueRes = await fetch(
        `${API_BASE_URL}/dashboard/revenue-trends?${buildQueryParams({
          months: filters.timePeriod,
        })}`
      );
      const revenueData = await revenueRes.json();

      if (revenueData.success) {
        setRevenueTrends(revenueData.data);
      }

      // Fetch top products with filters
      const topProductsRes = await fetch(
        `${API_BASE_URL}/dashboard/top-products?${buildQueryParams({
          limit: 5,
        })}`
      );
      const topProductsData = await topProductsRes.json();

      if (topProductsData.success) {
        setTopProducts(topProductsData.data);
      }

      // Fetch low stock alerts
      const lowStockRes = await fetch(
        `${API_BASE_URL}/dashboard/low-stock?${buildQueryParams({
          threshold: 10,
          limit: 10,
        })}`
      );
      const lowStockData = await lowStockRes.json();

      if (lowStockData.success) {
        setLowStockProducts(lowStockData.data);
      }

      // Fetch recent orders with filters
      const recentOrdersRes = await fetch(
        `${API_BASE_URL}/dashboard/recent-orders?${buildQueryParams({
          limit: 10,
        })}`
      );
      const recentOrdersData = await recentOrdersRes.json();

      if (recentOrdersData.success) {
        setRecentOrders(recentOrdersData.data);
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, filters]);

  // Order status filter options
  const orderStatusOptions = [
    { value: '', label: 'All Orders' },
    { value: 'pending', label: 'Pending', icon: Clock },
    { value: 'processing', label: 'Processing', icon: Package },
    { value: 'shipped', label: 'Shipped', icon: Truck },
    { value: 'delivered', label: 'Delivered', icon: PackageCheck },
    { value: 'cancelled', label: 'Cancelled', icon: XCircle },
  ];

  // Time period options for revenue chart
  const timePeriodOptions = [
    { value: 3, label: '3 Months' },
    { value: 6, label: '6 Months' },
    { value: 12, label: '12 Months' },
  ];

  // Initial data fetch
  useEffect(() => {
    if (user?._id) {
      fetchDashboardData();
    }
  }, [user, fetchDashboardData]);

  // Refetch when filters change
  useEffect(() => {
    if (user?._id && !loading) {
      setRefreshing(true);
      fetchDashboardData();
    }
  }, [filters, user?._id, loading, fetchDashboardData]);

  // Handle manual refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  // Filter handlers
  const handleDateRangeChange = (dateRange) => {
    setFilters((prev) => ({ ...prev, dateRange }));
  };

  const handleDateRangeClear = () => {
    setFilters((prev) => ({
      ...prev,
      dateRange: { startDate: null, endDate: null },
    }));
  };

  const handleOrderStatusChange = (status) => {
    setFilters((prev) => ({ ...prev, orderStatus: status }));
  };

  const handleOrderStatusClear = () => {
    setFilters((prev) => ({ ...prev, orderStatus: '' }));
  };

  const handleTimePeriodChange = (period) => {
    setFilters((prev) => ({ ...prev, timePeriod: period }));
  };

  const handleTimePeriodClear = () => {
    setFilters((prev) => ({ ...prev, timePeriod: 6 }));
  };

  const handleClearAllFilters = () => {
    setFilters({
      dateRange: { startDate: null, endDate: null },
      orderStatus: '',
      timePeriod: 6,
    });
  };

  // Navigation handlers
  const handleNavigateToOrders = () => {
    navigate('/manage-order');
  };

  const handleNavigateToProducts = () => {
    navigate('/list-products');
  };

  const handleNavigateToLowStock = () => {
    navigate('/stock-management');
  };

  const handleViewOrder = (orderId) => {
    navigate(`/manage-order?orderId=${orderId}`);
  };

  const handleViewProduct = (productId) => {
    navigate(`/list-products?productId=${productId}`);
  };

  // Check if any filters are active
  const hasActiveFilters =
    filters.dateRange.startDate ||
    filters.dateRange.endDate ||
    filters.orderStatus ||
    filters.timePeriod !== 6;

  // Loading state with skeletons
  if (loading && !dashboardStats) {
    return (
      <div className='p-4 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6'>
        {/* Header Skeleton */}
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <div className='w-full sm:w-auto'>
            <div className='h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse'></div>
            <div className='h-4 bg-gray-200 rounded w-64 animate-pulse'></div>
          </div>
        </div>

        {/* Filters Skeleton */}
        <div className='bg-white border border-gray-200 rounded p-4 animate-pulse'>
          <div className='flex flex-wrap gap-3'>
            <div className='h-10 bg-gray-200 rounded w-32'></div>
            <div className='h-10 bg-gray-200 rounded w-40'></div>
            <div className='h-10 bg-gray-200 rounded w-36'></div>
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'>
          {[1, 2, 3, 4].map((i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>

        {/* Secondary Stats Skeleton */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'>
          {[1, 2, 3, 4].map((i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6'>
          <ChartSkeleton />
          <ChartSkeleton />
        </div>

        {/* Tables Skeleton */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6'>
          <div className='lg:col-span-2'>
            <TableSkeleton />
          </div>
          <div className='space-y-4 sm:space-y-6'>
            <ListSkeleton />
            <ListSkeleton />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !dashboardStats) {
    return (
      <div className='flex items-center justify-center min-h-screen p-4'>
        <div className='text-center max-w-md w-full'>
          <AlertCircle className='w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto' />
          <h2 className='text-xl sm:text-2xl font-bold text-gray-900 mt-4'>
            Error Loading Dashboard
          </h2>
          <p className='text-sm sm:text-base text-gray-600 mt-2'>{error}</p>
          <button
            onClick={fetchDashboardData}
            className='mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors w-full sm:w-auto'
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className='p-4 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <div className='w-full sm:w-auto'>
            <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>
              Dashboard
            </h1>
            <p className='text-sm sm:text-base text-gray-600 mt-1'>
              Overview of your e-commerce platform
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className='flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm w-full sm:w-auto justify-center'
          >
            <RefreshCw
              className={'w-4 h-4' + (refreshing ? ' animate-spin' : '')}
            />
            <span className='sm:inline'>
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </span>
          </button>
        </div>

        {/* Filters Bar */}
        <div className='bg-white border border-gray-200 rounded p-3 sm:p-4 shadow-sm'>
          <div className='flex flex-wrap items-center gap-2 sm:gap-3'>
            <div className='flex items-center gap-2 text-gray-700 font-medium'>
              <Filter className='w-4 h-4 sm:w-5 sm:h-5' />
              <span className='text-sm sm:text-base'>Filters:</span>
            </div>

            {/* Date Range Picker */}
            <DateRangePicker
              startDate={filters.dateRange.startDate}
              endDate={filters.dateRange.endDate}
              onChange={handleDateRangeChange}
              onClear={handleDateRangeClear}
            />

            {/* Order Status Filter */}
            <FilterDropdown
              label='Order Status'
              value={filters.orderStatus}
              options={orderStatusOptions}
              onChange={handleOrderStatusChange}
              onClear={handleOrderStatusClear}
            />

            {/* Time Period Filter */}
            <FilterDropdown
              label='Revenue Period'
              value={filters.timePeriod}
              options={timePeriodOptions}
              onChange={handleTimePeriodChange}
              onClear={handleTimePeriodClear}
            />

            {/* Clear All Filters */}
            {hasActiveFilters && (
              <button
                onClick={handleClearAllFilters}
                className='sm:ml-auto px-3 py-1.5 text-xs sm:text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors w-full sm:w-auto'
              >
                Clear All
              </button>
            )}
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className='mt-3 pt-3 border-t border-gray-200'>
              <p className='text-sm text-gray-600 flex items-center gap-2'>
                <span className='font-medium'>Active filters:</span>
                {filters.dateRange.startDate && (
                  <span className='px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs'>
                    Date Range
                  </span>
                )}
                {filters.orderStatus && (
                  <span className='px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs'>
                    {
                      orderStatusOptions.find(
                        (opt) => opt.value === filters.orderStatus
                      )?.label
                    }
                  </span>
                )}
                {filters.timePeriod !== 6 && (
                  <span className='px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs'>
                    {
                      timePeriodOptions.find(
                        (opt) => opt.value === filters.timePeriod
                      )?.label
                    }
                  </span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Primary Stats Cards */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'>
          <StatCard
            title='Total Revenue'
            value={dashboardStats?.revenue?.thisMonth || 0}
            growth={dashboardStats?.revenue?.growth || 0}
            icon={DollarSign}
            color='primary'
            prefix={'$'}
            onClick={handleNavigateToOrders}
          />
          <StatCard
            title='Total Orders'
            value={dashboardStats?.orders?.total || 0}
            growth={dashboardStats?.orders?.growth || 0}
            icon={ShoppingBag}
            color='success'
            onClick={handleNavigateToOrders}
          />
          <StatCard
            title='Total Products'
            value={dashboardStats?.products?.total || 0}
            growth={dashboardStats?.products?.growth || 0}
            icon={Package}
            color='warning'
            onClick={handleNavigateToProducts}
          />
          <StatCard
            title='Total Users'
            value={dashboardStats?.users?.total || 0}
            growth={dashboardStats?.users?.growth || 0}
            icon={Users}
            color='purple'
          />
        </div>

        {/* Secondary Stats Cards */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'>
          <StatCard
            title='Pending Orders'
            value={dashboardStats?.orders?.pending || 0}
            icon={Clock}
            color='warning'
            onClick={handleNavigateToOrders}
          />
          <StatCard
            title='Completed Orders'
            value={dashboardStats?.orders?.completed || 0}
            icon={CheckCircle}
            color='success'
            onClick={handleNavigateToOrders}
          />
          <StatCard
            title='Low Stock Items'
            value={dashboardStats?.products?.lowStock || 0}
            icon={AlertCircle}
            color='error'
            onClick={handleNavigateToLowStock}
          />
          <StatCard
            title='Inventory Value'
            value={dashboardStats?.products?.totalValue || 0}
            icon={Package}
            color='indigo'
            prefix={'$'}
            onClick={handleNavigateToProducts}
          />
        </div>

        {/* Charts Section */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6'>
          {/* Revenue Chart */}
          <RevenueChart
            data={revenueTrends}
            title={
              'Revenue Trends (' +
              (timePeriodOptions.find((opt) => opt.value === filters.timePeriod)
                ?.label || '6 Months') +
              ')'
            }
            chartType='area'
          />

          {/* Order Status Chart */}
          <OrderStatusChart
            data={dashboardStats?.orders?.statusDistribution || []}
            title='Order Status Distribution'
            chartType='pie'
          />
        </div>

        {/* Recent Activity Section */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6'>
          {/* Recent Orders - Takes 2 columns */}
          <div className='lg:col-span-2'>
            <RecentOrdersTable
              orders={recentOrders}
              onViewOrder={handleViewOrder}
            />
          </div>

          {/* Side Column - Low Stock + Top Products */}
          <div className='space-y-4 sm:space-y-6'>
            {/* Low Stock Alerts */}
            <LowStockAlert
              products={lowStockProducts}
              onViewProduct={handleViewProduct}
            />

            {/* Top Products */}
            <TopProductsList
              products={topProducts}
              onViewProduct={handleViewProduct}
            />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Stats;
