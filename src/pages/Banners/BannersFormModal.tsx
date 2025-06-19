import { useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBannersStore, type BannerItem } from "@/stores/banner";

type Props = {
    open: boolean;
    setOpen: (value: boolean) => void;
    mode: "create" | "edit";
    banner: BannerItem | null;
};

const BannersFormModal = ({ open, setOpen, mode, banner }: Props) => {
    const {
        text,
        title,
        setText,
        setTitle,
        setImage,
        image,
        createBanners,
        updateBanners,
        getBannersById,
        selectedBanners,
    } = useBannersStore();

    const UPLOAD_BASE = import.meta.env.VITE_API_UPLOAD_BASE;

    useEffect(() => {
        if (mode === "edit" && banner) {
            getBannersById(banner.id);
        } else if (mode === "create") {
            resetFields();
        }
    }, [mode, banner]);

    const resetFields = () => {
        setText("uz", "");
        setText("ru", "");
        setTitle("uz", "");
        setTitle("ru", "");
        setImage(new File([], ""));
    };

    const handleSubmit = async () => {
        try {
            if (mode === "create") {
                await createBanners();
                resetFields();
            } else if (banner) {
                await updateBanners(banner.id);
            }
            setOpen(false);
        } catch (err) {
            alert("Something went wrong. " + err);
        }
    };

    const previewImage =
        image && image.name
            ? URL.createObjectURL(image)
            : mode === "edit" && selectedBanners?.image_url
                ? `${UPLOAD_BASE}${selectedBanners.image_url}`
                : null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{mode === "create" ? "Create Banner" : "Edit Banner"}</DialogTitle>
                </DialogHeader>

                {image?.name && (
                    <img
                        src={previewImage!}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-md mb-2"
                    />
                )}

                <div className="grid gap-4 pt-2">
                    <div className="grid gap-1">
                        <Label htmlFor="image">Image</Label>
                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                if (e.target.files?.[0]) {
                                    setImage(e.target.files[0]);
                                }
                            }}
                        />
                    </div>

                    <div className="grid gap-1">
                        <Label htmlFor="titleUz">Title (uz)</Label>
                        <Input
                            id="titleUz"
                            value={title.uz}
                            onChange={(e) => setTitle("uz", e.target.value)}
                        />
                    </div>

                    <div className="grid gap-1">
                        <Label htmlFor="titleRu">Title (ru)</Label>
                        <Input
                            id="titleRu"
                            value={title.ru}
                            onChange={(e) => setTitle("ru", e.target.value)}
                        />
                    </div>

                    <div className="grid gap-1">
                        <Label htmlFor="textUz">Text (uz)</Label>
                        <Input
                            id="textUz"
                            value={text.uz}
                            onChange={(e) => setText("uz", e.target.value)}
                        />
                    </div>

                    <div className="grid gap-1">
                        <Label htmlFor="textRu">Text (ru)</Label>
                        <Input
                            id="textRu"
                            value={text.ru}
                            onChange={(e) => setText("ru", e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit}>
                            {mode === "create" ? "Create" : "Update"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default BannersFormModal;
