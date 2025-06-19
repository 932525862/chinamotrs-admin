import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/stores/product";
import ProductDeleteDialog from "./ProductDeleteModal";

interface Props {
    product: Product;
    onEdit: () => void;
    onDelete: () => void;
}

const ProductCard = ({ product, onEdit, onDelete }: Props) => {
    const [showDelete, setShowDelete] = useState(false);

    return (
        <>
            <Card className="p-4 space-y-2">
                <CardContent className="space-y-1">
                    <h3 className="text-lg font-bold">{product.name.uz}</h3>
                    <p className="text-sm text-muted-foreground">Model: {product.model}</p>
                    <p className="text-sm text-muted-foreground">Price: {product.price} so'm</p>
                    <p className="text-sm text-muted-foreground">Category ID: {product.categoryId}</p>

                    {product.images?.length > 0 && (
                        <img
                            src={product.images[0]}
                            alt="Product"
                            className="w-full h-40 object-cover rounded-md border"
                        />
                    )}

                    <div className="flex justify-end gap-2 pt-3">
                        <Button variant="outline" size="sm" onClick={onEdit}>
                            <Pencil className="w-4 h-4 mr-1" /> Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => setShowDelete(true)}>
                            <Trash2 className="w-4 h-4 mr-1" /> Delete
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <ProductDeleteDialog
                open={showDelete}
                onConfirm={() => {
                    onDelete();
                    setShowDelete(false);
                }}
                onCancel={() => setShowDelete(false)}
            />
        </>
    );
};

export default ProductCard;