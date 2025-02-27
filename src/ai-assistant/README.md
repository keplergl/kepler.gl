# Kepler.gl AI Assistant Module

The AI Assistant is a module that adds an AI chatbot to Kepler.gl. This module aims to integrates Kepler.gl with AI-powered capabilities, enabling it to interact with multiple AI models seamlessly.

## Overview

The AI Assistant Module facilitates communication, processes prompts, and optionally calls back into the main application to deliver results. This setup supports advanced functionalities like tool-based function calling for enhanced interactivity.

![image](https://github.com/user-attachments/assets/77a240f1-037f-488e-8261-b7e82c42606d)

The system is designed to enable Kepler.gl, a React-based single-page application, to integrate an AI Assistant Module for performing tasks with large language models (LLMs) like OpenAI GPT models, Google Gemini models, and Ollama models.

An example of how the AI Assistant Module can be used to update a basemap in Kepler.gl:

![image](https://github.com/user-attachments/assets/17992157-3393-4fcb-8e72-7edf46268c6c)

This flow enables a seamless interaction where a user can update a basemap in Kepler.gl through a simple AI-driven prompt, showcasing the integration of LLMs with application actions and rendering.

The AI Assistant Module `OpenAssistant` (Github: https://github.com/geodacenter/openassistant) is a open-source project that helps adding AI capabilities to your React SPA applications while keeping your data secure and private.

Key features:

- Built-in chat UI.
- Built-in "Screenshot to Ask" feature.
- Built-in "Talk to Ask" feature.
- Support OpenAI, Google Gemini, Ollama models.
- Support function calling with type hint.
- Support custom message UI for function calling.
- Addons:
  - query your dataset using duckdb
  - map your data
  - analyze and visualize your data
    ...

## Proposal

From the previous PRs, we have a working prototype of the AI Assistant Module with the following features:

1. Show dataset/layer/variable info.
2. Change the basemap style.
3. Load data from url.
4. Create a map layer using variable.
5. Create a histogram.
6. Create a scatter plot with regression line.
7. Classify the data of a variable.
8. Spatial join two datasets.

The next step is to integrate more kepler.gl features into the AI Assistant Module.

### P0

Support more kepler.gl map layers

- [x] create map layer based on the dataset metadata (variable names and types)
- [ ] edit layer properties based on the [layer attributes](https://docs.kepler.gl/docs/user-guides/d-layer-attributes)
- [ ] blend and rearrange layers

Support color palette

- [ ] choose color palette for the layer
- [x] create custom color palette

Support custom map styles

- [ ] choose map layers (water, buildings, roads, etc.)
- [ ] create custom map style from url

Support map settings

- [ ] update map legend for the layer
- [ ] set split map (guide user to choose maps to split on left and right)

Support time playback

- [ ] identify the time variable from the dataset metadata
- [ ] set time playback for the layer
