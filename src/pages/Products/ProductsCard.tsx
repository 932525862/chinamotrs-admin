import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import type { Product } from "@/stores/product";
import ProductDeleteDialog from "./ProductDeleteModal";

type Props = {
    product: Product;
    onEdit: () => void;
    onDelete: () => void;
};

const ProductCard = ({ product, onEdit, onDelete }: Props) => {
    const [showDelete, setShowDelete] = useState(false);
    const UPLOAD_BASE = import.meta.env.VITE_API_UPLOAD_BASE;
    const imageUrl = product.images?.[0] ? `${UPLOAD_BASE}${product.images[0]}` : null;

    console.log(UPLOAD_BASE, "upload")
    console.log(imageUrl, "imageurl")

    return (
        <>
            <Card className="border rounded-2xl p-4 space-y-2 shadow-sm bg-white relative">
                <h3 className="text-lg font-semibold">{product.name.uz}</h3>

                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt="product"
                        className="w-full h-40 object-cover rounded-xl"
                    />
                )}

                <p className="text-sm text-muted-foreground">RU: {product.name.ru}</p>
                <p className="text-sm text-muted-foreground">Model: {product.model}</p>
                <p className="text-sm text-muted-foreground">Price: {product.price} so'm</p>
                <p className="text-sm text-muted-foreground">Category ID: {product.categoryId}</p>

                <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={onEdit}>Edit</Button>
                    <Button variant="destructive" onClick={() => setShowDelete(true)}>Delete</Button>
                </div>
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
