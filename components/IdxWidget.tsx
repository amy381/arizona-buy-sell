"use client";

import { useEffect, useRef } from "react";

interface IdxWidgetProps {
  widgetId: string;
}

export default function IdxWidget({ widgetId }: IdxWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptId = `idxwidgetsrc-${widgetId}`;

  useEffect(() => {
    if (document.getElementById(scriptId)) return;

    const script = document.createElement("script");
    script.charset = "UTF-8";
    script.type = "text/javascript";
    script.id = scriptId;
    script.src = `//arizonabuyandsell.idxbroker.com/idx/widgets/${widgetId}`;
    document.body.appendChild(script);

    return () => {
      const existing = document.getElementById(scriptId);
      if (existing) existing.remove();
    };
  }, [widgetId, scriptId]);

  return <div ref={containerRef} id={`idx-widget-${widgetId}`} className="w-full" />;
}
