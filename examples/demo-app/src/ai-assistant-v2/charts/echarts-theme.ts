// Copied from @openassistant/echarts (ECHARTS_DARK_THEME) so the ai-assistant-v2
// histogram renderer matches the OpenAssistant look without depending on the
// @openassistant/* packages at runtime.

export const ECHARTS_DARK_THEME = {
  color: [
    '#dd6b66',
    '#759aa0',
    '#e69d87',
    '#8dc1a9',
    '#ea7e53',
    '#eedd78',
    '#73a373',
    '#73b9bc',
    '#7289ab',
    '#91ca8c',
    '#f49f42'
  ],
  backgroundColor: 'rgba(14,14,14,1)',
  textStyle: {},
  title: {
    textStyle: {
      color: '#eeeeee'
    },
    subtextStyle: {
      color: '#aaaaaa'
    }
  },
  line: {
    itemStyle: {
      borderWidth: 1
    },
    lineStyle: {
      width: 2
    },
    symbolSize: 4,
    symbol: 'circle',
    smooth: false
  },
  bar: {
    itemStyle: {
      barBorderWidth: 0,
      barBorderColor: '#ccc'
    }
  },
  scatter: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#ccc'
    }
  },
  boxplot: {
    itemStyle: {
      borderColor: '#ccc',
      color: '#CCC',
      opacity: 1
    }
  },
  categoryAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: '#eeeeee'
      }
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: '#eeeeee'
      }
    },
    axisLabel: {
      show: true,
      color: '#eeeeee'
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: ['#333']
      }
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: ['#eeeeee']
      }
    }
  },
  valueAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: '#eeeeee'
      }
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: '#eeeeee'
      }
    },
    axisLabel: {
      show: true,
      color: '#eeeeee'
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: ['#333']
      }
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: ['#eeeeee']
      }
    }
  },
  toolbox: {
    iconStyle: {
      borderColor: '#999999'
    },
    emphasis: {
      iconStyle: {
        borderColor: '#666666'
      }
    }
  },
  legend: {
    textStyle: {
      color: '#eeeeee'
    }
  },
  tooltip: {
    axisPointer: {
      label: {
        color: '#333333'
      },
      lineStyle: {
        color: '#cccccc',
        width: '1'
      },
      crossStyle: {
        color: '#cccccc',
        width: '1'
      }
    }
  }
};
