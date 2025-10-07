import { z } from 'zod';

import type { TopLevelParameter } from 'vega-lite/build/src/spec/toplevel';
import type { Transform } from 'vega-lite/build/src/transform';

export type { Spec as VegaSpec } from 'vega';

// Source:
// deepnote-internal
//
// Path:
// libs/shared/src/cells/vega-lite.types.ts
//
// Commit SHA:
// 7a06bd352cf59577b7cd100cb14747908400440e

/** In v1 chart blocks, ordinal type was supported. In v2, it's not - so we're only keeping it here for migration purposes.
 *  Existing ordinal types encoding are converted to quantitative type.
 */

export const legacyEncodingTypeSchema = z.enum([
  'quantitative',
  'ordinal',
  'nominal',
  'temporal'
]);
export type LegacyEncodingType = z.infer<typeof legacyEncodingTypeSchema>;

const markTypeSchema = z.enum([
  'area',
  'bar',
  'trail',
  'line',
  'point',
  'circle',
  'text',
  'arc'
]);
export type MarkType = z.infer<typeof markTypeSchema>;

export const encodingChannelSchema = z.enum([
  'x',
  'y',
  'color',
  'opacity',
  'order',
  'size',
  'xOffset',
  'yOffset',
  'text',
  'theta',
  'tooltip',
  'detail',
  'stroke'
]);
export type EncodingChannel = z.infer<typeof encodingChannelSchema>;

export const sortOrderSchema = z.enum(['ascending', 'descending']);
export type SortOrder = z.infer<typeof sortOrderSchema>;

export const scaleTypeSchema = z.enum(['linear', 'log', 'sqrt', 'time']);
export type ScaleType = z.infer<typeof scaleTypeSchema>;

export const numberTypeSchema = z.enum([
  'default',
  'number',
  'scientific',
  'percent'
]);
export type NumberType = z.infer<typeof numberTypeSchema>;

export const numberFormatSchema = z.object({
  type: numberTypeSchema.default('default'),
  decimals: z.number().nullable().default(null)
});
export type NumberFormat = z.infer<typeof numberFormatSchema>;

export const aggregateTypeSchema = z.enum([
  'argmax',
  'argmin',
  'count',
  'average',
  'distinct',
  'max',
  'median',
  'min',
  'sum',
  'variance',
  'none'
]);
export type AggregateType = z.infer<typeof aggregateTypeSchema>;

export const timeUnitSchema = z.enum([
  'yearmonthdatehours',
  'yearmonthdate',
  'yearmonth',
  'yearweek',
  'year',
  'monthdatehours',
  'monthdate',
  'month',
  'week',
  'datehours',
  'date',
  'day',
  'hours'
]);
export type TimeUnit = z.infer<typeof timeUnitSchema>;

export type FieldType = string;

export type GridType = 'x' | 'y' | 'full' | 'disabled';

export interface Encoding {
  field?: FieldType;
  type?: LegacyEncodingType;
  title?: string;
  sort?:
    | {
        order: SortOrder;
      }
    | {
        encoding: EncodingChannel;
        order: SortOrder;
      }
    | {
        order: SortOrder;
        field?: string | null;
        op?: AggregateType;
      }
    | SortOrder
    | null;
  aggregate?: AggregateType;
  bin?: boolean | { step?: number; maxbins?: number };
  timeUnit?: TimeUnit | null;
  axis?: {
    grid?: boolean;
    title?: string | null;
    ticks?: boolean;
    labels?: boolean;
    formatType?: string;
    format?: string | NumberFormat;
  };
  scale?: {
    scheme?: string;
    type?: ScaleType;
    zero?: boolean;
    domainMin?: number;
    domainMax?: number;
    // Used only for color encoding to set custom label + color for legend
    domain?: [string];
    range?: [string];
  };
  formatType?: string;
  format?: string | NumberFormat;
  datum?: number | string;
  stack?: 'normalize' | 'zero' | true;
  condition?: Record<string, any>;
  value?: number | string;
  legend?: Record<string, any>;
  bandPosition?: number;
}

