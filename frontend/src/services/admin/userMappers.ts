import { resolveApiAssetUrl } from "@/lib/api-base-url";
import type {
  ApiRole,
  ApiUser,
} from "@/services/admin/types";
import type {
  Role,
  User,
} from "@/types";

function inferRoleIdFromName(roleName: string): string {
  if (roleName === "Admin") return "1";
  if (roleName === "Editor") return "2";
  if (roleName === "Viewer") return "3";
  return "";
}

export function toRole(role: ApiRole): Role {
  return {
    id: String(role.id),
    name: role.name,
  };
}

function toRoleFromUnknown(role?: ApiRole | string | null, roleId?: number | string | null): Role | undefined {
  if (role && typeof role === "object") {
    return toRole(role);
  }

  if (typeof role === "string" && role.trim()) {
    const normalizedRoleName = role.trim();
    return {
      id: roleId != null ? String(roleId) : inferRoleIdFromName(normalizedRoleName),
      name: normalizedRoleName,
    };
  }

  return undefined;
}

function normalizeRoleId(roleId?: number | string | null, role?: ApiRole | string | null) {
  if (roleId != null && String(roleId).trim()) {
    return String(roleId);
  }

  if (role && typeof role === "object") {
    return String(role.id);
  }

  if (typeof role === "string") {
    return inferRoleIdFromName(role.trim());
  }

  return "";
}

export function toUser(user: ApiUser): User {
  const role = toRoleFromUnknown(user.role, user.roleId);

  return {
    id: String(user.id),
    username: user.username,
    email: user.email,
    fullName: user.fullName ?? undefined,
    phone: user.phone ?? undefined,
    avatarUrl: resolveApiAssetUrl(user.avatarUrl) || user.avatarUrl || undefined,
    roleId: normalizeRoleId(user.roleId, user.role),
    role,
    createdAt: user.createdAt,
  };
}
