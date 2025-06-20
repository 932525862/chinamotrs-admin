"use client";

import { useEffect, useRef, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useProductStore } from "@/stores/product";
import { axiosInstance } from "@/lib/axiosIntance";

interface Category {
    id: number;
    name: {
        uz: string;
        ru: string;
    };
}

interface Props {
    open: boolean;
    onClose: () => void;
    productId: number | null;
}

const ProductFormModal = ({ open, onClose, productId }: Props) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {
        createProduct,
        updateProduct,
        getProductById,
        product,
        fetchPaginatedProducts,
    } = useProductStore();

    const [nameUz, setNameUz] = useState("");
    const [nameRu, setNameRu] = useState("");
    const [price, setPrice] = useState("");
    const [model, setModel] = useState("");
    const [details, setDetails] = useState<{ key: string; value: string }[]>([]);
    const [categoryId, setCategoryId] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const UPLOAD_BASE = import.meta.env.VITE_API_UPLOAD_BASE;

    // Fetch categories
    useEffect(() => {
        axiosInstance.get("/api/categories").then((res) => {
            const data = res.data as { data: Category[] };
            setCategories(data.data);
        });
    }, []);

    // Fetch product when editing
    useEffect(() => {
        if (productId) {
            getProductById(productId);
        }
    }, [productId]);

    // Set fields when product is fetched
    useEffect(() => {
        if (productId && product) {
            setNameUz(product.name.uz);
            setNameRu(product.name.ru);
            setPrice(product.price.toString());
            setModel(product.model);
            setCategoryId(String(product.category?.id || product.categoryId));
            setDetails(
                Object.entries(product.details || {}).map(([key, value]) => ({
                    key,
                    value: String(value),
                }))
            );
        } else {
            // Reset on create
            setNameUz("");
            setNameRu("");
            setPrice("");
            setModel("");
            setCategoryId("");
            setDetails([]);
            setImages([]);
        }
    }, [productId, product]);

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append("name", JSON.stringify({ uz: nameUz, ru: nameRu }));
        formData.append("price", price);
        formData.append("model", model);
        formData.append("categoryId", categoryId);

        const detailObj: Record<string, string> = {};
        details.forEach(({ key, value }) => {
            if (key && value) detailObj[key] = value;
        });
        formData.append("details", JSON.stringify(detailObj));

        images.forEach((img) => formData.append("images", img));

        const success = productId
            ? await updateProduct(productId, formData)
            : await createProduct(formData);

        if (success) {
            toast.success(`Product ${productId ? "updated" : "created"}`);
            await fetchPaginatedProducts(1);
            onClose();
        } else {
            toast.error("Something went wrong");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files));
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>{productId ? "Edit Product" : "Add Product"}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Uzbek Name</Label>
                            <Input value={nameUz} onChange={(e) => setNameUz(e.target.value)} />
                        </div>
                        <div>
                            <Label>Russian Name</Label>
                            <Input value={nameRu} onChange={(e) => setNameRu(e.target.value)} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Price</Label>
                            <Input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Model</Label>
                            <Input value={model} onChange={(e) => setModel(e.target.value)} />
                        </div>
                    </div>

                    <div>
                        <Label>Category</Label>
                        <select
                            className="w-full border rounded px-3 py-2"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                        >
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name.uz}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <Label>Details (max 6)</Label>
                        <div className="space-y-2">
                            {details.map((item, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <Input
                                        placeholder="Key"
                                        value={item.key}
                                        onChange={(e) => {
                                            const newDetails = [...details];
                                            newDetails[idx].key = e.target.value;
                                            setDetails(newDetails);
                                        }}
                                    />
                                    <Input
                                        placeholder="Value"
                                        value={item.value}
                                        onChange={(e) => {
                                            const newDetails = [...details];
                                            newDetails[idx].value = e.target.value;
                                            setDetails(newDetails);
                                        }}
                                    />
                                </div>
                            ))}
                            {details.length < 6 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setDetails([...details, { key: "", value: "" }])}
                                >
                                    + Add Detail
                                </Button>
                            )}
                        </div>
                    </div>

                    <div>
                        <Label>Images</Label>
                        <Input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            ref={fileInputRef}
                        />

                        {productId && (product?.images?.length ?? 0) > 0 && (
                            <div className="flex gap-2 mt-2 flex-wrap">
                                {(product?.images ?? []).map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={`${UPLOAD_BASE}${img.path}`}
                                        alt="Product"
                                        className="w-20 h-20 object-cover border rounded"
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <Button onClick={handleSubmit}>
                            {productId ? "Update" : "Create"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ProductFormModal;
