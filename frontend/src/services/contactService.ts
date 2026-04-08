import api from "@/services/api";

export type CreateContactPayload = {
  fullName: string;
  phone: string;
  email?: string;
  category: string;
  content: string;
};

export async function createPublicContact(payload: CreateContactPayload): Promise<void> {
  await api.post("/contacts", payload);
}
