"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FileDown, Landmark, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";

import PageHeader from "@/components/admin/PageHeader";
import DataTable, { Column } from "@/components/admin/DataTable";
import FormField from "@/components/admin/FormField";
import Modal, { ConfirmDeleteModal } from "@/components/admin/Modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getErrorMessage } from "@/services/admin/errors";
import { Service } from "@/types";
import {
  createService,
  deleteService,
  fetchServicesAdmin,
  updateService,
} from "@/services/admin/services";

interface ServiceFormState {
  name: string;
  description: string;
  requiredDocuments: string;
  processingTime: string;
  fee: string;
  templateFile: string;
}

const emptyForm: ServiceFormState = {
  name: "",
  description: "",
  requiredDocuments: "",
  processingTime: "",
  fee: "0",
  templateFile: "",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<ServiceFormState>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setServices(await fetchServicesAdmin());
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadServices();
  }, [loadServices]);

  const totalFee = useMemo(
    () => services.reduce((sum, service) => sum + Number(service.fee || 0), 0),
    [services],
  );

  const openCreateModal = () => {
    setEditingService(null);
    setFormData(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      requiredDocuments: service.requiredDocuments,
      processingTime: service.processingTime,
      fee: String(service.fee),
      templateFile: service.templateFile || "",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingService(null);
    setFormData(emptyForm);
  };

  const handleSave = async () => {
    const fee = Number(formData.fee);
    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.requiredDocuments.trim() ||
      !formData.processingTime.trim() ||
      Number.isNaN(fee) ||
      fee < 0
    ) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const payload = {
        name: formData.name,
        description: formData.description,
        requiredDocuments: formData.requiredDocuments,
        processingTime: formData.processingTime,
        fee,
        templateFile: formData.templateFile,
      };

      if (editingService) {
        await updateService(editingService.id, payload);
      } else {
        await createService(payload);
      }

      await loadServices();
      closeModal();
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      setError("");
      await deleteService(deleteTarget.id);
      await loadServices();
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    } finally {
      setDeleteTarget(null);
    }
  };

  const columns: Column<Service>[] = [
    {
      key: "name",
      label: "Tên dịch vụ",
      render: (item) => <span className="font-medium text-stone-900">{item.name}</span>,
    },
    {
      key: "description",
      label: "Mô tả",
      className: "max-w-sm",
      render: (item) => <span className="block max-w-sm truncate text-stone-600">{item.description}</span>,
    },
    {
      key: "requiredDocuments",
      label: "Hồ sơ yêu cầu",
      className: "max-w-sm",
      render: (item) => (
        <span className="block max-w-sm truncate text-stone-600">{item.requiredDocuments}</span>
      ),
    },
    {
      key: "processingTime",
      label: "Thời gian",
      render: (item) => <span className="text-stone-600">{item.processingTime}</span>,
    },
    {
      key: "fee",
      label: "Lệ phí",
      render: (item) => <span className="font-medium text-stone-700">{formatCurrency(item.fee)}</span>,
    },
    {
      key: "templateFile",
      label: "Biểu mẫu",
      render: (item) =>
        item.templateFile ? (
          <a href={item.templateFile} target="_blank" rel="noreferrer">
            <Badge className="gap-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
              <FileDown className="h-3 w-3" />
              Tải file
            </Badge>
          </a>
        ) : (
          <span className="text-stone-400">--</span>
        ),
    },
    {
      key: "createdAt",
      label: "Cập nhật",
      render: (item) => (
        <span className="text-sm text-stone-500">
          {format(new Date(item.updatedAt || item.createdAt || new Date().toISOString()), "dd/MM/yyyy")}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Thao tác",
      render: (item) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-stone-500 hover:text-emerald-700 hover:bg-emerald-50"
            onClick={() => openEditModal(item)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-stone-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => setDeleteTarget(item)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Landmark}
        title="Dịch vụ công"
        description={loading ? "Đang tải dịch vụ..." : `${services.length} dịch vụ, tổng lệ phí tham khảo ${formatCurrency(totalFee)}`}
        action={{ label: "Thêm dịch vụ", onClick: openCreateModal }}
      />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={services}
        emptyMessage={loading ? "Đang tải dữ liệu..." : "Chưa có dịch vụ nào"}
      />

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingService ? "Cập nhật dịch vụ" : "Thêm dịch vụ mới"}
        description="Dữ liệu được lưu trực tiếp vào API services."
        size="lg"
        footer={
          <div className="flex gap-2">
            <Button variant="outline" onClick={closeModal}>
              Hủy
            </Button>
            <Button
              className="bg-emerald-700 hover:bg-emerald-800 text-white"
              onClick={handleSave}
              disabled={submitting}
            >
              {editingService ? "Cập nhật" : "Tạo mới"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <FormField
            type="text"
            label="Tên dịch vụ"
            name="name"
            required
            value={formData.name}
            onChange={(value) => setFormData((prev) => ({ ...prev, name: value }))}
            placeholder="Nhập tên dịch vụ"
          />
          <FormField
            type="textarea"
            label="Mô tả"
            name="description"
            required
            value={formData.description}
            onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
            placeholder="Mô tả chi tiết dịch vụ"
            rows={4}
          />
          <FormField
            type="textarea"
            label="Hồ sơ yêu cầu"
            name="requiredDocuments"
            required
            value={formData.requiredDocuments}
            onChange={(value) => setFormData((prev) => ({ ...prev, requiredDocuments: value }))}
            placeholder="Co the cach nhau bang dau phay, dau cham phay hoac xuong dong"
            rows={3}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              type="text"
              label="Thời gian xử lý"
              name="processingTime"
              required
              value={formData.processingTime}
              onChange={(value) => setFormData((prev) => ({ ...prev, processingTime: value }))}
              placeholder="VD: 03 ngày làm việc"
            />
            <FormField
              type="number"
              label="Lệ phí"
              name="fee"
              required
              value={formData.fee}
              onChange={(value) => setFormData((prev) => ({ ...prev, fee: value }))}
              placeholder="0"
            />
          </div>
          <FormField
            type="text"
            label="Link file biểu mẫu"
            name="templateFile"
            value={formData.templateFile}
            onChange={(value) => setFormData((prev) => ({ ...prev, templateFile: value }))}
            placeholder="/uploads/file.docx hoặc URL đầy đủ"
          />
        </div>
      </Modal>

      <ConfirmDeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={deleteTarget?.name}
      />
    </div>
  );
}
