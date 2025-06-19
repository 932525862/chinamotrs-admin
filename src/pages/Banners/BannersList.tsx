import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useBannersStore, type BannerItem } from "@/stores/banner";
import BannerCard from "./BannersCard";
import BannersFormModal from "./BannersFormModal";
import { BannersDeleteModal } from "./BannersDeleteModal";


const BannerList = () => {
    const { banners, fetchBanners, } = useBannersStore();
    const [selected, setSelected] = useState<BannerItem | null>(null);
    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [mode, setMode] = useState<"create" | "edit">("create");

    useEffect(() => {
        fetchBanners();
    }, [])
    const handleCreate = () => {
        setMode("create");
        setSelected(null);
        setFormOpen(true);
    };

    const handleEdit = (item: BannerItem) => {
        setMode("edit");
        setSelected(item);
        setFormOpen(true);
    };

    const handleDelete = (item: BannerItem) => {
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
                    <BannerCard
                        key={item.id}
                        banners={item}
                        onEdit={() => handleEdit(item)}
                        onDelete={() => handleDelete(item)}
                    />
                ))}
            </div>

            <BannersFormModal
                open={formOpen}
                setOpen={setFormOpen}
                mode={mode}
                banner={selected}
            />

            <BannersDeleteModal
                open={deleteOpen}
                setOpen={setDeleteOpen}
                bannersId={selected?.id}
            />
        </div>
    );
};

export default BannerList;
