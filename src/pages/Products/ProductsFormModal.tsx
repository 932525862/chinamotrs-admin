// ProductFormModal.tsx
"use client";

import { useEffect, useRef, useState, type JSX } from "react";
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
import type { Category } from "@/stores/category";

type ProductDetailItem = { key: string; value: string };

interface ProductFormModalProps {
    open: boolean;
    onClose: () => void;
    productId?: string | number;
}

const ProductFormModal = ({ open, onClose, productId }: ProductFormModalProps) => {
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
    const [detailsUz, setDetailsUz] = useState<ProductDetailItem[]>([]);
    const [detailsRu, setDetailsRu] = useState<ProductDetailItem[]>([]);
    const [categoryId, setCategoryId] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const UPLOAD_BASE = import.meta.env.VITE_API_UPLOAD_BASE;

    useEffect(() => {
        axiosInstance.get("/api/categories").then((res) => {
            const data = res.data as { data: Category[] };
            setCategories(data.data);
        });
    }, []);

    useEffect(() => {
        if (productId) getProductById(Number(productId));
    }, [productId]);

    useEffect(() => {
        if (productId && product) {
            setNameUz(product.name.uz);
            setNameRu(product.name.ru);
            setPrice(product.price.toString());
            setModel(product.model);
            setCategoryId(String(product.category?.id || product.categoryId));

            const uz: ProductDetailItem[] = [], ru: ProductDetailItem[] = [];
            if (product.details) {
                Object.entries(product.details.uz || {}).forEach(([key, value]) => uz.push({ key, value }));
                Object.entries(product.details.ru || {}).forEach(([key, value]) => ru.push({ key, value }));
            }
            setDetailsUz(uz);
            setDetailsRu(ru);
            setImages([]); // Clear any previous new files on edit
        } else {
            // Reset form
            setNameUz("");
            setNameRu("");
            setPrice("");
            setModel("");
            setCategoryId("");
            setDetailsUz([]);
            setDetailsRu([]);
            setImages([]);
        }
    }, [productId, product]);

    useEffect(() => {
        if (!open && fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }, [open]);

    const handleSubmit = async () => {
        if (!categoryId) {
            toast.error("Please select a category");
            return;
        }

        const formData = new FormData();
        formData.append("name", JSON.stringify({ uz: nameUz, ru: nameRu }));
        formData.append("price", price);
        formData.append("model", model);
        formData.append("categoryId", categoryId);

        const details: { uz: { [key: string]: string }, ru: { [key: string]: string } } = { uz: {}, ru: {} };
        detailsUz.forEach(({ key, value }) => { if (key && value) details.uz[key] = value });
        detailsRu.forEach(({ key, value }) => { if (key && value) details.ru[key] = value });
        formData.append("details", JSON.stringify(details));

        images.slice(0, 10).forEach(img => formData.append("images", img));

        const success = productId
            ? await updateProduct(Number(productId), formData)
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
            const files = Array.from(e.target.files);
            if (files.length > 10) {
                toast.error("You can upload up to 10 images");
                return;
            }
            setImages(files);
        }
    };

    const renderDetailInputs = (
        details: ProductDetailItem[],
        setDetails: React.Dispatch<React.SetStateAction<ProductDetailItem[]>>,
        label: string
    ): JSX.Element => (
        <div>
            <Label>{label}</Label>
            <div className="space-y-2">
                {details.map((item, idx) => (
                    <div key={idx} className="flex gap-2">
                        <Input
                            placeholder="Key"
                            value={item.key}
                            onChange={(e) => {
                                const updated = [...details];
                                updated[idx].key = e.target.value;
                                setDetails(updated);
                            }}
                        />
                        <Input
                            placeholder="Value"
                            value={item.value}
                            onChange={(e) => {
                                const updated = [...details];
                                updated[idx].value = e.target.value;
                                setDetails(updated);
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
    );

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
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
                            <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
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
                                <option key={cat.id} value={cat.id}>{cat.name.uz}</option>
                            ))}
                        </select>
                    </div>

                    {renderDetailInputs(detailsUz, setDetailsUz, "Details (Uzbek)")}
                    {renderDetailInputs(detailsRu, setDetailsRu, "Details (Russian)")}

                    <div>
                        <Label>Images (max 10)</Label>
                        <Input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            ref={fileInputRef}
                        />

                        {/* New images preview */}
                        {images.length > 0 && (
                            <div className="flex gap-2 mt-2 flex-wrap">
                                {images.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={URL.createObjectURL(img)}
                                        alt={`Preview ${idx}`}
                                        className="w-20 h-20 object-cover border rounded"
                                        onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Existing images */}
                        {(productId && product && product.images?.length > 0 && images.length === 0) && (
                            <div className="flex gap-2 mt-2 flex-wrap">
                                {product.images.slice(0, 10).map((img, idx) => (
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
