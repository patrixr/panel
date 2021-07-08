import m       from 'mithril';
import { jsx } from '../utils/render';

// ---------------------------------
// ~ TYPES
// ---------------------------------

export interface ChartProps {
  dataset: number[],
  width: string,
  height: string
}

export interface ChartState {
  imgData: any;
}

// ---------------------------------
// ~ HELPERS
// ---------------------------------

function charOptions(dataset: number[]) {
  return {
    backgroundColor: 'transparent',
    width: 500,
    height: 300,
    format: 'svg',
    chart: {
      type: 'line',
      data: {
        labels: dataset.map(() => ''),
        datasets: [
          {
            label: '',
            lineTension: 0.3,
            fill: false,
            data: dataset,
            borderColor: 'white'
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [
            {
              display: false,
              ticks: {
                display: false
              }
            }
          ],
          yAxes: [
            {
              display: false,
              ticks: {
                display: false
              }
            }
          ]
        }
      }
    }
  };
}

// ---------------------------------
// ~ CHART
// ---------------------------------

const Chart: m.Component<ChartProps, ChartState> = {
  oninit: async vnode => {
    vnode.state.imgData = await m.request({
      url: 'https://quickchart.io/chart',
      body: charOptions(vnode.attrs.dataset),
      method: 'POST',
      headers: {
        "accept": "image/svg+xml, text/*"
      },
      extract: function(xhr) {
        return xhr.responseText;
      }
    });
  },

  view: ({ state, attrs }) => (
    state.imgData ?
      m('img', {
        style: {
          width: attrs.width || '300px',
          height: attrs.height
        },
        src: `data:image/svg+xml;base64,${btoa(state.imgData)}`
      }) : m('div', 'Rendering')
  )
};

export default jsx(Chart);
