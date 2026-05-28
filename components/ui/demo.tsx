import { OrbitalLoader } from "@/components/ui/orbital-loader";
import { GooeyText } from "@/components/ui/gooey-text-morphing";

export default function DemoOne() {
  return <OrbitalLoader />;
}

export function GooeyTextDemo() {
  return (
    <div className="h-[200px] flex items-center justify-center">
      <GooeyText
        texts={["Design", "Engineering", "Is", "Awesome"]}
        morphTime={0.3}
        cooldownTime={1.2}
        className="font-bold"
      />
    </div>
  );
}
