import { useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCategoryStore, type Category } from "@/stores/category";
import { toast } from "sonner"; // ✅ Import toast

type Props = {
    open: boolean;
    setOpen: (value: boolean) => void;
    mode: "create" | "edit";
    category: Category | null;
};

const CategoryFormModal = ({ open, setOpen, mode, category }: Props) => {
    const {
        name,
        setName,
        createCategory,
        updateCategory,
        getCategoryById,
    } = useCategoryStore();

    useEffect(() => {
        if (mode === "edit" && category) {
            getCategoryById(category.id);
        } else if (mode === "create") {
            setName("uz", "");
            setName("ru", "");
        }
    }, [mode, category]);

    const handleSubmit = async () => {
        try {
            if (mode === "create") {
                await createCategory();
                toast.success("Category created successfully!");
            } else if (category) {
                await updateCategory(category.id);
                toast.success("Category updated successfully!");
            }
            setOpen(false);
        } catch (err: any) {
            toast.error("Something went wrong: " + (err.message || err));
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {mode === "create" ? "Create Category" : "Edit Category"}
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 pt-2">
                    <div className="grid gap-1">
                        <Label htmlFor="uz">Name (uz)</Label>
                        <Input
                            id="uz"
                            value={name.uz}
                            onChange={(e) => setName("uz", e.target.value)}
                        />
                    </div>

                    <div className="grid gap-1">
                        <Label htmlFor="ru">Name (ru)</Label>
                        <Input
                            id="ru"
                            value={name.ru}
                            onChange={(e) => setName("ru", e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit}>
                            {mode === "create" ? "Create" : "Update"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CategoryFormModal;
