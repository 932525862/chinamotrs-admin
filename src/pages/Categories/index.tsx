import { useState } from 'react';
import { Plus, Search, FolderOpen, Edit, Trash2, Package } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

const categories = [
    { id: 1, name: 'Electronics', description: 'Electronic devices and gadgets', productCount: 45, status: 'active', parent: null },
    { id: 2, name: 'Smartphones', description: 'Mobile phones and accessories', productCount: 23, status: 'active', parent: 'Electronics' },
    { id: 3, name: 'Laptops', description: 'Computers and laptop accessories', productCount: 18, status: 'active', parent: 'Electronics' },
    { id: 4, name: 'Clothing', description: 'Apparel and fashion items', productCount: 78, status: 'active', parent: null },
    { id: 5, name: 'Men\'s Clothing', description: 'Clothing for men', productCount: 34, status: 'active', parent: 'Clothing' },
    { id: 6, name: 'Women\'s Clothing', description: 'Clothing for women', productCount: 44, status: 'active', parent: 'Clothing' },
    { id: 7, name: 'Home & Garden', description: 'Home improvement and garden supplies', productCount: 56, status: 'active', parent: null },
    { id: 8, name: 'Books', description: 'Books and educational materials', productCount: 234, status: 'active', parent: null },
    { id: 9, name: 'Sports', description: 'Sports equipment and accessories', productCount: 12, status: 'inactive', parent: null },
    { id: 10, name: 'Health & Beauty', description: 'Health and beauty products', productCount: 67, status: 'active', parent: null },
];

export function CategoriesPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'inactive':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
                    <p className="text-gray-600 mt-2">Organize your products with categories and subcategories</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <FolderOpen className="h-4 w-4 text-blue-600" />
                            <div className="text-2xl font-bold">25</div>
                        </div>
                        <p className="text-xs text-green-600">+3 this month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Active Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <FolderOpen className="h-4 w-4 text-green-600" />
                            <div className="text-2xl font-bold">22</div>
                        </div>
                        <p className="text-xs text-blue-600">88% of total</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Products Categorized</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-orange-600" />
                            <div className="text-2xl font-bold">567</div>
                        </div>
                        <p className="text-xs text-green-600">95% coverage</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Most Popular</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <FolderOpen className="h-4 w-4 text-purple-600" />
                            <div className="text-2xl font-bold">234</div>
                        </div>
                        <p className="text-xs text-blue-600">Books category</p>
                    </CardContent>
                </Card>
            </div>

            {/* Categories Tree View */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <CardTitle>Categories</CardTitle>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search categories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-full sm:w-80"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Parent</TableHead>
                                <TableHead>Products</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCategories.map((category) => (
                                <TableRow key={category.id} className="hover:bg-gray-50">
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <FolderOpen className="h-4 w-4 text-blue-600" />
                                            <span className="font-medium text-gray-900">{category.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-gray-600">
                                        {category.description}
                                    </TableCell>
                                    <TableCell>
                                        {category.parent ? (
                                            <Badge variant="outline">{category.parent}</Badge>
                                        ) : (
                                            <span className="text-gray-400">Root</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Package className="h-4 w-4 text-gray-400" />
                                            <span className="text-gray-600">{category.productCount}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getStatusColor(category.status)}>
                                            {category.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="sm">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Category Tree Visualization */}
            <Card>
                <CardHeader>
                    <CardTitle>Category Hierarchy</CardTitle>
                    <CardDescription>Visual representation of your category structure</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Root categories */}
                        {categories.filter(cat => !cat.parent).map((rootCategory) => (
                            <div key={rootCategory.id} className="space-y-2">
                                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                    <FolderOpen className="h-5 w-5 text-blue-600" />
                                    <span className="font-semibold text-blue-900">{rootCategory.name}</span>
                                    <Badge variant="outline">{rootCategory.productCount} products</Badge>
                                </div>

                                {/* Child categories */}
                                {categories.filter(cat => cat.parent === rootCategory.name).map((childCategory) => (
                                    <div key={childCategory.id} className="ml-8 flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                        <div className="w-4 h-px bg-gray-300"></div>
                                        <FolderOpen className="h-4 w-4 text-gray-500" />
                                        <span className="text-gray-700">{childCategory.name}</span>
                                        <Badge variant="outline" className="text-xs">{childCategory.productCount}</Badge>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}