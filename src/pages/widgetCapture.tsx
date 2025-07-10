
import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from "react";
import "../../stylesSelectLink.css";

// Define types for the widget instance
interface WidgetInstance {
  update: (data: any) => void;
  destroy?: () => void;
}

// Define types for the widget initialization options
interface WidgetOptions {
  targetUrl: string;
  buttonText: string;
  allowRedirection: boolean;
  openWith: string;
  containerStyles: {
    backgroundColor: string;
    padding: string;
    borderRadius: string;
  };
  buttonStyles: {
    fontSize: string;
    borderRadius: string;
    width: string;
  };
  containerClassName?: string;
  buttonClassName?: string;
}

interface WidgetRefMethods {
  updateWidget: (data: any) => void;
  reinitialize: () => void;
}

interface WidgetCaptureProps {
  urn?: string;
}

const WidgetDemo = forwardRef<WidgetRefMethods, WidgetCaptureProps>(({ urn }, ref) => {
  const [containerKey, setContainerKey] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetInstance = useRef<WidgetInstance | null>(null);
  const [isWidgetLoaded, setIsWidgetLoaded] = useState<boolean>(false);
  const hasInitialized = useRef<boolean>(false);

  useImperativeHandle(ref, () => ({
    updateWidget: (data: any) => {
      if (widgetInstance.current) {
        widgetInstance.current.update(data);
      }
    },
    reinitialize: () => {
      cleanup();
      setContainerKey((prev) => prev + 1);
      hasInitialized.current = false;
      setTimeout(() => {
        initializeWidgetProcess();
      }, 100);
    },
  }));

  const cleanup = (): void => {
    if (widgetInstance.current && widgetInstance.current.destroy) {
      try {
        widgetInstance.current.destroy();
      } catch (e) {
        console.error("Error destroying widget:", e);
      }
      widgetInstance.current = null;
      setIsWidgetLoaded(false);
    }
  };

  useEffect(() => {
    return cleanup;
  }, []);

  const initializeWidgetProcess = (): (() => void) | void => {
    if (hasInitialized.current) return;

    if (typeof (window as any).initializeDiroWidget === "function") {
      initializeWidget();
      hasInitialized.current = true;
    } else {
      const checkInterval = setInterval(() => {
        if (typeof (window as any).initializeDiroWidget === "function") {
          initializeWidget();
          hasInitialized.current = true;
          clearInterval(checkInterval);
        }
      }, 200);

      setTimeout(() => clearInterval(checkInterval), 10000);

      return () => clearInterval(checkInterval);
    }
  };

  useEffect(() => {
    const timer = setTimeout(initializeWidgetProcess, 300);
    return () => clearTimeout(timer);
  }, [containerKey]);

  const initializeWidget = (): void => {
    if (!containerRef.current || widgetInstance.current) return;

    try {
      const widgetContainer = document.createElement("div");
      widgetContainer.id = `diro-widget-inner-${containerKey}`;

      if (containerRef.current) {
        containerRef.current.innerHTML = "";
        containerRef.current.appendChild(widgetContainer);
      }

      const formattedDate = urn ? urn.replace(/-/g, '/') : '';
      const displayDate = urn ? (() => {
        // Parse date as local date to avoid timezone shifts
        const dateParts = urn.split('-');
        const localDate = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
        return localDate.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      })() : '';
      const instruction = urn ? encodeURIComponent(`Download your bank statement as of ${displayDate}`) : '';
      const targetUrl = urn
        ? `https://verification.diro.io/?buttonid=O.c117bd44-8cfa-42df-99df-c4ad2ba6c6f5-3hpi&balanceOnDate=${formattedDate}&instruction=${instruction}`
        : "https://verification.diro.io/?buttonid=O.c117bd44-8cfa-42df-99df-c4ad2ba6c6f5-3hpi&balanceOnDate=&instruction=";

      (window as any).initializeDiroWidget(widgetContainer, {
        targetUrl: targetUrl,
        allowRedirection: true,
        buttonText: "Start verification",
        openWith: "sametab",
        containerStyles: {
          backgroundColor: "#ffffff",
          padding: "20px",
          borderRadius: "12px"
        },
        buttonStyles: {
          fontSize: "16px",
          borderRadius: "12px",
          width: "webkit",
        },
      });

      // Create a minimal instance since the function doesn't return one
      widgetInstance.current = {
        update: () => {},
        destroy: () => {
          if (widgetContainer.parentNode) {
            widgetContainer.parentNode.removeChild(widgetContainer);
          }
        },
      };

      setIsWidgetLoaded(true);
    } catch (error) {
      console.error("Error initializing Diro widget:", error);
      hasInitialized.current = false;
    }
  };

  return (
    <React.Fragment>
      {!isWidgetLoaded && <div className="widget-loading p-4 text-center">Loading Diro widget...</div>}

      <div className="w-full">
        <div
          key={`diro-container-${containerKey}`}
          className="diro-widget"
          id={`diro-widget-container-${containerKey}`}
          ref={containerRef}
          style={{ display: isWidgetLoaded ? "block" : "none", minHeight: "120px" }}
        />
      </div>
    </React.Fragment>
  );
});

export default WidgetDemo;
