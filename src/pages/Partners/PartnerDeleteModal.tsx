import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePartnerStore } from "@/stores/partner";
import type { Partner } from "@/stores/partner";

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    partner: Partner | null;
};

const PartnerDeleteModal = ({ open, setOpen, partner }: Props) => {
    const { deletePartner } = usePartnerStore();

    const handleDelete = async () => {
        if (partner) {
            await deletePartner(partner.id);
            setOpen(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Partner</DialogTitle>
                </DialogHeader>
                <p>Are you sure you want to delete this partner?</p>
                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PartnerDeleteModal;
