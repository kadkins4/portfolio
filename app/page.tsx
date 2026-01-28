import SequentialTyping from '@/components/ui/SequentialTyping'

export default function Home() {
  return (
    <div className="flex flex-col gap-5 min-h-screen w-full items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <SequentialTyping
        items={[
          {
            text: `$ cd ~/kendall-adkins && ./portfolio\n\n> ready at https://kendalladkins.dev`,
            isCodeBlock: true,
            className: 'min-w-[380px]',
            persist: false,
            speed: 75,
            pauseBetween: 1500,
          },
          {
            text: 'Kendall Adkins',
            className: 'text-center font-bold text-3xl',
            persist: true,
            speed: 25,
          },
          {
            text: 'Software Engineer',
            className: 'text-center',
            persist: true,
            speed: 25,
          },
        ]}
      />
    </div>
  )
}

// text: `Novice Woodworker. Occasional Explorer. Constant Tinkerer. Budding Yogi. Intramural Athlete. Software Engineer...`,
// isCodeBlock: true,
// Budding Yogi. Intramural Athlete. Novice Woodworker.
// Washed Gamer. Coffee Shop Nomad. Ranked Queue Survivor.
// Optimistic Realist. Low-Key Overthinker. Novice Woodworker.
// Professional Googler. High-Key Nerd. Sunset Chaser. Side Projector.
// Friendly Competitor. Clutch Sometimes. Mostly Consistently.
// Boardgame Winner. Scrabble Nerd. Gaming Unc. NFL Enthusiast.
// Happy Hour-er. Beach Volleyballer. Reluctant Weightlifter.

// CHAT GPT IDEAS: https://chatgpt.com/share/697983b0-2758-8006-b01b-cead6249ead2

// software engineer at the end...
