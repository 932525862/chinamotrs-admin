"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { usePartnerStore, type Partner } from "@/stores/partner";
import PartnerCard from "./PartnerCard";
import PartnerDeleteModal from "./PartnerDeleteModal";
import PartnerFormModal from "./PartnerForm";

const PartnerList = () => {
    const { partners, fetchPartners } = usePartnerStore();

    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selected, setSelected] = useState<Partner | null>(null);
    const [mode, setMode] = useState<"create" | "edit">("create");

    useEffect(() => {
        fetchPartners();
    }, []);

    return (
        <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Partners</h2>
                <Button
                    onClick={() => {
                        setSelected(null);
                        setMode("create");
                        setFormOpen(true);
                    }}
                >
                    Add Partner
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {partners.map((partner) => (
                    <PartnerCard
                        key={partner.id}
                        partner={partner}
                        onEdit={(p) => {
                            setSelected(p);
                            setMode("edit");
                            setFormOpen(true);
                        }}
                        onDelete={(p) => {
                            setSelected(p);
                            setDeleteOpen(true);
                        }}
                    />
                ))}
            </div>

            <PartnerFormModal
                open={formOpen}
                setOpen={setFormOpen}
                mode={mode}
                partnerId={selected?.id ?? null}
            />

            <PartnerDeleteModal
                open={deleteOpen}
                setOpen={setDeleteOpen}
                partner={selected}
            />
        </div>
    );
};

export default PartnerList;
