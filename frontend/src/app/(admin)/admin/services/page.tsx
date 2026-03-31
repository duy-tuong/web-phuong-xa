"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FileDown, Landmark, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import PageHeader from "@/components/admin/PageHeader";
import DataTable, { Column } from "@/components/admin/DataTable";
import FormField from "@/components/admin/FormField";
import Modal, { ConfirmDeleteModal } from "@/components/admin/Modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Service } from "@/types";
import api from "@/services/api";

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

type ServiceApi = {
  id?: number | string;
  Id?: number | string;
  name?: string;
  Name?: string;
  description?: string;
  Description?: string;
  requiredDocuments?: string;
  RequiredDocuments?: string;
  processingTime?: string;
  ProcessingTime?: string;
  fee?: number;
  Fee?: number;
  templateFile?: string | null;
  TemplateFile?: string | null;
};

const resolvePublicUrl = (value: string) => {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }
  const base = api.defaults.baseURL ?? "";
  const origin = base.replace(/\/api\/?$/, "");
  return origin ? `${origin}${value}` : value;
};

const getTemplateLabel = (value: string) => {
  if (!value) return "";
  const clean = value.split("?")[0];
  const parts = clean.split("/");
  return parts[parts.length - 1] || value;
};

export default function ServicesPage() {
  const [adminRole, setAdminRole] = useState<string | null>(null);

  useEffect(() => {
    setAdminRole(localStorage.getItem("admin_role"));
  }, []);

  const isEditor = adminRole === "Editor";

  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingTemplate, setIsUploadingTemplate] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<ServiceFormState>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [formTemplateName, setFormTemplateName] = useState("");
  const templateInputRef = useRef<HTMLInputElement | null>(null);

  // ---------- Handlers ----------

  const openCreateModal = () => {
    setEditingService(null);
    setFormData(emptyForm);
    setFormTemplateName("");
    setModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      requiredDocuments: service.requiredDocuments,
      processingTime: service.processingTime,
      fee: String(service.fee ?? 0),
      templateFile: service.templateFile || "",
    });
    setFormTemplateName(getTemplateLabel(service.templateFile || ""));
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingService(null);
    setFormData(emptyForm);
    setFormTemplateName("");
  };

  const fetchServices = async () => {
    const res = await api.get("/services");
    const data = Array.isArray(res.data) ? (res.data as ServiceApi[]) : [];
    const mapped = data.map((service) => ({
      id: String(service.id ?? service.Id ?? ""),
      name: service.name ?? service.Name ?? "",
      description: service.description ?? service.Description ?? "",
      requiredDocuments:
        service.requiredDocuments ?? service.RequiredDocuments ?? "",
      processingTime: service.processingTime ?? service.ProcessingTime ?? "",
      fee: Number(service.fee ?? service.Fee ?? 0),
      templateFile: service.templateFile ?? service.TemplateFile ?? undefined,
      createdAt: new Date().toISOString(),
    })) as Service[];
    setServices(mapped);
  };

  const totalPages = Math.max(1, Math.ceil(services.length / pageSize));

  const pagedServices = useMemo(() => {
    const start = (page - 1) * pageSize;
    return services.slice(start, start + pageSize);
  }, [services, page, pageSize]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        await fetchServices();
      } catch {
        if (!mounted) return;
        setErrorMessage("Không thể tải danh sách dịch vụ.");
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSave = async () => {
    const feeValue = Number(formData.fee);
    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.requiredDocuments.trim() ||
      !formData.processingTime.trim() ||
      Number.isNaN(feeValue) ||
      feeValue < 0
    ) {
      setErrorMessage("Vui lòng kiểm tra lại thông tin dịch vụ.");
      return;
    }

    setErrorMessage("");
    setIsSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        requiredDocuments: formData.requiredDocuments.trim(),
        processingTime: formData.processingTime.trim(),
        fee: feeValue,
        templateFile: formData.templateFile.trim() || null,
      };

      if (editingService) {
        await api.put(`/services/${editingService.id}`, payload);
      } else {
        await api.post("/services", payload);
      }

      await fetchServices();
      closeModal();
    } catch {
      setErrorMessage("Lưu dịch vụ thất bại.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTemplateUpload = async (file: File) => {
    setErrorMessage("");
    setIsUploadingTemplate(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/media/upload", formData);
      const url = res.data?.url as string | undefined;
      if (!url) {
        throw new Error("Upload failed");
      }
      setFormData((prev) => ({ ...prev, templateFile: url }));
      setFormTemplateName(file.name);
    } catch {
      setErrorMessage("Tải biểu mẫu thất bại.");
    } finally {
      setIsUploadingTemplate(false);
    }
  };

  const handleTemplateChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    await handleTemplateUpload(files[0]);
    event.target.value = "";
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setErrorMessage("");
    setIsSaving(true);
    try {
      await api.delete(`/services/${deleteTarget.id}`);
      await fetchServices();
      setDeleteTarget(null);
    } catch {
      setErrorMessage("Xóa dịch vụ thất bại.");
    } finally {
      setIsSaving(false);
    }
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
        <span className="block max-w-sm truncate text-stone-600">
          {item.description}
        </span>
      ),
    },
    {
      key: "requiredDocuments",
      label: "Hồ sơ yêu cầu",
      className: "max-w-sm",
      render: (item) => (
        <span className="block max-w-sm truncate text-stone-600">
          {item.requiredDocuments}
        </span>
      ),
    },
    {
      key: "processingTime",
      label: "Thời gian xử lý",
      render: (item) => (
        <span className="text-stone-600">{item.processingTime}</span>
      ),
    },
    {
      key: "fee",
      label: "Lệ phí",
      render: (item) => (
        <span className="text-stone-700 font-medium">
          {formatCurrency(item.fee)}
        </span>
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
            <a
              href={resolvePublicUrl(item.templateFile)}
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              {getTemplateLabel(item.templateFile)}
            </a>
          </Badge>
        ) : (
          <span className="text-stone-400">--</span>
        ),
    },
    {
      key: "createdAt",
      label: "Cập nhật",
      render: (item) => (
        <span className="text-stone-600 text-sm">
          {format(
            new Date(item.createdAt || new Date().toISOString()),
            "dd/MM/yyyy",
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
          {isEditor ? null : (
            <Button
              variant="ghost"
              size="sm"
              className="text-stone-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => setDeleteTarget(item)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {errorMessage ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}
      <PageHeader
        icon={Landmark}
        title="Dịch vụ công"
        description="Quản lý thủ tục hành chính"
        action={
          isLoading
            ? undefined
            : { label: "Thêm dịch vụ", onClick: openCreateModal }
        }
      />

      <DataTable
        columns={columns}
        data={pagedServices}
        emptyMessage={isLoading ? "Đang tải dịch vụ..." : "Chưa có dịch vụ nào"}
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="text-sm text-stone-500">
          Trang {page} / {totalPages} • {services.length} kết quả
        </div>
        <div className="flex items-center gap-2">
          <select
            className="h-9 rounded-md border border-stone-200 bg-white px-2 text-sm"
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setPage(1);
            }}
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size} / trang
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page <= 1}
          >
            Trước
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page >= totalPages}
          >
            Sau
          </Button>
        </div>
      </div>

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
              disabled={
                isSaving ||
                !formData.name.trim() ||
                !formData.description.trim() ||
                !formData.requiredDocuments.trim() ||
                !formData.processingTime.trim()
              }
            >
              {isSaving
                ? "Đang lưu..."
                : editingService
                  ? "Cập nhật"
                  : "Tạo mới"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4 rounded-xl border border-[hsl(120,10%,88%)] bg-[linear-gradient(180deg,hsl(45,30%,99%),hsl(45,24%,97%))] p-4 sm:p-5">
          <div className="pb-1">
            <p className="text-sm font-semibold text-stone-900">
              Thông tin dịch vụ
            </p>
            <p className="text-xs text-stone-500 mt-0.5">
              Các trường có dấu * là bắt buộc.
            </p>
          </div>

          <FormField
            type="text"
            label="Tên dịch vụ"
            name="name"
            required
            value={formData.name}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, name: value }))
            }
            placeholder="Nhập tên dịch vụ hành chính"
          />
          <FormField
            type="textarea"
            label="Mô tả"
            name="description"
            required
            value={formData.description}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, description: value }))
            }
            placeholder="Mô tả chi tiết dịch vụ"
            rows={4}
          />
          <FormField
            type="textarea"
            label="Giấy tờ yêu cầu"
            name="requiredDocuments"
            required
            value={formData.requiredDocuments}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, requiredDocuments: value }))
            }
            placeholder="Liệt kê giấy tờ cần nộp"
            rows={3}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              type="text"
              label="Thời gian xử lý"
              name="processingTime"
              required
              value={formData.processingTime}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, processingTime: value }))
              }
              placeholder="VD: 03 ngày làm việc"
            />
            <FormField
              type="number"
              label="Lệ phí"
              name="fee"
              required
              value={formData.fee}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, fee: value }))
              }
              placeholder="0"
            />
          </div>
          <FormField
            type="text"
            label="Đường dẫn biểu mẫu"
            name="templateFile"
            value={formData.templateFile}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, templateFile: value }))
            }
            placeholder="/uploads/file.docx hoặc URL đầy đủ"
          />
          <div className="space-y-1.5">
            <label
              className="text-sm font-medium text-stone-700"
              htmlFor="templateName"
            >
              Tên file biểu mẫu
            </label>
            <Input
              id="templateName"
              value={formTemplateName}
              readOnly
              placeholder="Tự động theo file upload"
              className="border-stone-200 bg-stone-50 text-stone-600"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700">
              Tải biểu mẫu
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={templateInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleTemplateChange}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => templateInputRef.current?.click()}
                disabled={isUploadingTemplate}
              >
                {isUploadingTemplate ? "Đang tải..." : "Chọn file biểu mẫu"}
              </Button>
              {formData.templateFile ? (
                <a
                  href={resolvePublicUrl(formData.templateFile)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-emerald-700 hover:underline"
                >
                  {getTemplateLabel(formData.templateFile)}
                </a>
              ) : null}
            </div>
            <p className="text-xs text-stone-500">
              Hỗ trợ PDF, DOC, DOCX (tối đa 5MB).
            </p>
          </div>
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
