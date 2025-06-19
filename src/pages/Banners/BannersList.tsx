"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useBannerStore, type Banner } from "@/stores/banner";
import BannersCard from "./BannersCard";
import BannerFormModal from "./BannersFormModal";
import { BannerDeleteModal } from "./BannersDeleteModal";


const BannersList = () => {
    const { banners, fetchBanners } = useBannerStore();
    const [selected, setSelected] = useState<Banner | null>(null);
    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [mode, setMode] = useState<"create" | "edit">("create");

    useEffect(() => {
        fetchBanners();
    }, []);

    const handleCreate = () => {
        setMode("create");
        setSelected(null);
        setFormOpen(true);
    };

    const handleEdit = (item: Banner) => {
        setMode("edit");
        setSelected(item);
        setFormOpen(true);
    };

    const handleDelete = (item: Banner) => {
        setSelected(item);
        setDeleteOpen(true);
    };

    return (
        <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Banners</h1>
                <Button disabled={formOpen} onClick={handleCreate}>
                    + Create Banner
                </Button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {banners?.map((item) => (
                    <BannersCard
                        key={item.id}
                        banner={item}
                        onEdit={() => handleEdit(item)}
                        onDelete={() => handleDelete(item)}
                    />
                ))}
            </div>

            <BannerFormModal
                open={formOpen}
                setOpen={setFormOpen}
                mode={mode}
                banner={selected}
            />

            <BannerDeleteModal
                open={deleteOpen}
                setOpen={setDeleteOpen}
                bannerId={selected?.id}
            />
        </div>
    );
};

export default BannersList;