export type VegaLiteMark =
  | {
      type: MarkType;
      outerRadius?: {
        expr: string;
      };
      innerRadius?: {
        expr: string;
      };
      tooltip?: boolean;
    }
  | {
      type: MarkType;
      tooltip: boolean | { content: string };
      color?: string;
      clip?: boolean;
    }
  | MarkType;

// NOTE: tooltip is used in encoding to display and format tooltips in the Pie / Arc chart
export type EncodingsMap = {
  [channel in EncodingChannel]?: channel extends 'tooltip' | 'detail'
    ? Encoding[]
    : Encoding;
};

export interface VegaLiteDataLayer {
  mark: VegaLiteMark;
  encoding: EncodingsMap;
  params?: Array<TopLevelParameter>;
  transform?: Array<Transform>;
}

/**
 * This mark config is only used for the purposes of "value labels". See NB-353.
 * That's why it's not a full mark config, but only a subset of properties that we need.
 */
interface VegaLiteTextMarkConfig {
  type: 'text';
  align?: 'left' | 'right' | 'center';
  baseline?: 'top' | 'middle' | 'bottom';
  fill: 'black';
  dx?: number;
  dy?: number;
  radius?: {
    expr: string;
  };
}

/**
 * This text layer is only used for the purposes of adding "value labels" to another layer. See NB-353
 * This layer will always be nested with a sibling data layer. See `VegaLiteParentLayer`
 */
export interface VegaLiteTextLayer {
  mark: VegaLiteTextMarkConfig;
  params?: Array<TopLevelParameter>;

  encoding: EncodingsMap & {
    text: Encoding;
  };
  transform?: Array<Transform>;
}

/**
 * This point layer is only used for the purpose of adding a better tooltip to another, line layer.
 * This layer will always be nested with a sibling data layer. See `VegaLiteParentLayer`
 * ! Be careful with type-guarding this layer. It looks very similar to a VegaLiteDataLayer with a point mark,
 * ! but with only a subset of properties that we need.
 */
export interface VegaLiteLineTooltipLayer {
  mark:
    | { type: 'point'; tooltip: true; size: number; opacity: 0 }
    | {
        type: 'text';
        radius: {
          expr: string;
        };
      };
  encoding: EncodingsMap;
  params?: Array<TopLevelParameter>;
}

export type VegaLiteHelperLayer = VegaLiteTextLayer | VegaLiteLineTooltipLayer;

// This is a leaf layer that doesn't have any children layer
export type VegaLiteLeafLayer = VegaLiteDataLayer | VegaLiteHelperLayer;

export interface VegaLiteParentLayer {
  title?: string;
  // an array with at least 1 element - first element is always a data layer, and the rest are 0+ helper layers
  layer: [VegaLiteDataLayer, ...VegaLiteHelperLayer[]];
  encoding?: { [channel in EncodingChannel]?: Encoding };
  mark?: VegaLiteMark;
}

export type VegaLiteMultiLayerSpecV1TopLevelLayer =
  | VegaLiteDataLayer
  | VegaLiteParentLayer;

