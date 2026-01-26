import SequentialTyping from './components/SequentialTyping'

export default function Home() {
  return (
    <div className="flex flex-col gap-5 min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <SequentialTyping
        items={[
          {
            text: `$ cd ~/kendall-adkins && ./portfolio\n\n> ready at https://kendalladkins.dev`,
            isCodeBlock: true,
            persist: false,
            speed: 75,
            pauseBetween: 1500,
          },
          {
            text: 'Software Engineer. Occasional Explorer. Constant Tinkerer.',
            className: 'text-center',
            persist: true,
            speed: 25,
          },
        ]}
      />
    </div>
  )
}
