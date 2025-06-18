import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { usePartnerStore } from "@/stores/partner";
import { useEffect } from "react";

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
    const { createPartner, updatePartner, getPartnerById, loading } =
        usePartnerStore();

    const { register, handleSubmit, reset } = useForm<FormData>();

    useEffect(() => {
        if (mode === "edit" && partnerId) {
            getPartnerById(partnerId);
        }
    }, [partnerId]);

    const onSubmit = async (data: FormData) => {
        const file = data.logo?.[0];
        if (!file || !(file instanceof File)) return;

        if (mode === "edit" && partnerId) {
            await updatePartner(partnerId, file);
        } else {
            await createPartner(file);
        }

        setOpen(false);
        reset();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{mode === "edit" ? "Edit" : "Create"} Partner</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input type="file" accept="image/*" {...register("logo", { required: mode === "create" })} />
                    <div className="flex gap-2 justify-end">
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Submit"}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default PartnerFormModal;
