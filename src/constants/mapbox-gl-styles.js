
export const LayerGroups = [
  {
    slug: 'label',
    filter: ({id}) => id.match(/label/),
    defaultVisibility: true,
    editable: true
  },
  {
    slug: 'places',
    filter: ({id}) => id.match(/poi/),
    defaultVisibility: true,
    editable: true
  },
  {
    slug: 'road',
    filter: ({id}) => id.match(/(?=(road|railway))(?!.*label)/),
    defaultVisibility: true,
    editable: true
  },
  {
    slug: 'border',
    filter: ({id}) => id.match(/border/),
    defaultVisibility: false,
    editable: true
  },
  {
    slug: 'building',
    filter: ({id}) => id.match(/building/),
    defaultVisibility: true,
    editable: true
  },
  {
    slug: 'water',
    filter: ({id}) => id.match(/(?=(water|stream|ferry))/),
    defaultVisibility: true,
    editable: true
  },
  {
    slug: 'land',
    filter: ({id}) => id.match(/(?=(parks))/),
    defaultVisibility: true,
    editable: true
  }
];
