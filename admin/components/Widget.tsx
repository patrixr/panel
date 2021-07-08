import { PanelWidget, PanelWidgetType } from '../../shared/definitions'
import { readDatasource }               from '../api'
import { getNextColor }                 from '../utils/colors'
import { style }                        from 'typestyle'
import { jsx }                          from '../utils/render'
import Chart                            from './Chart'
import m                                from 'mithril'


// ---------------------------------
// ~ TYPES
// ---------------------------------

export type WidgetProps = {
  widget: PanelWidget;
};

export type WidgetState = {
  status: 'loading' | 'ready' | 'error';
  data: any;
  updatedAt: Date,
  color: string,
  error: any
};

// ---------------------------------
// ~ STYLE
// ---------------------------------

const WIDGET_WIDTH = '25rem';
const WIDGET_HEADER_HEIGHT = '3rem';
const WIDGET_BODY_HEIGHT = '10rem';
const WIDGET_FOOTER_HEIGHT = '3rem';

const styles = {
  widget: style({
    padding: '1rem',
    margin: '2rem',
    width: WIDGET_WIDTH,
    boxShadow: '0px 2px 10px gray',
    color: 'white',
    $nest: {
      '.data-number': {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '4rem',
        lineHeight: '8rem'
      },
      '.data-text': {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '2rem',
        lineHeight: '8rem'
      },
      '.widget-header': {
        display: 'flex',
        height: WIDGET_HEADER_HEIGHT,
        justifyContent: 'space-between'
      },
      '.widget-body': {
        height: WIDGET_BODY_HEIGHT
      },
      '.widget-footer': {
        height: WIDGET_FOOTER_HEIGHT,
        lineHeight: '4rem',
        textAlign: 'right'
      },
    }
  })
}


// ---------------------------------
// ~ UTILS
// ---------------------------------

function resolveWidgetType(data: any): PanelWidgetType {
  if (typeof data === 'string') return PanelWidgetType.STATUS;
  if (typeof data === 'number') return PanelWidgetType.COUNTER;
  if (Array.isArray(data) && typeof data[0] === 'number')
    return PanelWidgetType.CHART;
  return PanelWidgetType.UNKNOWN;
}

const renderChart = (data: number[]) => {
  return <div className="data-chart">
    <Chart width={WIDGET_WIDTH} height={WIDGET_BODY_HEIGHT} dataset={data}></Chart>
  </div>;
};

const renderCounter = (data: number) => {
  return <div className="data-number">{data}</div>;
};

const renderStatus = (data: string) => {
  return <div className="data-text">{data}</div>;
};

const renderUnsupported = () => {
  return <div>Unsupported Widget</div>;
};

const renderData = (type: PanelWidgetType, data: any) => {
  if (type === PanelWidgetType.CHART) return renderChart(data);
  if (type === PanelWidgetType.COUNTER) return renderCounter(data);
  if (type === PanelWidgetType.STATUS) return renderStatus(data);
  return renderUnsupported();
};

// ---------------------------------
// ~ WIDGET
// ---------------------------------

export const Widget = () : m.Component<WidgetProps, WidgetState> => {
  return {

    oninit: async ({ state, attrs }) => {
      state.status = 'loading';
      state.color = getNextColor();
      try {
        state.updatedAt = new Date();
        state.data = await readDatasource(attrs.widget.datasource);
        state.status = 'ready'
      } catch (e) {
        state.error = e;
        state.status = 'error'
      }
    },

    view: ({ state, attrs }) => {
      const { data, status, updatedAt, color } = state;

      if (status === 'loading') {
        return <div>Loading</div>;
      }

      if (status === 'error') {
        return <div>Error</div>;
      }

      const { name } = attrs.widget;
      const type = resolveWidgetType(data);
      const timeString = updatedAt.getHours() + ':' + `0${updatedAt.getMinutes()}`.slice(-2);

      return <div class={styles.widget} style={{ background: color }}>
        <div class="widget-header">
          <strong>{name}</strong>
        </div>
        <div class="widget-body">
          {renderData(type, data)}
        </div>
        <div class="widget-footer">
          <small>As of { timeString }</small>
        </div>
      </div>;
    }
  };
};

export default jsx(Widget);
