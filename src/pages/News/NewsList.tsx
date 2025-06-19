"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import NewsCard from "./NewsCard";
import NewsFormModal from "./NewsFormModal";
import { useNewsStore, type NewsItem } from "@/stores/news";
import { NewsDeleteModal } from "./NewsDeleteModal";
import Pagination from "@/components/pagination/pagination";


const NewsList = () => {
    const { news, fetchNews, meta } = useNewsStore();
    const [selected, setSelected] = useState<NewsItem | null>(null);
    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [mode, setMode] = useState<"create" | "edit">("create");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchNews(currentPage);
    }, [currentPage]);

    const handleCreate = () => {
        setMode("create");
        setSelected(null);
        setFormOpen(true);
    };

    const handleEdit = (item: NewsItem) => {
        setMode("edit");
        setSelected(item);
        setFormOpen(true);
    };

    const handleDelete = (item: NewsItem) => {
        setSelected(item);
        setDeleteOpen(true);
    };

    return (
        <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">News</h1>
                <Button disabled={formOpen} onClick={handleCreate}>
                    + Create News
                </Button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {news?.map((item) => (
                    <NewsCard
                        key={item.id}
                        news={item}
                        onEdit={() => handleEdit(item)}
                        onDelete={() => handleDelete(item)}
                    />
                ))}
            </div>

            {meta && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={meta.totalPages}
                    onPageChange={setCurrentPage}
                />
            )}

            <NewsFormModal
                open={formOpen}
                setOpen={setFormOpen}
                mode={mode}
                news={selected}
            />

            <NewsDeleteModal
                open={deleteOpen}
                setOpen={setDeleteOpen}
                newsId={selected?.id}
            />
        </div>
    );
};

export default NewsList;
