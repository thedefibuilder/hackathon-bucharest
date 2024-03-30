'use client';

import React, { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Tabs, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { useToast } from '~~/components/ui/toast/use-toast';
import { airstreamTabs, TAirstreamTab } from '~~/lib/tabs';
import { tokenSchema, TTokenSchema } from '~~/schemas/token';
import { TSablierStreamOutput } from '~~/types/api';
import { useForm } from 'react-hook-form';

import TokenTab from './_components/tabs/token';

export default function AirstreamPage() {
  const [activeTab, setActiveTab] = useState<TAirstreamTab>(airstreamTabs.token);
  const [streamResponse, setStreamResponse] = useState<TSablierStreamOutput | null>(null);
  const { toast } = useToast();

  const tokenForm = useForm<TTokenSchema>({
    resolver: zodResolver(tokenSchema),
    defaultValues: {
      token: '',
      recipients: '',
      root: '',
      total: ''
    }
  });

  function onContinueClick(tab: TAirstreamTab) {
    setActiveTab(tab);
  }

  function onCSVUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files && event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log(reader.result);

        fetch('/api/stream', {
          method: 'POST',
          body: JSON.stringify({
            csv: reader.result
          })
        }).then((response) => {
          if (response.ok) {
            response.json().then((data: TSablierStreamOutput) => {
              setStreamResponse(data);
              tokenForm.setValue('recipients', data.recipients);
              tokenForm.setValue('root', data.root);
              tokenForm.setValue('total', data.total);
            });
          } else {
            toast({
              variant: 'destructive',
              title: 'Failed to upload CSV'
            });
          }
        });
      };
      reader.readAsText(file);
    }
  }

  return (
    <div className='flex h-[calc(100%-2.5rem)] w-full flex-col'>
      <Tabs defaultValue={activeTab} value={activeTab} className='h-full w-full'>
        <TabsList className='mb-2.5 w-full'>
          {Object.values(airstreamTabs).map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className='w-1/5'
              disabled={false} // todo
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </TabsTrigger>
          ))}
          <TokenTab form={tokenForm} onContinueClick={onContinueClick} onCSVUpload={onCSVUpload} />
        </TabsList>
      </Tabs>
    </div>
  );
}
