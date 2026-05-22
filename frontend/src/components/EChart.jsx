import { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import { BarChart, LineChart, PieChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([LineChart, BarChart, PieChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer]);

export function EChart({ option, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const chart = echarts.init(ref.current, null, { renderer: 'canvas' });
    chart.setOption(option);
    const onResize = () => chart.resize();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      chart.dispose();
    };
  }, [option]);

  return <div className={`echart ${className}`} ref={ref} />;
}
