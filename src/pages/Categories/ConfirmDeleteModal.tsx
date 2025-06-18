// components/shared/ConfirmDeleteModal.tsx
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDeleteModalProps {
    open: boolean;
    setOpen: (value: boolean) => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
}

const ConfirmDeleteModal = ({
    open,
    setOpen,
    onConfirm,
    title = "Confirm Deletion",
    description = "Are you sure you want to delete this item? This action cannot be undone.",
}: ConfirmDeleteModalProps) => {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={onConfirm}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmDeleteModal;
