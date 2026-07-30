import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  children: ReactNode;
  /** Título corto en la UI de fallback. */
  title?: string;
};

type State = {
  error: Error | null;
};

/**
 * Captura errores de render no manejados y evita pantalla blanca.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ error: null });
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="flex min-h-[50dvh] flex-col items-center justify-center gap-4 px-6 py-12 text-center">
        <div className="space-y-2 max-w-md">
          <h2 className="text-lg font-semibold tracking-tight">
            {this.props.title ?? "Algo salió mal"}
          </h2>
          <p className="text-sm text-muted-foreground">
            La interfaz encontró un error inesperado. Puedes reintentar o recargar la página.
          </p>
          {import.meta.env.DEV && this.state.error.message ? (
            <p className="text-xs font-mono text-destructive/90 break-words pt-1">
              {this.state.error.message}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button type="button" variant="outline" onClick={this.handleReset}>
            Reintentar
          </Button>
          <Button type="button" onClick={this.handleReload}>
            Recargar
          </Button>
        </div>
      </div>
    );
  }
}
