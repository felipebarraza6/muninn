import { ChannelList } from "@/components/channels/channel-list";

export default function Canales() {
  return (
    <div className="px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Canales</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Revisa los puntos de contacto que tus agentes atenderán.
        </p>
      </header>

      <ChannelList />
    </div>
  );
}
