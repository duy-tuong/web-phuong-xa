// ==================== Roles ====================
export interface Role {
  id: string;
  name: string;
  // UI-only field. Not part of current DB schema.
  description?: string;
}

// ==================== Users ====================
export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash?: string;
  fullName?: string;
  roleId: string;
  createdAt: string;

  // UI compatibility fields.
  role?: Role;
  avatar?: string;
  updatedAt?: string;
}

// ==================== Categories ====================
export interface Category {
  id: string;
  name: string;
  description?: string;

  // UI compatibility field.
  slug?: string;
}

// ==================== Articles ====================
export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  categoryId: string;
  authorId: string;
  status: "draft" | "published";
  createdAt: string;
  publishedAt?: string | null;

  // UI compatibility fields.
  category?: Category;
  author?: User;
  excerpt?: string;
  featuredImage?: string;
  updatedAt?: string;
}

// ==================== Comments ====================
export interface Comment {
  id: string;
  articleId: string;
  userName: string;
  content: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;

  // UI compatibility field.
  articleTitle?: string;
}

// ==================== Media ====================
export interface MediaFile {
  id: string;
  fileName: string;
  filePath: string;
  type: string;
  uploadedBy: string;
  uploadedAt: string;

  // UI compatibility fields.
  url?: string;
  fileType?: string;
  fileSize?: number;
  createdAt?: string;
}

// ==================== Services ====================
export interface Service {
  id: string;
  name: string;
  description: string;
  requiredDocuments: string;
  processingTime: string;
  fee: number;

  // UI compatibility fields.
  templateFile?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ==================== Applications ====================
export interface Application {
  id: string;
  serviceId: string;
  applicantName: string;
  phone: string;
  email: string;
  status: "pending" | "processing" | "done" | "rejected";
  createdAt: string;

  // UI compatibility fields.
  serviceName?: string;
  note?: string;
  citizenName?: string;
  service?: string;
  submittedDate?: string;
}

// ==================== Audit Logs ====================
export interface LogEntry {
  id: string;
  userId: string;
  action: string;
  entity: string;
  createdAt: string;

  // UI compatibility fields.
  user?: string;
  detail?: string;
  module?: string;
  timestamp?: string;
}

// ==================== Dashboard Stats ====================
export interface DashboardStats {
  totalUsers: number;
  totalArticles: number;
  totalServices: number;
  totalApplications: number;
}
