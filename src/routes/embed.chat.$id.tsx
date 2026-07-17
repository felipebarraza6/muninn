import { useParams } from "react-router-dom";
import { EmbedChatPanel } from "@/components/channels/EmbedChatPanel";

/** Página pública del widget (/embed/chat/:id) — sin shell de la app. */
export default function EmbedChatPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="h-screen w-full overflow-hidden">
      <EmbedChatPanel channelId={id} />
    </div>
  );
}
