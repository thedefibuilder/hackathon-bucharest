import { StringOutputParser } from '@langchain/core/output_parsers';
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate
} from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { env } from '~~/env';

export function descriptionAgent() {
  const systemMsg =
    'Your task is to assist users in providing the description for their crypto token project given a prompt.' +
    'The description should be max 1000 characters length.';
  const userMsg = 'Prompt: {prompt}';

  const prompt = new ChatPromptTemplate({
    promptMessages: [
      SystemMessagePromptTemplate.fromTemplate(systemMsg),
      HumanMessagePromptTemplate.fromTemplate(userMsg)
    ],
    inputVariables: ['prompt']
  });

  const llm = new ChatOpenAI({
    openAIApiKey: env.OPENAI_API_KEY,
    modelName: 'gpt-4-turbo-preview',
    temperature: 0.5,
    modelKwargs: { seed: 1337 }
  });

  return prompt.pipe(llm).pipe(new StringOutputParser());
}
