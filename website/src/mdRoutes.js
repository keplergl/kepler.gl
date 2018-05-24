import introduction from 'docs/a-Introduction.md'
import bKeplerGlWorkflowAddDataToTheMap from 'docs/b-kepler-gl-workflow/a-add-data-to-the-map.md'
import bKeplerGlWorkflowBAddDataLayersAddingDataLayers from 'docs/b-kepler-gl-workflow/b-add-data-layers/a-adding-data-layers.md'
import bKeplerGlWorkflowBAddDataLayersCreateALayer from 'docs/b-kepler-gl-workflow/b-add-data-layers/b-create-a-layer.md'
import bKeplerGlWorkflowBAddDataLayersHideEditAndDeleteLayers from 'docs/b-kepler-gl-workflow/b-add-data-layers/c-hide-edit-and-delete-layers.md'
import bKeplerGlWorkflowBAddDataLayersBlendAndRearrangeLayers from 'docs/b-kepler-gl-workflow/b-add-data-layers/d-blend-and-rearrange-layers.md'
import cTypesOfLayersPoint from 'docs/c-types-of-layers/a-point.md'
import cTypesOfLayersArc from 'docs/c-types-of-layers/b-arc.md'
import cTypesOfLayersLine from 'docs/c-types-of-layers/c-line.md'
import cTypesOfLayersGrid from 'docs/c-types-of-layers/d-grid.md'
import cTypesOfLayersGeojson from 'docs/c-types-of-layers/e-geojson.md'
import cTypesOfLayersCluster from 'docs/c-types-of-layers/f-cluster.md'
import cTypesOfLayersIcon from 'docs/c-types-of-layers/g-icon.md'
import layerAttributes from 'docs/d-layer-attributes.md'
import filters from 'docs/e-filters.md'
import fMapStylesBaseMapStyles from 'docs/f-map-styles/1-base-map-styles.md'
import fMapStylesMapLayers from 'docs/f-map-styles/2-map-layers.md'
import fMapStylesAddCustomMapboxStyles from 'docs/f-map-styles/3-custom-styles.md'
import fMapStylesViewMapsIn3d from 'docs/f-map-styles/4-view-maps-in-3d.md'
import fMapStylesDisplayLegend from 'docs/f-map-styles/5-display-legend.md'
import fMapStylesSplitMaps from 'docs/f-map-styles/6-split-maps.md'
import mapSettings from 'docs/g-map-settings.md'
import playback from 'docs/h-playback.md'
import faq from 'docs/i-FAQ.md'

export default [{
  name: "Documentation",
  path: "/documentation",
  data: [
    {
      fileLocation: "/src/docs/a-Introduction.md",
      name: "Introduction",
      markdown: introduction
    },
    {
      name: "Kepler.gl Workflow",
      path: "b-kepler-gl-workflow",
      children: [
        {
          fileLocation: "/src/docs/b-kepler-gl-workflow/a-add-data-to-the-map.md",
          name: "Add data to the map",
          markdown: bKeplerGlWorkflowAddDataToTheMap
        },
        {
          name: "Add Data Layers",
          path: "b-add-data-layers",
          children: [
            {
              fileLocation: "/src/docs/b-kepler-gl-workflow/b-add-data-layers/a-adding-data-layers.md",
              name: "Adding data layers",
              markdown: bKeplerGlWorkflowBAddDataLayersAddingDataLayers
            },
            {
              fileLocation: "/src/docs/b-kepler-gl-workflow/b-add-data-layers/b-create-a-layer.md",
              name: "Create a layer",
              markdown: bKeplerGlWorkflowBAddDataLayersCreateALayer
            },
            {
              fileLocation: "/src/docs/b-kepler-gl-workflow/b-add-data-layers/c-hide-edit-and-delete-layers.md",
              name: "Hide, edit and delete layers",
              markdown: bKeplerGlWorkflowBAddDataLayersHideEditAndDeleteLayers
            },
            {
              fileLocation: "/src/docs/b-kepler-gl-workflow/b-add-data-layers/d-blend-and-rearrange-layers.md",
              name: "Blend and rearrange layers",
              markdown: bKeplerGlWorkflowBAddDataLayersBlendAndRearrangeLayers
            }
          ]
        }
      ]
    },
    {
      name: "Types of Layers",
      path: "c-types-of-layers",
      children: [
        {
          fileLocation: "/src/docs/c-types-of-layers/a-point.md",
          name: "Point",
          markdown: cTypesOfLayersPoint
        },
        {
          fileLocation: "/src/docs/c-types-of-layers/b-arc.md",
          name: "Arc",
          markdown: cTypesOfLayersArc
        },
        {
          fileLocation: "/src/docs/c-types-of-layers/c-line.md",
          name: "Line",
          markdown: cTypesOfLayersLine
        },
        {
          fileLocation: "/src/docs/c-types-of-layers/d-grid.md",
          name: "Grid",
          markdown: cTypesOfLayersGrid
        },
        {
          fileLocation: "/src/docs/c-types-of-layers/e-geojson.md",
          name: "Geo j s o n",
          markdown: cTypesOfLayersGeojson
        },
        {
          fileLocation: "/src/docs/c-types-of-layers/f-cluster.md",
          name: "Cluster",
          markdown: cTypesOfLayersCluster
        },
        {
          fileLocation: "/src/docs/c-types-of-layers/g-icon.md",
          name: "Icon",
          markdown: cTypesOfLayersIcon
        }
      ]
    },
    {
      fileLocation: "/src/docs/d-layer-attributes.md",
      name: "Layer attributes",
      markdown: layerAttributes
    },
    {
      fileLocation: "/src/docs/e-filters.md",
      name: "Filters",
      markdown: filters
    },
    {
      name: "Map Styles\n",
      path: "f-map-styles",
      children: [
        {
          fileLocation: "/src/docs/f-map-styles/1-base-map-styles.md",
          name: "Base map styles",
          markdown: fMapStylesBaseMapStyles
        },
        {
          fileLocation: "/src/docs/f-map-styles/2-map-layers.md",
          name: "Map layers",
          markdown: fMapStylesMapLayers
        },
        {
          fileLocation: "/src/docs/f-map-styles/3-custom-styles.md",
          name: "Add custom mapbox styles",
          markdown: fMapStylesAddCustomMapboxStyles
        },
        {
          fileLocation: "/src/docs/f-map-styles/4-view-maps-in-3d.md",
          name: "View maps in 3d",
          markdown: fMapStylesViewMapsIn3d
        },
        {
          fileLocation: "/src/docs/f-map-styles/5-display-legend.md",
          name: "Display legend",
          markdown: fMapStylesDisplayLegend
        },
        {
          fileLocation: "/src/docs/f-map-styles/6-split-maps.md",
          name: "Split maps",
          markdown: fMapStylesSplitMaps
        }
      ]
    },
    {
      fileLocation: "/src/docs/g-map-settings.md",
      name: "Map settings",
      markdown: mapSettings
    },
    {
      fileLocation: "/src/docs/h-playback.md",
      name: "Playback",
      markdown: playback
    },
    {
      fileLocation: "/src/docs/i-FAQ.md",
      name: "Faq",
      markdown: faq
    }
  ]
}];
