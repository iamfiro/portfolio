import { Hero, PixelBlast } from "@/feature/home/components";

import s from "./home.module.scss";

export default function Home() {
  return (
    <main className={s.container}>
      <div style={{ width: "100%", height: "100vh", position: "relative" }}>
        <PixelBlast
          variant="circle"
          pixelSize={6}
          color="#a290e0"
          patternScale={7}
          patternDensity={1.6}
          pixelSizeJitter={2}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          speed={0.6}
          edgeFade={0}
        />
      </div>
      <Hero />
    </main>
  );
}
