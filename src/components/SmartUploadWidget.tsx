import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from "react";

interface WidgetRefMethods {
  updateWidget: (data: any) => void;
  reinitialize: () => void;
}

interface SmartUploadWidgetProps {
  urn?: string;
}

const SmartUploadWidget = forwardRef<WidgetRefMethods, SmartUploadWidgetProps>(({ urn }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isWidgetLoaded, setIsWidgetLoaded] = useState<boolean>(false);
  const [containerKey, setContainerKey] = useState<number>(0);
  const hasInitialized = useRef<boolean>(false);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useImperativeHandle(ref, () => ({
    updateWidget: (data: any) => {
      // Widget will reinitialize automatically when URN changes
    },
    reinitialize: () => {
      setContainerKey((prev) => prev + 1);
      hasInitialized.current = false;
      setIsWidgetLoaded(false);
      setTimeout(() => {
        initializeWidget();
      }, 100);
    },
  }));

  const loadCSS = (): Promise<void> => {
    return new Promise((resolve) => {
      // Check if CSS is already loaded
      if (document.querySelector('link[href="https://smartupload.diro.io/widgets/diro.css"]')) {
        resolve();
        return;
      }

      const cssLink = document.createElement("link");
      cssLink.rel = "stylesheet";
      cssLink.href = "https://smartupload.diro.io/widgets/diro.css";
      cssLink.onload = () => resolve();
      cssLink.onerror = () => {
        console.error("Failed to load Diro widget CSS");
        resolve(); // Resolve anyway to continue
      };
      document.head.appendChild(cssLink);
    });
  };

  const initializeWidget = async () => {
    if (hasInitialized.current) return;

    try {
      // Load CSS first
      await loadCSS();

      // Create the widget div immediately
      createWidgetDiv();

      // Then load the JS script
      await loadJS();

      setIsWidgetLoaded(true);
      hasInitialized.current = true;
    } catch (error) {
      console.error("Failed to initialize widget:", error);
    }
  };

  const createWidgetDiv = () => {
    if (!containerRef.current) return;

    // Clear any existing content
    containerRef.current.innerHTML = "";

    // Create the widget div with required attributes
    const widgetDiv = document.createElement("div");
    widgetDiv.id = "reactWidget";
    widgetDiv.setAttribute("data-buttonid", "O.c117bd44-8cfa-42df-99df-c4ad2ba6c6f5-F6je");
    widgetDiv.setAttribute("data-trackid", urn || "");
    widgetDiv.setAttribute(
      "wrapper",
      '{ "height": "350px", "width": "350px", "themeColor":"black", "fontFamily":"Montserrat", "fontSize":"12px" }'
    );

    // Append the widget div to the container
    containerRef.current.appendChild(widgetDiv);
  };

  const loadJS = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Remove any existing script first
      const existingScript = document.querySelector('script[src="https://smartupload.diro.io/widgets/diro.js"]');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement("script");
      script.src = "https://smartupload.diro.io/widgets/diro.js";
      script.async = true;
      script.onload = () => {
        // Give the script a moment to initialize
        setTimeout(() => {
          resolve();
        }, 100);
      };
      script.onerror = () => {
        console.error("Failed to load Diro widget script");
        reject(new Error("Failed to load widget script"));
      };

      scriptRef.current = script;
      document.head.appendChild(script);
    });
  };

  useEffect(() => {
    initializeWidget();

    // Cleanup function
    return () => {
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
      }
    };
  }, [containerKey, urn]);

  return (
    <div className="w-full max-w-md p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
      <h2 className="font-medium text-gray-800 mb-4 text-lg">Upload your bank statement</h2>
      <p className="text-gray-600 mb-6 text-sm leading-relaxed">Please select your bank to proceed with the upload.</p>
      <div className="smart-upload-widget">
        {!isWidgetLoaded && <div className="widget-loading p-4 text-center">Loading Diro widget...</div>}

        <div className="w-full flex justify-center">
          <div
            key={`smart-upload-widget-${containerKey}`}
            ref={containerRef}
            className="upload-widget-container"
          />
        </div>
      </div>
    </div>
  );
});

export default SmartUploadWidget;