import { component$, Resource, useResource$, useSignal } from '@builder.io/qwik';

export default component$(() => {
  console.log('🎁🎀🎁🎁');
  const name = useSignal<string>();

  const ageResource = useResource$<{
    name: string;
    age: number;
    count: number;
  }>(async ({ track, cleanup }) => {
    track(() => name.value);
    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));
    console.log(`https://api.agify.io?name=${name.value}`);
    const res = await fetch(`https://api.agify.io?name=${name.value}`, {
      signal: abortController.signal,
    });
    // console.log('fecth:::', res.json());
    return res.json();
  });

  return (
    <div>
      <h1>Enter your name, and I'll guess your age!</h1>
      <input onInput$={(e: Event) => (name.value = (e.target as HTMLInputElement).value)} />
      <Resource
        value={ageResource}
        onPending={() => <div>Loading...</div>}
        onRejected={() => <div>Failed to person data</div>}
        onResolved={(ageGuess) => {
          return (
            <div id="anios">
              {name.value && (
                <>
                  {ageGuess.name} {ageGuess.age} years
                </>
              )}
            </div>
          );
        }}
      />
    </div>
  );
});
