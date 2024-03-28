import { ChatPromptTemplate, HumanMessagePromptTemplate } from '@langchain/core/prompts';

export function logoImageAgent() {
  const userMsg =
    'Given the following token description, please generate me a logo image for the token.' +
    'The logo should be prefferably round.' +
    'The generated image MUST not contain any text.' +
    'The background color should be white.' +
    'Description: {description}';

  return new ChatPromptTemplate({
    promptMessages: [HumanMessagePromptTemplate.fromTemplate(userMsg)],
    inputVariables: ['description']
  });
}
