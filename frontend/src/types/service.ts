export interface ProcedureDetail {
  id?: number;
  slug: string;
  title: string;
  field?: string;
  requiredDocuments: string[];
  processingTime: string;
  fee: string;
  wordTemplateHref: string;
  requirements: string[];
  steps: string[];
}
