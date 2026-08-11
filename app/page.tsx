import { Player } from "@/components/Player";
import { ROOMS } from "@/lib/rooms";

export default function Page() {
  return (
    <Player
      rooms={ROOMS}
      name="Room Service"
      tagline="Slow R&B, four rooms"
      sibling={{ href: "/forecast", label: "Forecast →" }}
    />
  );
}
