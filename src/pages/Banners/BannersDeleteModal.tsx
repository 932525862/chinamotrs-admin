import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useBannersStore } from "@/stores/banner";

type DeleteProps = {
    open: boolean;
    setOpen: (value: boolean) => void;
    bannersId?: number;
};

export const BannersDeleteModal = ({ open, setOpen, bannersId }: DeleteProps) => {
    const { deleteBanners } = useBannersStore();

    const handleDelete = async () => {
        if (!bannersId) return;
        try {
            await deleteBanners(bannersId);
            setOpen(false);
        } catch {
            alert("Delete failed");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Delete</DialogTitle>
                </DialogHeader>
                <p>Are you sure you want to delete this banner item?</p>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
