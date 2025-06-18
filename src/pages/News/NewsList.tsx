import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import NewsCard from "./NewsCard";
import NewsFormModal from "./NewsFormModal";
import NewsDeleteModal from "./NewsDeleteModal";
import { useNewsStore, type NewsItem } from "@/stores/news";

const NewsList = () => {
    const { news, fetchNews } = useNewsStore();
    const [selected, setSelected] = useState<NewsItem | null>(null);
    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [mode, setMode] = useState<"create" | "edit">("create");

    useEffect(() => {
        fetchNews();
    }, []);

    return (
        <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">News</h1>
                <Button onClick={() => {
                    setMode("create");
                    setSelected(null);
                    setFormOpen(true);
                }}>+ Create News</Button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {news && Array.from(news).map(item => (
                    <NewsCard
                        key={item.id}
                        news={item}
                        onEdit={() => {
                            setMode("edit");
                            setSelected(item);
                            setFormOpen(true);
                        }}
                        onDelete={() => {
                            setSelected(item);
                            setDeleteOpen(true);
                        }}
                    />
                ))}
            </div>

            <NewsFormModal open={formOpen} setOpen={setFormOpen} mode={mode} news={selected} />
            <NewsDeleteModal open={deleteOpen} setOpen={setDeleteOpen} newsId={selected?.id} />
        </div>
    );
};

export default NewsList;
