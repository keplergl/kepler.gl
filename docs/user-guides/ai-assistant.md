# AI Assistant

> Note: This feature is currently undergoing development. Stay tuned for updates!

The AI assistant in Kepler.gl is not only a LLM based chatbot, it is engineered to help users with creating maps and analyzing their spatial data. The AI assistant provides a new way that allows users to interact with the data and the map in a more natural and creative way.

![AI Assistant](https://4sq-studio-public.s3.us-west-2.amazonaws.com/statics/keplergl/images/kepler-ai-assistant.png 'AI Assistant')

Your conversations can be advanced: `Create a geojson layer using population with quantile color scale and update its colors inspired by Van Gogh's Starry Night`. Or: `Check the correlation between temperature and precipitation in the dataset`.

## Supported Providers

The following providers and models are currently supported.

> Note: we are working on feature to allow users specify their own providers, models and base URL.

| **Provider**       | **Models**                                                                                                                                          |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **OpenAI**         | `gpt-4o`, `gpt-4o-mini`, `gpt-3.5-turbo`, `gpt-3.5-turbo-0125`, `o1-mini`, `o1-preview`                                                             |
| **Google**         | `gemini-2.0-flash-exp`, `gemini-1.5-flash`, `gemini-1.5-pro`, `gemini-1.0-pro`                                                                      |
| **Ollama** (local) | `deepseek-r1`, `phi4`, `phi3.5`, `qwen2.5-coder`, `qwen2`, `qawa`, `llava`, `mistral`, `gemma2`, `llama3.3`, `llama3.2`, `llama3.1`, `llama3.1:70b` |
| **DeepSeek**       | `deepseek-chat`, `deepseek-reasoner`                                                                                                                |

## Parameters

Before initating the AI assistant, the following parameters are required. A temperature and Top P are selected for you; however, you will need to provide an API key for a remote model, and a base URL for local models.

| **Parameter**   | **Description**                                                                                                                        |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Temperature** | Controls the randomness of the model's output. Range: `0-2`, Default: `1`. Lower values make responses more focused and deterministic. |
| **Top P**       | Controls the diversity of the output by limiting the cumulative probability of token selection. Range: `0-1`, Default: `0.8`.          |
| **API Key**     | Required for OpenAI (`gpt` models) and Google (`gemini` models).                                                                       |
| **Base URL**    | Required for Ollama (`localhost:11434` or another specified base URL).                                                                 |

## Built-in Features

- Take screenshot to ask [[Demo]](https://geoda.ai/img/highlight-screenshot.mp4)
- Talk to ask [[Demo]](https://geoda.ai/img/highlight-ai-talk.mp4)

### Take a Screenshot to Ask

This feature enables users to capture a screenshot anywhere within kepler.gl application and ask questions about the screenshot.

For example, users can take a screenshot of the map (or partial of the map) and ask questions about the map e.g. _`how many counties are in this screenshot`_, or take a screenshot of the layer configuration panel and ask questions about how to use it, e.g. _`How can I adjust the opacity`_. Users can even take a screenshot of the plots in the chat panel and ask questions about the plots e.g. _`Can you give me a summary of the plot?`_.

![Screenshot to ask](https://4sq-studio-public.s3.us-west-2.amazonaws.com/statics/keplergl/images/kepler-ai-assistant-screenshot.png 'Screenshot to ask')

#### How to use this feature?

1. Click the "Screenshot to Ask" button in the chat interface
2. A semi-transparent overlay will appear
3. Click and drag to select the area you want to capture
4. Release to complete the capture
5. The screenshot will be displayed in the chat interface
6. You can click the x button on the top right corner of the screenshot to delete the screenshot

### Talk to Ask

This feature enables users to "talk" to the AI assistant. After clicking the "Talk to Ask" button, users can start talking using microphone. When clicking the same button again, the AI assistant will stop listening and send the transcript to the input box.

When using the voice-to-text feature for the first time, users will be prompted to grant microphone access. The browser will display a permission dialog that looks like this:

![Talk to ask](https://4sq-studio-public.s3.us-west-2.amazonaws.com/statics/keplergl/images/kepler-ai-assistant-talk-to-ask.png 'Talk to ask')

After granting access, users can start talking to the AI assistant.

> Note: for OpenAI, the whisper model is used to transcribe the audio. Google's gemini models are multimodal models, so the audio-to-text feature is supported by default.

## Map and Data Analysis Assistant

Using LLM function tools, kepler.gl's AI assistant can help transform users's prompt into actions that executed inside kepler.gl. This allows users to interact with kepler.gl in a more natural and creative way.

### Why use LLM function tools?

Function calling enables the AI Assistant to perform specialized tasks that LLMs cannot handle directly, such as complex calculations, data analysis, visualization generation, and integration with external services. This allows the assistant to execute specific operations within kepler.gl while maintaining natural language interaction with users.

### Is my data secure?

Yes, the data you used in kepler.gl stays within the browser, and will **never** be sent to the LLM. Using function tools, we can engineer the AI assistant to use only the meta data for function calling, e.g. the name of the dataset, the name of the layer, the name of the variables, etc. Here is a process diagram to show how the AI assistant works:

![AI Assistant Diagram](https://4sq-studio-public.s3.us-west-2.amazonaws.com/statics/keplergl/images/kepler-ai-assistant-diagram.png 'AI Assistant Diagram')

### Actions available to use

The current supported actions are:

- System:
  - Show dataset/layer/variable info.
  - Load data from url.
  - Change the basemap style.
- Mapping and Data Analysis:
  - Create map layer from variable.
  - Query the data using SQL (coming soon)
  - Classify the data of a variable.
    - Quantile / Natural (Jenks) Breaks / Percentile / Box / Standard Deviation
- Plots
  - Create histogram.
  - Create scatter plot with regression line.
- Spatial Analysis:
  - Spatial join two datasets (e.g. count points and polygons).

> Note: to see our plan to add more actions to the AI assistant, please check out this [Kepler.gl RFC](<[https://github.com/kepler-gl/kepler.gl/issues/4689](https://github.com/keplergl/kepler.gl/discussions/2843)>) and the [integration of GeoDa with Kepler.gl](<[text](https://github.com/GeoDaCenter/openassistant/wiki/Integration-Kepler.gl---GeoDaLib)>)

Users can simply describe what they want to accomplish in plain text, and the AI Assistant will invoke the appropriate function with the correct parameters that your application can execute. The LLM will identify if the question can be answered by using one or multiple function tools, and the LLM will ask the user to confirm the parameters of each function call.

> _Can you classify the data of the variable "population" using natural breaks and create a geojson layer using the breaks with colors inspired by Van Gogh's Starry Night._

#### Plots

The plots created by the AI assistant are interactive, and can be used to explore the data.

In each plot, there is a small toolbar on the top right corner, which contains three buttons:

- **Box Select**: Select the data in the plot.
- **Keep Selection**: Keep the selected data in the plot.
- **Clear Selection**: Clear the selected data in the plot.

One can click the **Box Select** button first. Then, start selecting the data in the plot by left clicking the mouse and dragging the mouse to select the data. The selected data will be highlighted in the plot and also be highlighted in the map.

##### Scatter Plot

For scatter plot, the AI assistant will create a scatter plot with a regression line by default. If users select points in the plot, there will be 3 different regression lines created: one for all points, one for the selected points, and one for the unselected points.

If users click the 'expand' button on the top right corner of the plot, the plot will be expanded to a floating modal dialog with more details of the regressions shown in a tablt.

The regression details include:

- R-squared
- Slope
- Intercept
- P-value
- Standard Error
- Chow test for selected and unselected regression lines

This scatter plot can help users to explore the relationship between two variables, and explore the heterogeneity of the data by selecting different points.

![Scatterplot](https://4sq-studio-public.s3.us-west-2.amazonaws.com/statics/keplergl/images/kepler-ai-assistant-scatterplot.png 'Scatterplot')
