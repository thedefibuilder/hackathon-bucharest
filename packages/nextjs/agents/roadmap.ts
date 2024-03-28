import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate
} from '@langchain/core/prompts';

export function roadmapAgent() {
  const userMessage =
    'Given the following description, provide me the roadmap for the token.\n' +
    'Description: {description}';

  const systemMessage = 'Your task is to assist users in providing the roadmap for the project.';

  const prompt = new ChatPromptTemplate({
    promptMessages: [
      SystemMessagePromptTemplate.fromTemplate(systemMessage),
      HumanMessagePromptTemplate.fromTemplate(userMessage)
    ],
    inputVariables: ['description']
  });
}
