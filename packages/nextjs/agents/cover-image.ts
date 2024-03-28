import { ChatPromptTemplate, HumanMessagePromptTemplate } from '@langchain/core/prompts';

export function coverImageAgent() {
  const userMsg =
    'Given the following token description, please generate me a cover image for the launchpad landing page.' +
    'Description: {description}';

  return new ChatPromptTemplate({
    promptMessages: [HumanMessagePromptTemplate.fromTemplate(userMsg)],
    inputVariables: ['description']
  });
}
