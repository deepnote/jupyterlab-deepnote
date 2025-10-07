import { z } from 'zod';

const columnIdSchema = z.string();
export type ColumnId = z.infer<typeof columnIdSchema>;

export const dataTableCellFormattingStyleNames = [
  'default',
  'defaultBold',
  'positive',
  'positiveBold',
  'positiveProminentBold',
  'attention',
  'attentionBold',
  'attentionProminentBold',
  'critical',
  'criticalBold',
  'criticalProminentBold'
] as const;
export type DataTableCellFormattingStyleName =
  (typeof dataTableCellFormattingStyleNames)[number];

const dataTableColumnSelectionModeSchema = z.enum(['all', 'allExcept', 'only']);
export type DataTableColumnSelectionMode = z.infer<
  typeof dataTableColumnSelectionModeSchema
>;

export const dataframeFilterOperators = [
  'is-equal',
  'is-not-equal',
  'is-one-of',
  'is-not-one-of',
  'is-not-null',
  'is-null',
  'text-contains',
  'text-does-not-contain',
  'greater-than',
  'greater-than-or-equal',
  'less-than',
  'less-than-or-equal',
  'between',
  'outside-of',
  'is-relative-today',
  'is-after',
  'is-before',
  'is-on'
] as const;
const dataframeFilterOperatorSchema = z.enum(dataframeFilterOperators);
export type DataframeFilterOperator = z.infer<
  typeof dataframeFilterOperatorSchema
>;

const dataTableCellFormattingRuleSingleColorSchema = z.object({
  type: z.literal('singleColor'),
  columnSelectionMode: dataTableColumnSelectionModeSchema,
  columnNames: z.array(columnIdSchema).nullable(),
  operator: dataframeFilterOperatorSchema,
  comparativeValues: z.array(z.string()),
  styleName: z.enum(dataTableCellFormattingStyleNames)
});
export type DataTableCellFormattingRuleSingleColor = z.infer<
  typeof dataTableCellFormattingRuleSingleColorSchema
>;

export const dataTableCellFormattingScaleNames = [
  'defaultToPositive',
  'defaultToAttention',
  'defaultToCritical',
  'positiveToDefault',
  'attentionToDefault',
  'criticalToDefault',
  'criticalToDefaultToPositive',
  'criticalToAttentionToPositive',
  'positiveToDefaultToCritical',
  'positiveToAttentionToCritical'
] as const;
export type DataTableCellFormattingColorScaleName =
  (typeof dataTableCellFormattingScaleNames)[number];

const dataTableCellFormattingRuleColorScalePointSchema = z.object({
  valueType: z.enum(['autoAllColumns', 'number', 'percentage']),
  value: z.number().nullable(),
  customColor: z.string().nullable()
});
export type DataTableCellFormattingRuleColorScalePoint = z.infer<
  typeof dataTableCellFormattingRuleColorScalePointSchema
>;

const dataTableCellFormattingRuleColorScaleSchema = z.object({
  type: z.literal('colorScale'),
  columnSelectionMode: dataTableColumnSelectionModeSchema,
  columnNames: z.array(columnIdSchema).nullable(),
  pointMin: dataTableCellFormattingRuleColorScalePointSchema,
  pointMid: dataTableCellFormattingRuleColorScalePointSchema,
  pointMax: dataTableCellFormattingRuleColorScalePointSchema,
  scaleName: z.enum(dataTableCellFormattingScaleNames)
});
export type DataTableCellFormattingRuleColorScale = z.infer<
  typeof dataTableCellFormattingRuleColorScaleSchema
>;

const dataTableCellFormattingRuleColorScaleResolvedValueSchema = z.object({
  quantitative: z
    .object({
      min: z.number(),
      mid: z.number(),
      max: z.number()
    })
    .nullable(),
  temporal: z
    .object({
      min: z.date(),
      mid: z.date(),
      max: z.date()
    })
    .nullable()
});
export type DataTableCellFormattingRuleColorScaleResolvedValue = z.infer<
  typeof dataTableCellFormattingRuleColorScaleResolvedValueSchema
>;

const dataTableCellFormattingRuleColorScaleResolvedSchema =
  dataTableCellFormattingRuleColorScaleSchema.extend({
    resolvedValue: dataTableCellFormattingRuleColorScaleResolvedValueSchema
  });
export type DataTableCellFormattingRuleColorScaleResolved = z.infer<
  typeof dataTableCellFormattingRuleColorScaleResolvedSchema
>;

const dataTableCellFormattingRuleSchema = z.union([
  dataTableCellFormattingRuleSingleColorSchema,
  dataTableCellFormattingRuleColorScaleSchema
]);
export type DataTableCellFormattingRule = z.infer<
  typeof dataTableCellFormattingRuleSchema
>;

const dataTableCellFormattingRuleResolvedSchema = z.union([
  dataTableCellFormattingRuleSingleColorSchema,
  dataTableCellFormattingRuleColorScaleResolvedSchema
]);
export type DataTableCellFormattingRuleResolved = z.infer<
  typeof dataTableCellFormattingRuleResolvedSchema
>;

const dataTableCellFormattingColorScaleDefinitionSchema = z.object({
  min: z.string(),
  mid: z.string().optional(),
  max: z.string()
});
export type DataTableCellFormattingColorScaleDefinition = z.infer<
  typeof dataTableCellFormattingColorScaleDefinitionSchema
>;

export const dataframeFilterSchema = z.object({
  column: columnIdSchema,
  operator: dataframeFilterOperatorSchema,
  comparativeValues: z.array(z.string())
});
export type DataframeFilter = z.infer<typeof dataframeFilterSchema>;

const sortBySchema = z.object({
  id: columnIdSchema,
  type: z.enum(['asc', 'desc'])
});
export type SortBy = z.infer<typeof sortBySchema>;

const columnContainsFilterSchema = z.object({
  id: columnIdSchema,
  value: z.string(),
  type: z.literal('contains')
});
export type ColumnContainsFilter = z.infer<typeof columnContainsFilterSchema>;

const columnFilterSchema = columnContainsFilterSchema;
export type ColumnFilter = z.infer<typeof columnFilterSchema>;

const columnDisplayNameRecordSchema = z.object({
  columnName: columnIdSchema,
  displayName: z.string()
});
export type ColumnDisplayNameRecord = z.infer<
  typeof columnDisplayNameRecordSchema
>;

export const sharedTableStateSchema = z.object({
  pageSize: z.number().optional(),
  pageIndex: z.number().optional(),
  filters: z.array(columnFilterSchema).optional(),
  conditionalFilters: z.array(dataframeFilterSchema).optional(),
  sortBy: z.array(sortBySchema).optional(),
  cellFormattingRules: z.array(dataTableCellFormattingRuleSchema).optional(),
  wrappedTextColumnIds: z.array(columnIdSchema).optional(),
  hiddenColumnIds: z.array(columnIdSchema).optional(),
  columnOrder: z.array(columnIdSchema).optional(),
  columnDisplayNames: z.array(columnDisplayNameRecordSchema).optional()
});
export type SharedTableState = z.infer<typeof sharedTableStateSchema>;
