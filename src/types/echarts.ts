import type { ComposeOption } from 'echarts/core'
import type {
  TitleComponentOption,
  TooltipComponentOption,
  GridComponentOption,
  LegendComponentOption
} from 'echarts/components'
import type {
  BarSeriesOption,
  LineSeriesOption,
  PieSeriesOption
} from 'echarts/charts'

export type ECOption = ComposeOption<
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | LegendComponentOption
  | BarSeriesOption
  | LineSeriesOption
  | PieSeriesOption
> 