"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createPackage, updatePackage } from "@/lib/actions/package.actions";
import { createService } from "@/lib/actions/service.actions";
import { Service, Package } from "@/lib/types";
import { useTranslations } from "next-intl";
import { Check, Clock, Banknote, Plus, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddPackageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPackageAdded: () => void;
  services: Service[];
  onServicesChanged?: () => Promise<void>;
  editingPackage?: Package | null;
}

const emptyForm = {
  name: "",
  description: "",
  category: "other",
  gender: "mixte",
  price: "",
  advance: "",
  scheduledDate: "",
  selectedServices: [] as string[],
};

export function AddPackageModal({
  open,
  onOpenChange,
  onPackageAdded,
  services,
  onServicesChanged,
  editingPackage,
}: AddPackageModalProps) {
  const t = useTranslations("packages");
  const tCommon = useTranslations("common");
  const isEditing = !!editingPackage;

  const [formData, setFormData] = useState(emptyForm);

  // Populate form when editing
  React.useEffect(() => {
    if (open && editingPackage) {
      setFormData({
        name: editingPackage.name,
        description: editingPackage.description || "",
        category: editingPackage.category || "other",
        gender: editingPackage.gender || "mixte",
        price: String(editingPackage.price),
        advance: editingPackage.advance ? String(editingPackage.advance) : "",
        scheduledDate: editingPackage.scheduledDate || "",
        selectedServices: editingPackage.services || [],
      });
    } else if (!open) {
      setFormData(emptyForm);
    }
  }, [open, editingPackage]);

  const [loading, setLoading] = useState(false);
  const [showAddService, setShowAddService] = useState(false);
  const [newService, setNewService] = useState({ name: "", price: "" });
  const [addingService, setAddingService] = useState(false);

  const toggleService = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(id)
        ? prev.selectedServices.filter((s) => s !== id)
        : [...prev.selectedServices, id],
    }));
  };

  const handleAddService = async () => {
    if (!newService.name || !newService.price) return;

    setAddingService(true);
    try {
      const created = await createService({
        name: newService.name,
        price: parseFloat(newService.price),
      });
      setNewService({ name: "", price: "" });
      setShowAddService(false);
      if (onServicesChanged) await onServicesChanged();
      // Auto-select the newly created service
      setFormData((prev) => ({
        ...prev,
        selectedServices: [...prev.selectedServices, created.id],
      }));
    } catch {
      alert("Failed to create service");
    } finally {
      setAddingService(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.price ||
      formData.selectedServices.length === 0
    ) {
      alert(
        "Please fill in all required fields and select at least one service",
      );
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        gender: formData.gender,
        price: parseFloat(formData.price),
        advance: formData.advance ? parseFloat(formData.advance) : undefined,
        scheduledDate: formData.scheduledDate || undefined,
        services: formData.selectedServices,
      };

      if (isEditing && editingPackage) {
        await updatePackage(editingPackage.id, payload);
      } else {
        await createPackage(payload);
      }

      onOpenChange(false);
      onPackageAdded();
    } catch (err) {
      console.error(err);
      alert("Failed to create package");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? t("editPackage") : t("addPackage")}
      description={t("subtitle")}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Input
              label={tCommon("name") + " *"}
              placeholder={t("namePlaceholder")}
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />

            <Textarea
              label={tCommon("description")}
              placeholder="What's included in this package..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <Input
              label={tCommon("price") + " (د.ت) *"}
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              required
            />

            <Input
              label={t("advance") + " (د.ت)"}
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={formData.advance}
              onChange={(e) =>
                setFormData({ ...formData, advance: e.target.value })
              }
            />

            <div className="w-full">
              <label className="block text-sm font-semibold text-foreground-secondary mb-2">
                {t("scheduledDate")}
              </label>
              <div
                className={cn(
                  "relative flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all",
                  formData.scheduledDate
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-border-focus bg-card",
                )}
                onClick={() => {
                  const input = document.getElementById("scheduled-date-input");
                  if (input) (input as HTMLInputElement).showPicker();
                }}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                    formData.scheduledDate
                      ? "bg-primary/15 text-primary"
                      : "bg-secondary text-foreground-muted",
                  )}
                >
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  {formData.scheduledDate ? (
                    <>
                      <p className="text-sm font-semibold text-foreground">
                        {new Date(
                          formData.scheduledDate + "T00:00:00",
                        ).toLocaleDateString(undefined, {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-foreground-muted mt-0.5">
                        {t("scheduledDate")}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-foreground-muted">
                      {t("selectDate")}
                    </p>
                  )}
                </div>
                {formData.scheduledDate && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormData({ ...formData, scheduledDate: "" });
                    }}
                    className="text-foreground-muted hover:text-destructive transition-colors p-1"
                  >
                    <span className="text-lg leading-none">&times;</span>
                  </button>
                )}
              </div>
              <input
                id="scheduled-date-input"
                type="date"
                value={formData.scheduledDate}
                onChange={(e) =>
                  setFormData({ ...formData, scheduledDate: e.target.value })
                }
                className="sr-only"
                tabIndex={-1}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-foreground-secondary">
                {t("selectServices")} *
              </label>
              <button
                type="button"
                onClick={() => setShowAddService(!showAddService)}
                className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                {tCommon("add")}
              </button>
            </div>

            {/* Inline Add Service Form */}
            {showAddService && (
              <div className="p-3 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 space-y-2">
                <Input
                  label=""
                  placeholder={tCommon("name")}
                  value={newService.name}
                  onChange={(e) =>
                    setNewService({ ...newService, name: e.target.value })
                  }
                />
                <Input
                  label=""
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder={tCommon("price") + " (د.ت)"}
                  value={newService.price}
                  onChange={(e) =>
                    setNewService({ ...newService, price: e.target.value })
                  }
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowAddService(false);
                      setNewService({ name: "", price: "" });
                    }}
                    className="flex-1 py-2 text-xs"
                    disabled={addingService}
                  >
                    {tCommon("cancel")}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleAddService}
                    className="flex-1 py-2 text-xs"
                    disabled={addingService || !newService.name || !newService.price}
                  >
                    {addingService ? tCommon("saving") : tCommon("add")}
                  </Button>
                </div>
              </div>
            )}

            <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
              {services.map((service) => {
                const isSelected = formData.selectedServices.includes(
                  service.id,
                );
                return (
                  <div
                    key={service.id}
                    onClick={() => toggleService(service.id)}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl border-2 transition-all cursor-pointer",
                      isSelected
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-border-focus bg-card",
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {service.name}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-foreground-muted flex items-center gap-1">
                          <Banknote className="w-3 h-3" />
                          {service.price}
                        </span>
                        <span className="text-xs text-foreground-muted flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {service.duration} {tCommon("minutes")}
                        </span>
                      </div>
                    </div>
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                        isSelected
                          ? "bg-primary border-primary"
                          : "border-border-focus",
                      )}
                    >
                      {isSelected && <Check className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t border-border">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
            className="flex-1 py-6 text-base"
            disabled={loading}
          >
            {tCommon("cancel")}
          </Button>
          <Button
            type="submit"
            className="flex-1 py-6 text-base"
            disabled={loading}
          >
            {loading ? tCommon("saving") : isEditing ? tCommon("save") : t("addPackage")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
