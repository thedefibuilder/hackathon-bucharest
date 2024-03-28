import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate
} from '@langchain/core/prompts';
import { z } from 'zod';

import { jsonAgent } from './json';

const tokenInputSchema = z.object({
  name: z.string().describe('The name of the token'),
  symbol: z.string().describe('The symbol of the token'),
  maxSupply: z.number().int().positive().describe('The maximum supply of the token'),
  premintAmount: z
    .number()
    .int()
    .positive()
    .describe('The amount of tokens to be pre-mined at deployment'),
  isBurnable: z
    .boolean()
    .describe('Whether the token is burnable, i.e. users will be able to burn their tokens')
});

export function tokenInputAgent() {
  const userMessage =
    'Given the following requirements, provide me the parameters for deploying a token contract.\n' +
    'Requirements: {requirements}';

  const systemMessage =
    'Your task is to assist users in providing the parameters for deploying a token contract.';

  const prompt = new ChatPromptTemplate({
    promptMessages: [
      SystemMessagePromptTemplate.fromTemplate(systemMessage),
      HumanMessagePromptTemplate.fromTemplate(userMessage)
    ],
    inputVariables: ['requirements']
  });

  return prompt.pipe(jsonAgent('gpt-4-turbo-preview', tokenInputSchema));
}
