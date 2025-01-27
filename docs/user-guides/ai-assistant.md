# AI Assistant

> Note: This feature is currently undergoing development. Stay tuned for updates!

kepler.gl's AI assistant can help with many steps of your geospatial analysis:

- Data Loading: Assists with SQL queries, data filtering, and data interpretation.
- Basic Visualization: Helps customize base maps, color schemes, and other layer elements.
- Advanced Analysis: Can help with tasks like spatial joins between points and polygons, creating histograms and scatter plots, and much more.

While you can chat with it using the model and provider of your choosing, kepler.gl's AI assistant is heavily integrated with the mapping application, automatically updating the map, synchronizing selections between the AI assistant panel and the layers, and much more.

<!-- Gif -->

## Supported Providers

The following providers and models are currently supported. 

> Note: New providers and models are always under consideration.

| **Provider** | **Models**                                                                                      |
|--------------|------------------------------------------------------------------------------------------------|
| **OpenAI**   | `gpt-4o`, `gpt-4o-mini`, `gpt-3.5-turbo`, `gpt-3.5-turbo-0125`, `o1-mini`, `o1-preview`          |
| **Google**   | `gemini-2.0-flash-exp`, `gemini-1.5-flash`, `gemini-1.5-pro`, `gemini-1.0-pro`                   |
| **Ollama** (local)  | `phi4`, `phi3.5`, `qwen2.5-coder`, `qwen2`, `qawa`, `llava`, `mistral`, `gemma2`, `llama3.3`, `llama3.2`, `llama3.1`, `llama3.1:70b` |


## Parameters

Before initating the AI assistant, the following parameters are required. A temperature and Top P are selected for you; however, you will need to provide an API key for a remote model, and a base URL for local models. 

| **Parameter** | **Description**                                                                                 |
|---------------|-------------------------------------------------------------------------------------------------|
| **Temperature** | Controls the randomness of the model's output. Range: `0-2`, Default: `1`. Lower values make responses more focused and deterministic. |
| **Top P**       | Controls the diversity of the output by limiting the cumulative probability of token selection. Range: `0-1`, Default: `0.8`.          |
| **API Key**   | Required for OpenAI (`gpt` models) and Google (`gemini` models).                                                                      |
| **Base URL**  | Required for Ollama (`localhost:11434` or another specified base URL).                                                                |


