// This file contains dummy data matching the API shape.
// Replace each export with an API call (e.g. from a service file) when backend is ready.

export const stationData = {
    name: 'Bharat Petroleum Fuel Station',
    icon: 'fuel', // controls which icon renders in StationDetailCard
    address: '603AB Road, Kondapur, Hyderabad-500032, Telangana, India',
    status: 'Active', // 'Active' | 'Deactive'
    outletId: 'P102402',
    manager: 'Ravi Kumar',
    contact: '+91 0254 457 624',
};

export const sidebarData = {
    logo: { text: 'Here&\nSave', color: '#DC0004' },
    stationLabel: 'BP Fuel Station',
    stationAddress: '603AB Road, Kondapur,\nHyderabad-500032, Telangana, India',
    navItems: [
        { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', path: '/dashboard' },
        { id: 'coupons', label: 'Coupons', icon: 'Ticket', path: '/coupons' },
        { id: 'staff', label: 'Staff members', icon: 'Users', path: '/staff' },
    ],
};

export const statsData = [
    {
        id: 'coupons_active',
        label: 'Coupons Active',
        value: '26',
        badge: { text: 'Active', type: 'active' },
    },
    {
        id: 'redemptions',
        label: 'Redemptions',
        value: '526',
        badge: { text: '6.8%', type: 'down' },
    },
    {
        id: 'discounts',
        label: 'Discounts',
        value: '3,865',
        badge: { text: '6.8%', type: 'up' },
    },
    {
        id: 'total_sale',
        label: 'Total Sale',
        value: '4,60,859',
        badge: { text: '6.8%', type: 'up' },
    },
];

export const chartData = [
    { month: 'Jan', redemptions: 8000, discounts: 4000, totalSales: 14000 },
    { month: 'Feb', redemptions: 15000, discounts: 7000, totalSales: 19000 },
    { month: 'Mar', redemptions: 12000, discounts: 10000, totalSales: 22000 },
    { month: 'Apr', redemptions: 18000, discounts: 8000, totalSales: 26000 },
    { month: 'May', redemptions: 14000, discounts: 12000, totalSales: 24000 },
    { month: 'Jun', redemptions: 22000, discounts: 9000, totalSales: 28000 },
    { month: 'Jul', redemptions: 20000, discounts: 11000, totalSales: 30000 },
    { month: 'Aug', redemptions: 17000, discounts: 14000, totalSales: 27000 },
    { month: 'Sep', redemptions: 23000, discounts: 10000, totalSales: 29000 },
    { month: 'Oct', redemptions: 21000, discounts: 13000, totalSales: 31000 },
    { month: 'Nov', redemptions: 24000, discounts: 15000, totalSales: 30000 },
    { month: 'Dec', redemptions: 26000, discounts: 17000, totalSales: 32000 },
];

export const activeCoupons = [
    { id: 'c1', offer: 'NEW YEAR OFFER', type: 'FLAT', discount: '25%', unit: 'off', status: 'Approved' },
    { id: 'c2', offer: 'NEW YEAR OFFER', type: 'FLAT', discount: '25%', unit: 'off', status: 'Approved' },
    { id: 'c3', offer: 'NEW YEAR OFFER', type: 'FLAT', discount: '25%', unit: 'off', status: 'Approved' },
    { id: 'c4', offer: 'NEW YEAR OFFER', type: 'FLAT', discount: '25%', unit: 'off', status: 'Approved' },
    { id: 'c5', offer: 'NEW YEAR OFFER', type: 'FLAT', discount: '25%', unit: 'off', status: 'Approved' },
    { id: 'c6', offer: 'NEW YEAR OFFER', type: 'FLAT', discount: '25%', unit: 'off', status: 'Approved' },
    { id: 'c7', offer: 'NEW YEAR OFFER', type: 'FLAT', discount: '25%', unit: 'off', status: 'Approved' },
    { id: 'c8', offer: 'NEW YEAR OFFER', type: 'FLAT', discount: '25%', unit: 'off', status: 'Approved' },
    { id: 'c9', offer: 'NEW YEAR OFFER', type: 'FLAT', discount: '25%', unit: 'off', status: 'Approved' },
    { id: 'c10', offer: 'NEW YEAR OFFER', type: 'FLAT', discount: '25%', unit: 'off', status: 'Pending' },
    { id: 'c11', offer: 'NEW YEAR OFFER', type: 'FLAT', discount: '25%', unit: 'off', status: 'Pending' },
    { id: 'c12', offer: 'NEW YEAR OFFER', type: 'FLAT', discount: '25%', unit: 'off', status: 'Rejected' },
];

export const transactionHistory = [
    { id: 't1', status: 'Approved', amount: '₹2,350', discount: '-₹100', couponId: 'C405410', date: '21 Feb', time: '10:42 AM' },
    { id: 't2', status: 'Approved', amount: '₹2,350', discount: '-₹100', couponId: 'C405410', date: '21 Feb', time: '10:42 AM' },
    { id: 't3', status: 'Approved', amount: '₹2,350', discount: '-₹100', couponId: 'C405410', date: '21 Feb', time: '10:42 AM' },
];

export const staffMembersData = Array.from({ length: 45 }, (_, i) => ({
    id: i + 1,
    name: i % 2 === 0 ? 'Vinodh Bansal' : 'Amit Sharma',
    phone: '+91 9876543210',
    email: i % 2 === 0 ? 'vinoshbansal@email.com' : 'amitsharma@email.com',
    role: i % 3 === 0 ? 'Cashier' : 'Manager',
    shift: '9:00AM to 5:00PM',
    permission: 'Accepted',
    image: null
}));
