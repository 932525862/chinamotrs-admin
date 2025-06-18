import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNewsStore } from "@/stores/news";

type Props = {
    open: boolean;
    setOpen: (value: boolean) => void;
    newsId?: string;
};

const NewsDeleteModal = ({ open, setOpen, newsId }: Props) => {
    const { deleteNews } = useNewsStore();

    const handleDelete = async () => {
        if (!newsId) return;
        try {
            await deleteNews(newsId);
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
                <p>Are you sure you want to delete this news item?</p>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default NewsDeleteModal;
