// CategoryList.tsx (replaces table view with list)
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCategoryStore, type Category } from "@/stores/category";
import CategoryFormModal from "./CategoryFormModal";
import { Trash2, Pencil } from "lucide-react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

const CategoryList = () => {
    const {
        categories,
        fetchCategories,
        deleteCategory,
    } = useCategoryStore();

    const [openForm, setOpenForm] = useState(false);
    const [mode, setMode] = useState<"create" | "edit">("create");
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(
        null
    );
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleEdit = (category: Category) => {
        setSelectedCategory(category);
        setMode("edit");
        setOpenForm(true);
    };

    const handleDelete = (category: Category) => {
        setSelectedCategory(category);
        setOpenDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (selectedCategory) {
            await deleteCategory(selectedCategory.id);
            setOpenDeleteModal(false);
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Categories</h2>
                <Button
                    onClick={() => {
                        setMode("create");
                        setSelectedCategory(null);
                        setOpenForm(true);
                    }}
                >
                    Add Category
                </Button>
            </div>

            <div className="grid gap-2">
                {categories.map((cat) => (
                    <div
                        key={cat.id}
                        className="flex justify-between items-center bg-white shadow-sm rounded-lg px-4 py-2"
                    >
                        <div>
                            <div className="font-medium">{cat.name.uz}</div>
                            <div className="text-sm text-muted-foreground">{cat.name.ru}</div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleEdit(cat)}
                            >
                                <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => handleDelete(cat)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <CategoryFormModal
                open={openForm}
                setOpen={setOpenForm}
                mode={mode}
                category={selectedCategory}
            />

            <ConfirmDeleteModal
                open={openDeleteModal}
                setOpen={setOpenDeleteModal}
                onConfirm={confirmDelete}
                title="Delete Category"
                description="Are you sure you want to delete this category?"
            />
        </div>
    );
};

export default CategoryList;