interface VegaLiteSpecShared {
  $schema:
    | 'https://vega.github.io/schema/vega-lite/v4.json'
    | 'https://vega.github.io/schema/vega-lite/v5.json';
  title?: string;
  config?: {
    legend?: {
      disable?: boolean;
      orient?: 'left' | 'right' | 'top' | 'bottom';
      labelFont?: string;
      labelFontSize?: number;
      labelFontWeight?: string;
      labelOverlap?: boolean;
      labelColor?: string;
      padding?: number;
      rowPadding?: number;
      symbolSize?: number;
      symbolType?: string;
      titleColor?: string;
      titlePadding?: number;
      titleFont?: string;
      titleFontSize?: number;
      titleFontWeight?: string;
    };
    title?: {
      anchor?: string;
      color?: string;
      font?: string;
      fontSize?: number;
      fontWeight?: string | number;
      dy?: number;
      offset?: number;
      orient?: 'left' | 'right' | 'top' | 'bottom';
    };
    axis?: {
      labelFont?: string;
      labelFontSize?: number;
      labelFontWeight?: string | number;
      titleFont?: string;
      titleFontSize?: number;
      titleFontWeight?: string | number;
      labelOverlap?: string;
      labelColor?: string;
      titleColor?: string;
      titlePadding?: number;
      domainCap?: 'butt' | 'round' | 'square';
      gridCap?: 'butt' | 'round' | 'square';
      gridWidth?: number;
      gridColor?: string;
    };
    axisX?: {
      labelPadding?: number;
    };
    axisY?: {
      labelPadding?: number;
    };
    axisBand?: {
      tickCap?: 'butt' | 'round' | 'square';
      tickExtra?: boolean;
    };
    axisQuantitative?: {
      tickCount?: number;
    };
    view?: {
      stroke?: string;
    };
    line?: {
      strokeCap?: 'butt' | 'round' | 'square';
      strokeWidth?: number;
      strokeJoin?: 'bevel';
    };
    bar?: {
      cornerRadiusTopRight?: number;
      cornerRadiusBottomLeft?: number;
      cornerRadiusBottomRight?: number;
      cornerRadiusTopLeft?: number;
    };
    area?: { fill?: 'category'; line?: boolean; opacity?: number };
    circle?: { size?: number };
    mark?: { color?: string };
    range?: {
      category?: readonly string[];
      ramp?: string[];
    };

    customFormatTypes?: boolean;
  };
  encoding: EncodingsMap;
  usermeta?: {
    tooltipDefaultMode?: boolean;
    aditionalTypeInfo?: {
      histogramLayerIndexes: number[];
    };
    seriesOrder?: number[];
    seriesNames?: string[];
    specSchemaVersion?: number;
  };
  resolve?: { scale?: { [channel in 'x' | 'y']?: 'independent' | 'shared' } };
  transform?: Array<Transform>;
  params?: Array<TopLevelParameter>;

  autosize?: {
    type: 'fit';
  };
  background?: string;
  width?: 'container' | number;
  height?: 'container' | number;
  padding?:
    | number
    | { left: number; right: number; top: number; bottom: number };
  data?: {
    name?: string;
    values?: Array<Record<string, unknown>>;
  };
}

export interface VegaLiteMultiLayerSpecV1 extends VegaLiteSpecShared {
  mark?: undefined;
  // In spec v1 we had arbitrary number of layers (roughly corresponds to series in current chart config),
  // each of which consisted of one data layer and 0 or more helper layers (e.g. for value labels)
  layer: Array<VegaLiteMultiLayerSpecV1TopLevelLayer>;
}

export interface VegaLiteAxisGroup {
  resolve: {
    scale: {
      color: 'independent';
    };
  };
  layer: VegaLiteParentLayer[];
}

export interface VegaLiteMultiLayerSpecV2 extends VegaLiteSpecShared {
  mark?: undefined;
  // Second version of spec adds one more nesting level to `layer`. Now, there are always 1-2
  // root layers (one for each measure axis), which then consist of arbitrary number of series,
  // each of which has one data layer and 0 or more helper layers (e.g. for value labels)
  layer: [VegaLiteAxisGroup] | [VegaLiteAxisGroup, VegaLiteAxisGroup];
}

export interface VegaLiteTopLayerSpec extends VegaLiteSpecShared {
  mark: VegaLiteMark;
  layer?: undefined;
}

/**
 * This is a subset of vega-lite spec that we support the editing of in the chart block UI.
 */
export type VegaLiteSpec =
  | VegaLiteTopLayerSpec
  | VegaLiteMultiLayerSpecV1
  | VegaLiteMultiLayerSpecV2;
