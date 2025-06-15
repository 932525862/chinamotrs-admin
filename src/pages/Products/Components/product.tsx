import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface IProduct {
    id?: number;
    image: string;
    name: string;
    category: string;
    price: number;
    status: string;
    rating: number;
    stock: number;
    sales: number
}

const ProductComponent = (product: IProduct) => {
    return (
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

                    <div className="flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <Button size="sm" className="flex-1">Edit</Button>
                        <Button size="sm" variant="outline" className="flex-1">View</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default ProductComponent