const demos = [
  {
    id: 'seattle_coll_animation',
    name: 'Seattle Collisions animation',
    username: 'cartovl',
    dataset: 'seattle_collisions',
    viz: `
      strokeWidth: 0
      color: ramp($addrtype, Bold)
      filter: animation($incdate, 30, fade(1, 1))
    `,
    mapState: {
      longitude: -122.39,
      latitude: 47.59,
      zoom: 10
    }
  },
  {
    id: 'cordoba_cadastral_animation',
    name: 'Cordoba cadastral data animation',
    username: 'cartovl',
    dataset: 'cordoba_catastro',
    sql: 'select * from cordoba_catastro where year > 1900',
    viz: `
      strokeWidth: 0
      color: ramp($year, purpor)
      filter: animation($year, 20, fade(0.1, hold))
    `,
    mapState: {
      latitude: 37.87,
      longitude: -4.79,
      zoom: 11
    }
  }
];

export default demos;
