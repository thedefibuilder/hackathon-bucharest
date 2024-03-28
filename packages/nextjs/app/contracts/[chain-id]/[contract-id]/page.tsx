import React from 'react';

import Sidebar from '~~/components/sidebar';

type TContractPage = {
  params: {
    'chain-id': string;
    'contract-id': string;
  };
};

export default function ContractPage({ params }: TContractPage) {
  return (
    <div className='flex flex-1 items-start'>
      <Sidebar>
        <div className='gap-y-2.5'>
          <button className='btn btn-primary'>Admin</button>
          <button className='btn btn-primary'>ENS</button>
        </div>
      </Sidebar>

      <section className='h-full w-full flex-1 border-2 border-red-400'>
        <h1>
          Contract page: {params['chain-id']} / {params['contract-id']}
        </h1>
      </section>
    </div>
  );
}
