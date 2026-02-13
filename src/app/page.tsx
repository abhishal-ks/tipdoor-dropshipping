import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-r from-violet-400 via-green-500 to-gray-950">
        <h1 className="text-5xl font-bold text-white mb-4">console.log("Hello Universe");</h1>
        <p className="text-xl text-white mb-8">Across the event horizon of consciousness.</p>
        <Image
          src="/universe.png"
          alt="Universe"
          width={400}
          height={400}
          className="rounded-full border-4 border-white shadow-lg"
        />
      </div>
    </>
  );
}
