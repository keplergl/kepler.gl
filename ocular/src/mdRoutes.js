import introduction from 'docs/a-introduction.md'
import bKeplerGlWorkflowAddDataToTheMap from 'docs/b-kepler-gl-workflow/a-add-data-to-the-map.md'
import bKeplerGlWorkflowBAddDataLayersAddingDataLayers from 'docs/b-kepler-gl-workflow/b-add-data-layers/a-adding-data-layers.md'
import bKeplerGlWorkflowBAddDataLayersCreateALayer from 'docs/b-kepler-gl-workflow/b-add-data-layers/b-create-a-layer.md'
import bKeplerGlWorkflowBAddDataLayersHideEditAndDeleteLayers from 'docs/b-kepler-gl-workflow/b-add-data-layers/c-hide-edit-and-delete-layers.md'
import bKeplerGlWorkflowBAddDataLayersBlendAndRearrangeLayers from 'docs/b-kepler-gl-workflow/b-add-data-layers/d-blend-and-rearrange-layers.md'
import typesOfLayersPoint from 'docs/types-of-layers/a-point.md'
import typesOfLayersArc from 'docs/types-of-layers/b-arc.md'
import typesOfLayersLine from 'docs/types-of-layers/c-line.md'
import typesOfLayersGrid from 'docs/types-of-layers/d-grid.md'
import typesOfLayersGeojson from 'docs/types-of-layers/e-geojson.md'
import typesOfLayersCluster from 'docs/types-of-layers/f-cluster.md'
import typesOfLayersIcon from 'docs/types-of-layers/g-icon.md'

export default [{
  name: "Documentation",
  path: "/documentation",
  data: [
    {
      fileLocation: "/src/docs/a-introduction.md",
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
      path: "types-of-layers",
      children: [
        {
          fileLocation: "/src/docs/types-of-layers/a-point.md",
          name: "Point",
          markdown: typesOfLayersPoint
        },
        {
          fileLocation: "/src/docs/types-of-layers/b-arc.md",
          name: "Arc",
          markdown: typesOfLayersArc
        },
        {
          fileLocation: "/src/docs/types-of-layers/c-line.md",
          name: "Line",
          markdown: typesOfLayersLine
        },
        {
          fileLocation: "/src/docs/types-of-layers/d-grid.md",
          name: "Grid",
          markdown: typesOfLayersGrid
        },
        {
          fileLocation: "/src/docs/types-of-layers/e-geojson.md",
          name: "Geo j s o n",
          markdown: typesOfLayersGeojson
        },
        {
          fileLocation: "/src/docs/types-of-layers/f-cluster.md",
          name: "Cluster",
          markdown: typesOfLayersCluster
        },
        {
          fileLocation: "/src/docs/types-of-layers/g-icon.md",
          name: "Icon",
          markdown: typesOfLayersIcon
        }
      ]
    }
  ]
}];
