import { StringOutputParser } from '@langchain/core/output_parsers';
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate
} from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { env } from '~~/env';

export function roadmapAgent() {
  const userMessage = 'Description: {description}';

  const systemMessage =
    'Your task is to assist users in providing the roadmap for their crypto token project given a description.' +
    'The roadmap should be the max 1000 characters length.';

  const prompt = new ChatPromptTemplate({
    promptMessages: [
      SystemMessagePromptTemplate.fromTemplate(systemMessage),
      HumanMessagePromptTemplate.fromTemplate(userMessage)
    ],
    inputVariables: ['description']
  });

  const llm = new ChatOpenAI({
    openAIApiKey: env.OPENAI_API_KEY,
    modelName: 'gpt-4-turbo-preview',
    temperature: 0.5,
    modelKwargs: { seed: 1337 },
    streaming: true
  });

  return prompt.pipe(llm).pipe(new StringOutputParser());
}
