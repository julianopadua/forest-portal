// src/lib/reports/types.ts

export type ReportHighlight = {
  id: string;
  label: string;
  value: string | number;
  comparison_label?: string | null;
  comparison_value?: string | number | null;
  pct_change?: number | null;
};

export type ReportAnalysis = {
  headline: string;
  overview: string;
  comparison: string;
  limitations: string;
};

export type ReportCoverage = {
  latest_year: number | null;
  previous_year: number | null;
  latest_period: string | null;
  recent_years_loaded: number | null;
};

export type ReportDatasetInfo = {
  dataset_id: string;
  local_relative_dir?: string;
  file_count_used?: number;
  total_rows_processed?: number;
};

export type ReportSectionBase = {
  id: string;
  kind: string;
  title: string;
};

export type ReportSeriesPoint = {
  [key: string]: string | number | null;
};

export type ReportSeriesSection = ReportSectionBase & {
  kind: "timeseries" | "bar";
  x_key: string;
  y_key: string;
  data: ReportSeriesPoint[];
};

export type ReportTableColumn = {
  key: string;
  label: string;
};

export type ReportTableRow = {
  [key: string]: string | number | null;
};

export type ReportTableSection = ReportSectionBase & {
  kind: "table";
  columns: ReportTableColumn[];
  rows: ReportTableRow[];
};

export type ReportSection = ReportSeriesSection | ReportTableSection;

export type ReportMethodology = {
  source?: string;
  note?: string;
  limitations?: string;
};

export type ReportGeneratedFrom = {
  report_id: string;
  generated_at: string;
};

export type ReportDocument = {
  report_id: string;
  title: string;
  source_label: string;
  summary?: string | null;
  generated_at: string;
  publication_status: "generated" | "live" | string;
  dataset: ReportDatasetInfo;
  coverage: ReportCoverage;
  highlights: ReportHighlight[];
  analysis: ReportAnalysis;
  sections: ReportSection[];
  analysis_context?: Record<string, unknown>;
  methodology?: ReportMethodology;
  generated_from?: ReportGeneratedFrom;
};

export type ReportManifest = {
  report_id: string;
  title: string;
  generated_at: string;
  live_generated_at?: string;
  bucket_prefix: string;
  paths: {
    generated_report: string;
    live_report: string;
    stable_live_report: string;
    manifest: string;
  };
  public_urls: {
    generated_report: string;
    live_report: string;
    stable_live_report: string;
    manifest: string;
  };
  meta?: Record<string, unknown>;
};
