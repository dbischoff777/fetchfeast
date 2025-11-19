import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex h-screen overflow-hidden flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-yellow-50 p-4 md:p-6 lg:p-8">
      <main className="flex w-full max-w-4xl h-full flex-col items-center justify-center gap-4 md:gap-6 text-center">
        {/* Welcome Section */}
        <div className="flex flex-col items-center gap-3 md:gap-4 flex-shrink-0">
          {/* Frenchie Logo/Mascot */}
          <div className="relative w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 animate-bounce-slow flex-shrink-0">
            <Image
              src="/assets/images/frenchie.png"
              alt="Fetch & Feast Mascot - Friendly French Bulldog"
              width={224}
              height={224}
              className="w-full h-full object-contain drop-shadow-2xl"
              priority
              unoptimized
            />
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight text-blue-700 drop-shadow-lg">
            Fetch & Feast
          </h1>
          <p className="text-base md:text-xl lg:text-2xl text-blue-900 font-semibold px-4">
            Welcome! Ready to play with your furry friend?
          </p>
        </div>

        {/* Call to Action */}
        <div className="flex flex-col items-center gap-3 md:gap-4 flex-shrink-0">
          <Link href="/game" className="block">
            <Button
              size="lg"
              className="h-24 w-48 text-xl font-semibold transition-transform active:scale-95 md:h-32 md:w-64 md:text-2xl lg:h-36 lg:w-72 lg:text-3xl bg-blue-600 hover:bg-blue-700 text-white shadow-xl"
              aria-label="Start Game"
            >
              Start Playing!
            </Button>
          </Link>
        </div>

        {/* Instructions */}
        <div className="w-full max-w-2xl rounded-2xl md:rounded-3xl bg-yellow-100/95 border-4 border-blue-500 p-4 md:p-6 lg:p-8 shadow-lg flex-shrink overflow-y-auto max-h-[30vh] md:max-h-[35vh]">
          <h2 className="mb-3 md:mb-4 text-xl md:text-2xl lg:text-3xl font-semibold text-blue-800">
            How to Play
          </h2>
          <ul className="flex flex-col gap-2 md:gap-3 text-left text-sm md:text-base lg:text-lg text-blue-900 font-medium">
            <li className="flex items-start gap-2 md:gap-3">
              <span className="text-xl md:text-2xl flex-shrink-0" aria-hidden="true">
                🐾
              </span>
              <span>Watch for animated objects moving across the screen</span>
            </li>
            <li className="flex items-start gap-2 md:gap-3">
              <span className="text-xl md:text-2xl flex-shrink-0" aria-hidden="true">
                🐾
              </span>
              <span>Tap on them quickly to earn points</span>
            </li>
            <li className="flex items-start gap-2 md:gap-3">
              <span className="text-xl md:text-2xl flex-shrink-0" aria-hidden="true">
                🐾
              </span>
              <span>Be careful! You have 5 lives</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
