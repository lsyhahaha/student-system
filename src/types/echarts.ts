import type { ComposeOption } from 'echarts/core'
import type {
  BarSeriesOption,
  PieSeriesOption
} from 'echarts/charts'
import type {
  TitleComponentOption,
  TooltipComponentOption,
  GridComponentOption,
  LegendComponentOption
} from 'echarts/components'

export type ECOption = ComposeOption<
  | BarSeriesOption
  | PieSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | LegendComponentOption
> 