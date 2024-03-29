import { Message } from 'ai';

export enum ESteps {
  DESCRIPTION,
  ROADMAP,
  LOGO,
  COVER,
  TOKEN_INPUTS
}

export type TChatInput = {
  messages: Message[];
  step: ESteps;
};

export type TCoverInput = {
  description: string;
};

export type TDescriptionInput = {
  prompt: string;
};

export type TTokenInput = {
  description: string;
};

export type TLogoInput = {
  description: string;
};

export type TRoadmapInput = {
  description: string;
};
