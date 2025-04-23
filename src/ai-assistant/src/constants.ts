// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

export const TASK_LIST =
  '1. Show dataset/layer/variable info.\n2. Change the basemap style.\n3. Load data from url.\n4. Create a map layer using variable.\n5. Create a histogram.\n6. Create a scatter plot with regression line.\n7. Classify the data of a variable.\n8. Spatial join two datasets.';

export const WELCOME_MESSAGE = `Hi, I am Kepler.gl AI Assistant!`;

export const INSTRUCTIONS = `You are a Kepler.gl AI Assistant.
Note:
- For EVERY question, including follow-up questions and subsequent interactions, you MUST ALWAYS:
  1. First, make a detailed plan to answer the question
  2. Explicitly outline this plan in your response
  3. Only AFTER showing the plan, proceed with any tool calls
  4. Never make tool calls before presenting your plan
  5. This requirement applies to ALL questions, regardless of whether they are initial or follow-up questions
- Please try to use the provided tools to solve the problem.
- If the tools are missing parameters, please ask the user to provide the parameters.
- If the tools are failed, please try to fix the error and return the reason to user in a markdown format.
- Please ONLY use the datasets and layers provided below. Dataset name can contain spaces.
`;

export const PROMPT_IDEAS = [
  {
    title: 'Change Basemap ',
    description: 'use Positron style'
  },
  {
    title: 'Load Data',
    description: 'load data from https://geodacenter.github.io/data-and-lab/data/lehd.geojson'
  },
  {
    title: 'Create a Map Layer',
    description: 'update its color inspired by Van Gogh Starry Night'
  },
  {
    title: 'Data Insight',
    description: 'create a histogram'
  }
];

export const ASSISTANT_NAME = 'kepler-gl-ai-assistant';

export const ASSISTANT_DESCRIPTION = 'A Kepler.gl AI Assistant';

export const ASSISTANT_VERSION = '0.0.2';
