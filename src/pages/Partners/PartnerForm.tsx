import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { usePartnerStore } from "@/stores/partner";
import { toast } from "sonner"; // ✅ toast

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    mode: "create" | "edit";
    partnerId: string | null;
};

const PartnerFormModal = ({ open, setOpen, mode, partnerId }: Props) => {
    const {
        createPartner,
        updatePartner,
        getPartnerById,
        selectedPartner,
        setSelectedPartner,
        loading,
    } = usePartnerStore();

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        if (mode === "edit" && partnerId) {
            getPartnerById(partnerId);
        } else if (mode === "create") {
            setSelectedPartner(null);
            setPreviewImage(null);
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    }, [mode, partnerId, open]);

    useEffect(() => {
        return () => {
            if (previewImage?.startsWith("blob:")) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (mode === "create" && (!selectedFile || selectedFile.size === 0)) {
                toast.error("Please select a valid image file");
                return;
            }

            if (mode === "edit" && selectedFile && selectedFile.size === 0) {
                toast.error("Invalid image file");
                return;
            }

            const fileToUpload = selectedFile;

            if (mode === "edit" && partnerId) {
                if (fileToUpload) {
                    await updatePartner(partnerId, fileToUpload);
                    toast.success("Partner updated successfully");
                } else {
                    handleCancel();
                    return;
                }
            } else if (mode === "create" && fileToUpload) {
                await createPartner(fileToUpload);
                toast.success("Partner created successfully");
            }

            handleCancel();
        } catch (err: any) {
            toast.error("Something went wrong. " + (err.message || err));
        }
    };

    const handleCancel = () => {
        setSelectedPartner(null);
        setPreviewImage(null);
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setOpen(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (previewImage?.startsWith("blob:")) {
            URL.revokeObjectURL(previewImage);
        }

        if (file) {
            if (!file.type.startsWith("image/")) {
                toast.error("Please select a valid image file");
                e.target.value = "";
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                toast.error("File must be less than 5MB");
                e.target.value = "";
                return;
            }

            setSelectedFile(file);
            setPreviewImage(URL.createObjectURL(file));
        } else {
            setSelectedFile(null);
            setPreviewImage(null);
        }
    };

    const handleRemoveImage = () => {
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (previewImage?.startsWith("blob:")) URL.revokeObjectURL(previewImage);
        setPreviewImage(null);
        setSelectedFile(null);
    };

    const UPLOAD_BASE = import.meta.env.VITE_API_UPLOAD_BASE;
    const existingImageUrl = mode === "edit" && selectedPartner?.logo
        ? `${UPLOAD_BASE}${selectedPartner.logo}`
        : null;

    const displayImage = previewImage || existingImageUrl;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{mode === "edit" ? "Edit Partner" : "Create Partner"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {displayImage && (
                        <div className="relative">
                            <img
                                src={displayImage}
                                alt={previewImage ? "Preview" : "Current Logo"}
                                className="w-full h-40 object-contain rounded-md border-2 border-dashed border-gray-300 p-4 bg-gray-50"
                            />
                            {previewImage && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-2 right-2"
                                    onClick={handleRemoveImage}
                                >
                                    Remove
                                </Button>
                            )}
                        </div>
                    )}

                    <div className="grid gap-2">
                        <Label htmlFor="logo">
                            Logo {mode === "create" && <span className="text-red-500">*</span>}
                        </Label>
                        <Input
                            ref={fileInputRef}
                            id="logo"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="cursor-pointer"
                            required={mode === "create"}
                        />
                        <p className="text-sm text-gray-500">
                            Supported formats: JPG, PNG, GIF, WebP (max 5MB)
                        </p>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : mode === "edit" ? "Update" : "Create"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default PartnerFormModal;
