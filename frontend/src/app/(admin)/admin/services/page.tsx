"use client";

import { useMemo, useState } from "react";
import PageHeader from "@/components/admin/PageHeader";
import DataTable, { Column } from "@/components/admin/DataTable";
import FormField from "@/components/admin/FormField";
import Modal, { ConfirmDeleteModal } from "@/components/admin/Modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockServices } from "@/lib/mock-data";
import { Service } from "@/types";
import { Landmark, Pencil, Trash2, FileDown } from "lucide-react";
import { format } from "date-fns";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
};

const OTHER_OPTION_VALUE = "__other__";

const buildUniqueOptions = (values: string[]) => {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean))).map(
    (value) => ({
      label: value,
      value,
    })
  );
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(mockServices);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formRequiredDocuments, setFormRequiredDocuments] = useState("");
  const [formProcessingTime, setFormProcessingTime] = useState("");
  const [formFee, setFormFee] = useState("0");
  const [formTemplateFile, setFormTemplateFile] = useState("");
  const [isCustomName, setIsCustomName] = useState(false);
  const [isCustomRequiredDocuments, setIsCustomRequiredDocuments] = useState(false);
  const [isCustomProcessingTime, setIsCustomProcessingTime] = useState(false);

  // Delete state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingService, setDeletingService] = useState<Service | null>(null);

  const serviceNameOptions = useMemo(
    () => buildUniqueOptions(services.map((service) => service.name)),
    [services]
  );

  const requiredDocumentOptions = useMemo(
    () => buildUniqueOptions(services.map((service) => service.requiredDocuments)),
    [services]
  );

  const processingTimeOptions = useMemo(
    () => buildUniqueOptions(services.map((service) => service.processingTime)),
    [services]
  );

  const hasOptionValue = (
    options: { label: string; value: string }[],
    value: string
  ) => {
    return options.some((option) => option.value === value);
  };

  const getSelectValue = (
    options: { label: string; value: string }[],
    value: string,
    isCustom: boolean
  ) => {
    if (isCustom) return OTHER_OPTION_VALUE;
    if (!value) return "";
    return hasOptionValue(options, value) ? value : OTHER_OPTION_VALUE;
  };

  // ---------- Handlers ----------

  const openCreateModal = () => {
    setEditingService(null);
    setFormName("");
    setFormDescription("");
    setFormRequiredDocuments("");
    setFormProcessingTime("");
    setFormFee("0");
    setFormTemplateFile("");
    setIsCustomName(false);
    setIsCustomRequiredDocuments(false);
    setIsCustomProcessingTime(false);
    setModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setFormName(service.name);
    setFormDescription(service.description);
    setFormRequiredDocuments(service.requiredDocuments);
    setFormProcessingTime(service.processingTime);
    setFormFee(String(service.fee));
    setFormTemplateFile(service.templateFile || "");
    setIsCustomName(!hasOptionValue(serviceNameOptions, service.name));
    setIsCustomRequiredDocuments(
      !hasOptionValue(requiredDocumentOptions, service.requiredDocuments)
    );
    setIsCustomProcessingTime(
      !hasOptionValue(processingTimeOptions, service.processingTime)
    );
    setModalOpen(true);
  };

  const handleNameSelect = (value: string) => {
    if (value === OTHER_OPTION_VALUE) {
      setIsCustomName(true);
      if (hasOptionValue(serviceNameOptions, formName)) {
        setFormName("");
      }
      return;
    }

    setIsCustomName(false);
    setFormName(value);
  };

  const handleRequiredDocumentsSelect = (value: string) => {
    if (value === OTHER_OPTION_VALUE) {
      setIsCustomRequiredDocuments(true);
      if (hasOptionValue(requiredDocumentOptions, formRequiredDocuments)) {
        setFormRequiredDocuments("");
      }
      return;
    }

    setIsCustomRequiredDocuments(false);
    setFormRequiredDocuments(value);
  };

  const handleProcessingTimeSelect = (value: string) => {
    if (value === OTHER_OPTION_VALUE) {
      setIsCustomProcessingTime(true);
      if (hasOptionValue(processingTimeOptions, formProcessingTime)) {
        setFormProcessingTime("");
      }
      return;
    }

    setIsCustomProcessingTime(false);
    setFormProcessingTime(value);
  };

  const handleSave = () => {
    if (
      !formName.trim() ||
      !formDescription.trim() ||
      !formRequiredDocuments.trim() ||
      !formProcessingTime.trim()
    ) {
      return;
    }

    const feeValue = Number(formFee);
    if (Number.isNaN(feeValue) || feeValue < 0) return;

    const now = new Date().toISOString();

    if (editingService) {
      setServices((prev) =>
        prev.map((s) =>
          s.id === editingService.id
            ? {
                ...s,
                name: formName.trim(),
                description: formDescription.trim(),
                requiredDocuments: formRequiredDocuments.trim(),
                processingTime: formProcessingTime.trim(),
                fee: feeValue,
                templateFile: formTemplateFile.trim() || undefined,
                updatedAt: now,
              }
            : s
        )
      );
    } else {
      const newService: Service = {
        id: String(Date.now()),
        name: formName.trim(),
        description: formDescription.trim(),
        requiredDocuments: formRequiredDocuments.trim(),
        processingTime: formProcessingTime.trim(),
        fee: feeValue,
        templateFile: formTemplateFile.trim() || undefined,
        createdAt: now,
        updatedAt: now,
      };
      setServices((prev) => [newService, ...prev]);
    }

    setModalOpen(false);
  };

  const openDeleteModal = (service: Service) => {
    setDeletingService(service);
    setDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (!deletingService) return;
    setServices((prev) => prev.filter((s) => s.id !== deletingService.id));
    setDeletingService(null);
  };

  // ---------- Table columns ----------

  const columns: Column<Service>[] = [
    {
      key: "name",
      label: "Tên dịch vụ",
      render: (item) => (
        <span className="font-medium text-stone-900">{item.name}</span>
      ),
    },
    {
      key: "description",
      label: "Mô tả",
      className: "max-w-sm",
      render: (item) => (
        <span className="text-stone-600 truncate block max-w-sm">
          {item.description}
        </span>
      ),
    },
    {
      key: "requiredDocuments",
      label: "Giấy tờ yêu cầu",
      className: "max-w-sm",
      render: (item) => (
        <span className="text-stone-600 truncate block max-w-sm">
          {item.requiredDocuments}
        </span>
      ),
    },
    {
      key: "processingTime",
      label: "Thời gian xử lý",
      render: (item) => <span className="text-stone-600">{item.processingTime}</span>,
    },
    {
      key: "fee",
      label: "Lệ phí",
      render: (item) => (
        <span className="text-stone-700 font-medium">{formatCurrency(item.fee)}</span>
      ),
    },
    {
      key: "templateFile",
      label: "Biểu mẫu",
      render: (item) =>
        item.templateFile ? (
          <Badge
            variant="secondary"
            className="gap-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          >
            <FileDown className="w-3 h-3" />
            {item.templateFile}
          </Badge>
        ) : (
          <span className="text-stone-400">&mdash;</span>
        ),
    },
    {
      key: "createdAt",
      label: "Ngày tạo",
      render: (item) => (
        <span className="text-stone-600 text-sm">
          {format(
            new Date(item.createdAt || new Date().toISOString()),
            "dd/MM/yyyy"
          )}
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
            onClick={() => openDeleteModal(item)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  // ---------- Render ----------

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Landmark}
        title="Dịch vụ công"
        description="Quản lý thủ tục hành chính"
        action={{ label: "Thêm dịch vụ", onClick: openCreateModal }}
      />

      <DataTable columns={columns} data={services} emptyMessage="Chưa có dịch vụ nào" />

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingService ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ mới"}
        description={
          editingService
            ? "Cập nhật thông tin dịch vụ hành chính"
            : "Điền thông tin để tạo dịch vụ hành chính mới"
        }
        size="lg"
        footer={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Hủy
            </Button>
            <Button
              className="bg-emerald-700 hover:bg-emerald-800 text-white"
              onClick={handleSave}
              disabled={
                !formName.trim() ||
                !formDescription.trim() ||
                !formRequiredDocuments.trim() ||
                !formProcessingTime.trim()
              }
            >
              {editingService ? "Cập nhật" : "Tạo mới"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4 rounded-xl border border-[hsl(120,10%,88%)] bg-[linear-gradient(180deg,hsl(45,30%,99%),hsl(45,24%,97%))] p-4 sm:p-5">
          <div className="pb-1">
            <p className="text-sm font-semibold text-stone-900">Thông tin dịch vụ</p>
            <p className="text-xs text-stone-500 mt-0.5">Các trường có dấu * là bắt buộc.</p>
          </div>

          <FormField
            type="select"
            label="Tên dịch vụ"
            name="nameSelect"
            required
            value={getSelectValue(serviceNameOptions, formName, isCustomName)}
            onChange={handleNameSelect}
            placeholder="Chọn tên dịch vụ"
            options={[
              ...serviceNameOptions,
              { label: "Khác", value: OTHER_OPTION_VALUE },
            ]}
          />
          {isCustomName && (
            <FormField
              type="text"
              label="Tên dịch vụ khác"
              name="name"
              required
              value={formName}
              onChange={setFormName}
              placeholder="Nhập tên dịch vụ hành chính"
            />
          )}
          <FormField
            type="textarea"
            label="Mô tả"
            name="description"
            required
            value={formDescription}
            onChange={setFormDescription}
            placeholder="Mô tả chi tiết về dịch vụ"
            rows={4}
          />
          <FormField
            type="select"
            label="Giấy tờ yêu cầu"
            name="requiredDocumentsSelect"
            required
            value={getSelectValue(
              requiredDocumentOptions,
              formRequiredDocuments,
              isCustomRequiredDocuments
            )}
            onChange={handleRequiredDocumentsSelect}
            placeholder="Chọn loại giấy tờ"
            options={[
              ...requiredDocumentOptions,
              { label: "Khác", value: OTHER_OPTION_VALUE },
            ]}
          />
          {isCustomRequiredDocuments && (
            <FormField
              type="textarea"
              label="Giấy tờ yêu cầu khác"
              name="requiredDocuments"
              required
              value={formRequiredDocuments}
              onChange={setFormRequiredDocuments}
              placeholder="Liệt kê giấy tờ cần nộp"
              rows={3}
            />
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-4">
              <FormField
                type="select"
                label="Thời gian xử lý"
                name="processingTimeSelect"
                required
                value={getSelectValue(
                  processingTimeOptions,
                  formProcessingTime,
                  isCustomProcessingTime
                )}
                onChange={handleProcessingTimeSelect}
                placeholder="Chọn thời gian xử lý"
                options={[
                  ...processingTimeOptions,
                  { label: "Khác", value: OTHER_OPTION_VALUE },
                ]}
              />
              {isCustomProcessingTime && (
                <FormField
                  type="text"
                  label="Thời gian xử lý khác"
                  name="processingTime"
                  required
                  value={formProcessingTime}
                  onChange={setFormProcessingTime}
                  placeholder="VD: 03 ngày làm việc"
                />
              )}
            </div>
            <FormField
              type="number"
              label="Lệ phí (VND)"
              name="fee"
              required
              value={formFee}
              onChange={setFormFee}
              placeholder="0"
            />
          </div>
          <FormField
            type="text"
            label="Tên file biểu mẫu"
            name="templateFile"
            value={formTemplateFile}
            onChange={setFormTemplateFile}
            placeholder="VD: khai-sinh-form.docx (không bắt buộc)"
          />
        </div>
      </Modal>

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        itemName={deletingService?.name}
      />
    </div>
  );
}
