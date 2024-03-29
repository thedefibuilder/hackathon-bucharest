type TWalletError = {
  title: string;
  message: string;
};

export function mapWalletErrorsToMessage(error: unknown) {
  const defaultTitle = 'Unexpected error';
  const defaultMessage = 'Something horribly wrong happened with your transaction.';

  if (
    error !== null &&
    error !== undefined &&
    typeof error === 'object' &&
    'name' in error &&
    typeof error.name === 'string'
  ) {
    switch (error.name) {
      case 'SyntaxError': {
        return {
          title: 'Error - Syntax',
          message: 'You misspelled one or more constructor arguments.'
        };
      }
      case 'UserRejectedRequestError': {
        return {
          title: 'Error - Signature',
          message: 'You denied transaction signature.'
        };
      }
      case 'TransactionExecutionError': {
        return {
          title: 'Error - Transaction execution',
          message: 'You rejected the request.'
        };
      }
      case 'SwitchChainError': {
        return {
          title: 'Error - Switch chain',
          message: 'A switching request is already pending.'
        };
      }
      case 'ContractFunctionExecutionError': {
        return {
          title: 'Error - Method execution',
          message: 'Total gas fee exceeds account balance.'
        };
      }
      default: {
        return {
          title: defaultTitle,
          message: defaultMessage
        };
      }
    }
  }

  return {
    title: defaultTitle,
    message: defaultMessage
  };
}

export type { TWalletError };
