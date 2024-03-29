import { ChatPromptTemplate, HumanMessagePromptTemplate } from '@langchain/core/prompts';

export function coverImageAgent() {
  const userMsg =
    'Given the following token description, please generate me a cover image for the launchpad landing page.' +
    'The image should not contain any text, and should be visually appealing to the users eye.' +
    'Description: {description}';

  return new ChatPromptTemplate({
    promptMessages: [HumanMessagePromptTemplate.fromTemplate(userMsg)],
    inputVariables: ['description']
  });
}
