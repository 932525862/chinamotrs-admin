/* "use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useProductStore, type Product } from "@/stores/product";
import Pagination from "@/components/pagination/pagination";
import ProductCard from "./ProductsCard";
import ProductFormModal from "./ProductsFormModal";

const ProductList = () => {
    const { products, fetchPaginatedProducts } = useProductStore();
    const [selected, setSelected] = useState<Product | null>(null);
    const [formOpen, setFormOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [meta, setMeta] = useState<{ totalPages: number }>({ totalPages: 1 });

    useEffect(() => {
        fetchPaginatedProducts(currentPage).then((data) => {
            if (data?.meta) setMeta(data.meta);
        });
    }, [currentPage]);

    const handleCreate = () => {
        setSelected(null);
        setFormOpen(true);
    };

    const handleEdit = (product: Product) => {
        setSelected(product);
        setFormOpen(true);
    };

    const handleDelete = async (product: Product) => {
        if (!product.id) return;
        await useProductStore.getState().deleteProduct(product.id);
    };

    return (
        <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Products</h1>
                <Button onClick={handleCreate}>+ Create Product</Button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products?.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onEdit={() => handleEdit(product)}
                        onDelete={() => handleDelete(product)}
                    />
                ))}
            </div>

            {meta.totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={meta.totalPages}
                    onPageChange={setCurrentPage}
                />
            )}

            <ProductFormModal
                open={formOpen}
                onClose={() => setFormOpen(false)}
                productId={selected?.id ?? null}
            />
        </div>
    );
};

export default ProductList; */


"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useProductStore, type Product } from "@/stores/product";
import Pagination from "@/components/pagination/pagination";
import ProductFormModal from "./ProductsFormModal";
import { Pencil, Trash2 } from "lucide-react";

const ProductList = () => {
    const { products, fetchPaginatedProducts } = useProductStore();
    const [selected, setSelected] = useState<Product | null>(null);
    const [formOpen, setFormOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [meta, setMeta] = useState<{ totalPages: number }>({ totalPages: 1 });

    useEffect(() => {
        const fetch = async () => {
            const data = await fetchPaginatedProducts(currentPage);
            if (data?.meta) setMeta(data.meta);
        };
        fetch();
    }, [currentPage, fetchPaginatedProducts]);


    const handleCreate = () => {
        setSelected(null);
        setFormOpen(true);
    };

    const handleEdit = (product: Product) => {
        setSelected(product);
        setFormOpen(true);
    };

    const handleDelete = async (product: Product) => {
        if (!product.id) return;
        await useProductStore.getState().deleteProduct(product.id);
        const data = await fetchPaginatedProducts(currentPage);
        if (data?.meta) setMeta(data.meta);
    };

    const UPLOAD_BASE = import.meta.env.VITE_API_UPLOAD_BASE;

    return (
        <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Products</h1>
                <Button onClick={handleCreate}>+ Create Product</Button>
            </div>

            <div className="overflow-x-auto rounded-lg border">
                <table className="w-full table-auto text-sm border-collapse">
                    <thead className="bg-muted text-left">
                        <tr>
                            <th className="p-3 border">Image</th>
                            <th className="p-3 border">Name (UZ)</th>
                            <th className="p-3 border">Name (RU)</th>
                            <th className="p-3 border">Model</th>
                            <th className="p-3 border">Price</th>
                            <th className="p-3 border">Category</th>
                            <th className="p-3 border">Details</th>
                            <th className="p-3 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products?.map((product) => (
                            <tr key={product.id} className="border-t">
                                <td className="p-3 border align-top">
                                    {product.images?.[0] && (
                                        <img
                                            src={`${UPLOAD_BASE}${product.images[0]?.path}`}
                                            alt="Product"
                                            className="w-16 h-16 object-cover rounded-md border"
                                        />
                                    )}
                                </td>
                                <td className="p-3 border align-top">{product.name.uz}</td>
                                <td className="p-3 border align-top">{product.name.ru}</td>
                                <td className="p-3 border align-top" dangerouslySetInnerHTML={{ __html: product.model }} />
                                <td className="p-3 border align-top">{product.price.toLocaleString()} so'm</td>
                                <td className="p-3 border align-top">{product?.category?.name.uz}</td>
                                <td className="p-3 border align-top">
                                    {product.details && Object.entries(product.details).length > 0 ? (
                                        <table className="text-xs w-full border border-muted bg-muted/20">
                                            <thead>
                                                <tr>
                                                    <th className="border p-1">Key</th>
                                                    <th className="border p-1">Value</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.entries(product.details).map(([key, value], index) => (
                                                    <tr key={index}>
                                                        <td className="border p-1">{key}</td>
                                                        <td className="border p-1">{value}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <span className="text-muted-foreground italic">No details</span>
                                    )}
                                </td>
                                <td className="p-3 border align-top space-x-2">
                                    <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                                        <Pencil className="w-4 h-4 mr-1" /> Edit
                                    </Button>
                                    <Button variant="destructive" size="sm" onClick={() => handleDelete(product)}>
                                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center pt-4">
                {meta.totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={meta.totalPages}
                        onPageChange={setCurrentPage}
                    />
                )}
            </div>

            <ProductFormModal
                open={formOpen}
                onClose={() => setFormOpen(false)}
                productId={selected?.id ?? null}
            />
        </div>
    );
};

export default ProductList;


