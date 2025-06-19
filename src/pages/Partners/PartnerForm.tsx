import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePartnerStore } from "@/stores/partner";

type FormData = {
    logo: FileList;
};

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

    const { register, handleSubmit, reset } = useForm<FormData>();

    useEffect(() => {
        if (mode === "edit" && partnerId) {
            getPartnerById(partnerId);
        } else if (mode === "create") {
            setSelectedPartner(null);  // ✅ Clear any previously selected partner
            reset();                   // ✅ Reset the form fields
        }
    }, [mode, partnerId]);

    const onSubmit = async (data: FormData) => {
        const file = data.logo?.[0];
        if (!file || !(file instanceof File)) return;

        if (mode === "edit" && partnerId) {
            await updatePartner(partnerId, file);
        } else {
            await createPartner(file);
        }

        reset();
        setSelectedPartner(null); // ✅ Clean up state after submit
        setOpen(false);
    };

    const UPLOAD_BASE = import.meta.env.VITE_API_UPLOAD_BASE;
    const imageUrl = selectedPartner?.logo ? `${UPLOAD_BASE}${selectedPartner.logo}` : null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{mode === "edit" ? "Edit Partner" : "Create Partner"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {mode === "edit" && imageUrl && (
                        <img
                            src={imageUrl}
                            alt="Current Logo"
                            className="w-full h-32 object-contain rounded border p-2"
                        />
                    )}

                    <Input
                        type="file"
                        accept="image/*"
                        {...register("logo", {
                            required: mode === "create" // only required when creating
                        })}
                    />

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
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
