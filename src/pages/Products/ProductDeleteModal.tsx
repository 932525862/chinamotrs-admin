import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner"; // ✅ Import toast
import { useState } from "react";

interface Props {
    open: boolean;
    onCancel: () => void;
    onConfirm: () => Promise<void>; // ✅ Make onConfirm async
}

const ProductDeleteDialog = ({ open, onCancel, onConfirm }: Props) => {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await onConfirm();
            toast.success("Product deleted successfully");
        } catch (err: any) {
            toast.error("Failed to delete product: " + (err.message || err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onCancel}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you sure you want to delete this product?
                    </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading} onClick={onCancel}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction disabled={loading} onClick={handleConfirm}>
                        {loading ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ProductDeleteDialog;
