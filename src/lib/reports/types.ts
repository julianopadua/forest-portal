// src/lib/reports/types.ts
export type Locale = "pt" | "en";

export type LocalizedText = {
  pt: string;
  en: string;
};

export type ReportLocalizedValue = string | LocalizedText;

export type ReportHighlight = {
  id: string;
  label: LocalizedText;
  value: string | number;
  comparison_label?: LocalizedText | null;
  comparison_value?: string | number | null;
  pct_change?: number | null;
};

export type ReportAnalysis = {
  headline: LocalizedText;
  overview: LocalizedText;
  comparison: LocalizedText;
  limitations: LocalizedText;
};

export type ReportCoverage = {
  first_year: number | null;
  latest_year: number | null;
  previous_year: number | null;
  first_period: string | null;
  latest_period: string | null;
  year_range: string | null;
  period_range?: {
    start: string | null;
    end: string | null;
  };
  recent_years_loaded: number | null;
};

export type ReportDatasetInfo = {
  dataset_id: string;
  local_relative_dir?: string;
  file_count_used?: number;
  total_rows_processed?: number;
  years_loaded?: number;
  available_biomes?: string[];
  cache?: Record<string, unknown>;
};

export type ReportSeriesPoint = {
  [key: string]: string | number | null | undefined;
};

export type ReportTableRow = {
  [key: string]: string | number | null | undefined;
};

export type ReportSectionBase = {
  id: string;
  kind: string;
  title: LocalizedText;
};

export type ReportSeriesSection = ReportSectionBase & {
  kind: "timeseries" | "bar";
  x_key: string;
  y_key: string;
  biome_key?: string;
  filterable_by?: string[];
  period_filter_granularity?: "month" | "year" | string;
  default_view?: Record<string, unknown>;
  data: ReportSeriesPoint[];
};

export type ReportTableColumn = {
  key: string;
  label: LocalizedText;
};

export type ReportTableInitialComparison = {
  current_year: number | null;
  previous_year: number | null;
  rows: ReportTableRow[];
};

export type ReportTableSection = ReportSectionBase & {
  kind: "table";
  columns: ReportTableColumn[];
  filterable_by?: string[];
  period_filter_granularity?: "month" | "year" | string;
  comparison_strategy?: string;
  group_key?: string;
  year_key?: string;
  value_key?: string;
  biome_key?: string;
  default_view?: Record<string, unknown>;
  initial_comparison?: ReportTableInitialComparison;
  data: ReportSeriesPoint[];
};

export type ReportSection = ReportSeriesSection | ReportTableSection;

export type ReportMethodology = {
  source?: LocalizedText;
  note?: LocalizedText;
  limitations?: LocalizedText;
};

export type ReportGeneratedFrom = {
  report_id: string;
  generated_at: string;
};

export type ReportBiomeFilterOption = {
  value: string;
  label: LocalizedText;
};

export type ReportBiomeFilter = {
  kind: "single_select" | string;
  label: LocalizedText;
  default_value: string;
  all_value: string;
  options: ReportBiomeFilterOption[];
};

export type ReportPeriodFilter = {
  kind: "range" | string;
  label: LocalizedText;
  granularities: string[];
  available_years: number[];
  available_periods: string[];
  bounds: {
    year_start: number;
    year_end: number;
    period_start: string;
    period_end: string;
  };
};

export type ReportFilters = {
  biome: ReportBiomeFilter;
  period: ReportPeriodFilter;
};

export type ReportAnalysisScope = {
  recent_months: number;
  window_start_period: string;
  window_end_period: string;
  biome_scope: string;
};

export type ReportDocument = {
  schema_version?: number;
  report_id: string;
  title: LocalizedText;
  source_label: LocalizedText;
  summary?: LocalizedText | null;
  available_locales?: Locale[];
  default_locale?: Locale;
  generated_at: string;
  publication_status: "generated" | "live" | string;
  dataset: ReportDatasetInfo;
  coverage: ReportCoverage;
  filters?: ReportFilters;
  analysis_scope?: ReportAnalysisScope;
  highlights: ReportHighlight[];
  analysis: ReportAnalysis;
  sections: ReportSection[];
  methodology?: ReportMethodology;
  generated_from?: ReportGeneratedFrom;
};

export type ReportManifest = {
  report_id: string;
  title: string | LocalizedText;
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

export type ResolvedReportHighlight = {
  id: string;
  label: string;
  value: string | number;
  comparison_label?: string | null;
  comparison_value?: string | number | null;
  pct_change?: number | null;
};

export type ResolvedReportMethodology = {
  source?: string | null;
  note?: string | null;
  limitations?: string | null;
};

export type ResolvedReportAnalysisIntro = {
  headline: string;
  overview: string;
};

export type ResolvedReportAnalysisDetails = {
  comparison: string;
  limitations: string;
};

export type ResolvedReportSeriesSection = {
  id: string;
  kind: "timeseries" | "bar";
  title: string;
  x_key: string;
  y_key: string;
  data: ReportSeriesPoint[];
};

export type ResolvedReportTableColumn = {
  key: string;
  label: string;
};

export type ResolvedReportTableSection = {
  id: string;
  kind: "table";
  title: string;
  columns: ResolvedReportTableColumn[];
  rows: ReportTableRow[];
};

export type ResolvedReportSection =
  | ResolvedReportSeriesSection
  | ResolvedReportTableSection;