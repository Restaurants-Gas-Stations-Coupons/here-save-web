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

export const superadminSidebarData = {
    logo: { text: 'Here&\nSave', color: '#DC0004' },
    stationLabel: null, // Hide for superadmin
    stationAddress: null, // Hide for superadmin
    navItems: [
        {
            id: 'dashboard',
            label: 'Petrol Stations',
            icon: 'Fuel',
            path: '/dashboard',
            subItems: [
                { id: 0, label: 'Location 01' },
                { id: 1, label: 'Location 02' },
                { id: 2, label: 'Location 03' },
            ]
        },
        {
            id: 'restaurants',
            label: 'Resturents',
            icon: 'Utensils',
            path: '/restaurants',
            subItems: [
                { id: 0, label: 'Location 01' },
                { id: 1, label: 'Location 02' },
                { id: 2, label: 'Location 03' },
            ]
        },
        { id: 'coupons', label: 'Coupons', icon: 'Ticket', path: '/coupons' },
        { id: 'staff', label: 'Staff members', icon: 'Users', path: '/staff' },
    ],
};

export const superadminRestaurants = [
    {
        id: 1,
        stationData: {
            name: 'Godred Italian Restaurant',
            icon: 'utensils',
            address: '603AB Road, Kondapur, Hyderabad-500032, Telangana, India',
            status: 'Active',
            outletId: 'P102402',
            manager: 'Ravi Kumar',
            contact: '+91 0254 457 624',
        },
        statsData: [
            { id: 'coupons_active', label: 'Coupons Active', value: '26', badge: { text: 'Active', type: 'active' } },
            { id: 'redemptions', label: 'Redemptions', value: '526', badge: { text: '6.8%', type: 'down' } },
            { id: 'discounts', label: 'Discounts', value: '3,865', badge: { text: '6.8%', type: 'up' } },
            { id: 'total_sale', label: 'Total Sale', value: '4,60,859', badge: { text: '6.8%', type: 'up' } },
        ]
    },
    {
        id: 2,
        stationData: {
            name: 'Paradise Biryani',
            icon: 'utensils',
            address: 'Jubilee Hills Road No. 36, Hyderabad-500033, Telangana, India',
            status: 'Active',
            outletId: 'I582311',
            manager: 'Suresh Verma',
            contact: '+91 9876 543 210',
        },
        statsData: [
            { id: 'coupons_active', label: 'Coupons Active', value: '45', badge: { text: 'Active', type: 'active' } },
            { id: 'redemptions', label: 'Redemptions', value: '782', badge: { text: '5.2%', type: 'up' } },
            { id: 'discounts', label: 'Discounts', value: '5,210', badge: { text: '2.1%', type: 'up' } },
            { id: 'total_sale', label: 'Total Sale', value: '6,20,100', badge: { text: '4.5%', type: 'up' } },
        ]
    },
    {
        id: 3,
        stationData: {
            name: 'Bawarchi Authentic',
            icon: 'utensils',
            address: 'Gachibowli ORR Point, Hyderabad-500081, Telangana, India',
            status: 'Active',
            outletId: 'H982442',
            manager: 'Anil Reddy',
            contact: '+91 8888 777 666',
        },
        statsData: [
            { id: 'coupons_active', label: 'Coupons Active', value: '18', badge: { text: 'Active', type: 'active' } },
            { id: 'redemptions', label: 'Redemptions', value: '310', badge: { text: '1.2%', type: 'down' } },
            { id: 'discounts', label: 'Discounts', value: '2,105', badge: { text: '0.8%', type: 'down' } },
            { id: 'total_sale', label: 'Total Sale', value: '2,90,550', badge: { text: '3.1%', type: 'up' } },
        ]
    }
];

export const superadminStations = [
    {
        id: 1,
        stationData: {
            name: 'Bharat Petroleum Fuel Station',
            icon: 'fuel',
            address: '603AB Road, Kondapur, Hyderabad-500032, Telangana, India',
            status: 'Active',
            outletId: 'P102402',
            manager: 'Ravi Kumar',
            contact: '+91 0254 457 624',
        },
        statsData: [
            { id: 'coupons_active', label: 'Coupons Active', value: '26', badge: { text: 'Active', type: 'active' } },
            { id: 'redemptions', label: 'Redemptions', value: '526', badge: { text: '6.8%', type: 'down' } },
            { id: 'discounts', label: 'Discounts', value: '3,865', badge: { text: '6.8%', type: 'up' } },
            { id: 'total_sale', label: 'Total Sale', value: '4,60,859', badge: { text: '6.8%', type: 'up' } },
        ]
    },
    {
        id: 2,
        stationData: {
            name: 'Indian Oil Premium Pump',
            icon: 'fuel',
            address: 'Jubilee Hills Road No. 36, Hyderabad-500033, Telangana, India',
            status: 'Active',
            outletId: 'I582311',
            manager: 'Suresh Verma',
            contact: '+91 9876 543 210',
        },
        statsData: [
            { id: 'coupons_active', label: 'Coupons Active', value: '45', badge: { text: 'Active', type: 'active' } },
            { id: 'redemptions', label: 'Redemptions', value: '782', badge: { text: '5.2%', type: 'up' } },
            { id: 'discounts', label: 'Discounts', value: '5,210', badge: { text: '2.1%', type: 'up' } },
            { id: 'total_sale', label: 'Total Sale', value: '6,20,100', badge: { text: '4.5%', type: 'up' } },
        ]
    },
    {
        id: 3,
        stationData: {
            name: 'Hindustan Petroleum Dealer',
            icon: 'fuel',
            address: 'Gachibowli ORR Point, Hyderabad-500081, Telangana, India',
            status: 'Active',
            outletId: 'H982442',
            manager: 'Anil Reddy',
            contact: '+91 8888 777 666',
        },
        statsData: [
            { id: 'coupons_active', label: 'Coupons Active', value: '18', badge: { text: 'Active', type: 'active' } },
            { id: 'redemptions', label: 'Redemptions', value: '310', badge: { text: '1.2%', type: 'down' } },
            { id: 'discounts', label: 'Discounts', value: '2,105', badge: { text: '0.8%', type: 'down' } },
            { id: 'total_sale', label: 'Total Sale', value: '2,90,550', badge: { text: '3.1%', type: 'up' } },
        ]
    }
];

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
