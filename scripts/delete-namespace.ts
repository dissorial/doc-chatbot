import { pinecone } from '@/utils/pinecone-client';

export const run = async () => {
  const targetIndex = 'leaf';
  const targetNamespace = 'gap';

  try {
    const index = pinecone.Index(targetIndex);
    await index._delete({
      deleteRequest: {
        namespace: targetNamespace,
        deleteAll: true,
      },
    });
  } catch (error) {
    console.log('error', error);
    throw new Error('Failed to delete your namespace');
  }
};

(async () => {
  await run();
  console.log('delete complete');
})();
