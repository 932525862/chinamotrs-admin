import { useEffect, useRef } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBannerStore, type Banner } from "@/stores/banner";

// Component Props
type Props = {
    open: boolean;
    setOpen: (value: boolean) => void;
    mode: "create" | "edit";
    banner: Banner | null;
};

const BannerFormModal = ({ open, setOpen, mode, banner }: Props) => {
    const {
        text,
        title,
        setText,
        setTitle,
        setImage,
        image,
        createBanner,
        updateBanner,
        getBannerById,
        selectedBanner,
        clearForm,
    } = useBannerStore();

    const fileInputRef = useRef<HTMLInputElement>(null);
    const UPLOAD_BASE = import.meta.env.VITE_API_UPLOAD_BASE;

    useEffect(() => {
        if (mode === "edit" && banner) {
            getBannerById(banner.id);
        } else if (mode === "create") {
            clearForm();
            // Clear the file input when creating new banner
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    }, [mode, banner, open]); // Added 'open' to dependencies to reset when modal opens/closes

    const handleSubmit = async () => {
        try {
            if (mode === "create") {
                await createBanner();
                clearForm();
                // Clear the file input after successful creation
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            } else if (banner) {
                await updateBanner(banner.id);
            }
            setOpen(false);
        } catch (err: any) {
            alert("Something went wrong. " + (err.message || err));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select a valid image file');
                e.target.value = '';
                return;
            }

            // Validate file size (e.g., max 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                alert('File size must be less than 5MB');
                e.target.value = '';
                return;
            }

            setImage(file);
        } else {
            setImage(null);
        }
    };

    const previewImage =
        image && image instanceof File && image.size > 0
            ? URL.createObjectURL(image)
            : mode === "edit" && selectedBanner?.image_url
                ? `${UPLOAD_BASE}${selectedBanner.image_url}`
                : null;

    // Clean up object URL to prevent memory leaks
    useEffect(() => {
        return () => {
            if (previewImage && image instanceof File) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage, image]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "create" ? "Create Banner" : "Edit Banner"}
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 pt-2">
                    {/* Image Preview */}
                    {previewImage && (
                        <div className="relative">
                            <img
                                src={previewImage}
                                alt="Preview"
                                className="w-full h-40 object-cover rounded-md"
                            />
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={() => {
                                    setImage(null);
                                    if (fileInputRef.current) {
                                        fileInputRef.current.value = "";
                                    }
                                }}
                            >
                                Remove
                            </Button>
                        </div>
                    )}

                    {/* Image Input */}
                    <div className="grid gap-1">
                        <Label htmlFor="image">Image</Label>
                        <Input
                            ref={fileInputRef}
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>

                    {/* Title UZ */}
                    <div className="grid gap-1">
                        <Label htmlFor="titleUz">Title (Uzbek) *</Label>
                        <Input
                            id="titleUz"
                            value={title.uz}
                            onChange={(e) => setTitle("uz", e.target.value)}
                            placeholder="Enter title in Uzbek"
                        />
                    </div>

                    {/* Title RU */}
                    <div className="grid gap-1">
                        <Label htmlFor="titleRu">Title (Russian) *</Label>
                        <Input
                            id="titleRu"
                            value={title.ru}
                            onChange={(e) => setTitle("ru", e.target.value)}
                            placeholder="Enter title in Russian"
                        />
                    </div>

                    {/* Text UZ */}
                    <div className="grid gap-1">
                        <Label htmlFor="textUz">Text (Uzbek) *</Label>
                        <Input
                            id="textUz"
                            value={text.uz}
                            onChange={(e) => setText("uz", e.target.value)}
                            placeholder="Enter text in Uzbek"
                        />
                    </div>

                    {/* Text RU */}
                    <div className="grid gap-1">
                        <Label htmlFor="textRu">Text (Russian) *</Label>
                        <Input
                            id="textRu"
                            value={text.ru}
                            onChange={(e) => setText("ru", e.target.value)}
                            placeholder="Enter text in Russian"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setOpen(false);
                                clearForm();
                                if (fileInputRef.current) {
                                    fileInputRef.current.value = "";
                                }
                            }}
                        >
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

export default BannerFormModal;