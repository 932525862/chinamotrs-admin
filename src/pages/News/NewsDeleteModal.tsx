import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNewsStore } from "@/stores/news";
import { toast } from "sonner";

type DeleteProps = {
    open: boolean;
    setOpen: (value: boolean) => void;
    newsId?: number;
};

export const NewsDeleteModal = ({ open, setOpen, newsId }: DeleteProps) => {
    const { deleteNews } = useNewsStore();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!newsId) return;
        setLoading(true);
        try {
            await deleteNews(newsId);
            toast.success("News deleted successfully");
            setOpen(false);
        } catch (err: any) {
            toast.error("Delete failed: " + (err.message || err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Delete</DialogTitle>
                </DialogHeader>
                <p>Are you sure you want to delete this news item?</p>
                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                        {loading ? "Deleting..." : "Delete"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
