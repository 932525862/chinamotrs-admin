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
import { useNewsStore, type NewsItem } from "@/stores/news";

type Props = {
    open: boolean;
    setOpen: (value: boolean) => void;
    mode: "create" | "edit";
    news: NewsItem | null;
};

const NewsFormModal = ({ open, setOpen, mode, news }: Props) => {
    const {
        text,
        setText,
        setImage,
        image,
        createNews,
        updateNews,
        getNewsById,
        selectedNews,
    } = useNewsStore();

    // Reset or load data based on mode
    useEffect(() => {
        if (mode === "edit" && news) {
            getNewsById(news.id);
        } else if (mode === "create") {
            resetFields();
        }
    }, [mode, news]);

    // Revoke object URLs to prevent memory leaks
    useEffect(() => {
        let preview: string | null = null;
        if (image) {
            preview = URL.createObjectURL(image);
        }
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [image]);

    const resetFields = () => {
        setText("uz", "");
        setText("ru", "");
        setImage(new File([], ""));
    };

    const handleSubmit = async () => {
        try {
            if (mode === "create") {
                await createNews();
                resetFields(); // ✅ clear inputs after creation
            } else if (news) {
                await updateNews(news.id);
            }
            setOpen(false);
        } catch (err) {
            alert("Something went wrong. " + err);
        }
    };

    const previewImage = image
        ? URL.createObjectURL(image)
        : selectedNews?.imageUrl;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {mode === "create" ? "Create News" : "Edit News"}
                    </DialogTitle>
                </DialogHeader>

                {previewImage && (
                    <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-md mb-2"
                    />
                )}

                <div className="grid gap-4 pt-2">
                    <div className="grid gap-1">
                        <Label htmlFor="image">Image</Label>
                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                if (e.target.files?.[0]) {
                                    setImage(e.target.files[0]);
                                }
                            }}
                        />
                    </div>

                    <div className="grid gap-1">
                        <Label htmlFor="uz">Text (uz)</Label>
                        <Input
                            id="uz"
                            value={text.uz}
                            onChange={(e) => setText("uz", e.target.value)}
                        />
                    </div>

                    <div className="grid gap-1">
                        <Label htmlFor="ru">Text (ru)</Label>
                        <Input
                            id="ru"
                            value={text.ru}
                            onChange={(e) => setText("ru", e.target.value)}
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

export default NewsFormModal;
