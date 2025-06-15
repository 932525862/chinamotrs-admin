import { useState } from 'react';
import { Plus, Search, Filter, Star, Package, DollarSign, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const products = [
    {
        id: 1,
        name: 'Wireless Bluetooth Headphones',
        category: 'Electronics',
        price: 99.99,
        stock: 156,
        status: 'active',
        rating: 4.5,
        sales: 234,
        image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
    },
    {
        id: 2,
        name: 'Smart Fitness Tracker',
        category: 'Wearables',
        price: 199.99,
        stock: 89,
        status: 'active',
        rating: 4.2,
        sales: 156,
        image: 'https://images.pexels.com/photos/1797104/pexels-photo-1797104.jpeg',
    },
    {
        id: 3,
        name: 'Organic Coffee Beans',
        category: 'Food & Beverage',
        price: 24.99,
        stock: 0,
        status: 'out_of_stock',
        rating: 4.8,
        sales: 456,
        image: 'https://images.pexels.com/photos/13836/pexels-photo-13836.jpeg',
    },
    {
        id: 4,
        name: 'Premium Yoga Mat',
        category: 'Fitness',
        price: 79.99,
        stock: 234,
        status: 'active',
        rating: 4.6,
        sales: 123,
        image: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg',
    },
    {
        id: 5,
        name: 'Smartphone Case',
        category: 'Accessories',
        price: 19.99,
        stock: 45,
        status: 'low_stock',
        rating: 4.1,
        sales: 89,
        image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
    },
    {
        id: 6,
        name: 'LED Desk Lamp',
        category: 'Home & Office',
        price: 49.99,
        stock: 178,
        status: 'active',
        rating: 4.4,
        sales: 67,
        image: 'https://images.pexels.com/photos/1714341/pexels-photo-1714341.jpeg',
    },
];

export function ProductsPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'out_of_stock':
                return 'bg-red-100 text-red-800';
            case 'low_stock':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'active':
                return 'Active';
            case 'out_of_stock':
                return 'Out of Stock';
            case 'low_stock':
                return 'Low Stock';
            default:
                return status;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
                    <p className="text-gray-600 mt-2">Manage your product inventory and catalog</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-blue-600" />
                            <div className="text-2xl font-bold">158</div>
                        </div>
                        <p className="text-xs text-green-600">+12 this month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <div className="text-2xl font-bold">$45,678</div>
                        </div>
                        <p className="text-xs text-green-600">+8.2% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Top Seller</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-orange-600" />
                            <div className="text-2xl font-bold">456</div>
                        </div>
                        <p className="text-xs text-blue-600">Coffee Beans</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Low Stock</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-red-600" />
                            <div className="text-2xl font-bold">3</div>
                        </div>
                        <p className="text-xs text-red-600">Need restocking</p>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filter */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <CardTitle>Products</CardTitle>
                        <div className="flex gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-full sm:w-80"
                                />
                            </div>
                            <Button variant="outline">
                                <Filter className="h-4 w-4 mr-2" />
                                Filter
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map((product) => (
                            <Card key={product.id} className="hover:shadow-lg transition-shadow">
                                <div className="aspect-square overflow-hidden rounded-t-lg">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                    />
                                </div>
                                <CardContent className="p-4">
                                    <div className="space-y-3">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
                                            <p className="text-sm text-gray-500">{product.category}</p>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                                            <Badge className={getStatusColor(product.status)}>
                                                {getStatusText(product.status)}
                                            </Badge>
                                        </div>

                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-1">
                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                <span className="text-gray-600">{product.rating}</span>
                                            </div>
                                            <span className="text-gray-600">Stock: {product.stock}</span>
                                        </div>

                                        <div className="text-sm text-gray-600">
                                            {product.sales} sold this month
                                        </div>

                                        <div className="flex gap-2 pt-2">
                                            <Button size="sm" className="flex-1">Edit</Button>
                                            <Button size="sm" variant="outline" className="flex-1">View</Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}