import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useBannerStore } from "@/stores/banner";

type DeleteProps = {
    open: boolean;
    setOpen: (value: boolean) => void;
    bannerId?: number;
};

export const BannerDeleteModal = ({ open, setOpen, bannerId }: DeleteProps) => {
    const { deleteBanner, loading } = useBannerStore();

    const handleDelete = async () => {
        if (!bannerId) return;
        try {
            await deleteBanner(bannerId);
            setOpen(false);
        } catch (err: any) {
            alert("Delete failed: " + (err.message || err));
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Delete</DialogTitle>
                </DialogHeader>
                <p>Are you sure you want to delete this banner? This action cannot be undone.</p>
                <div className="flex justify-end gap-2 pt-4">
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};