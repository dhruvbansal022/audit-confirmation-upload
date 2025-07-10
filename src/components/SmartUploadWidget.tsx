import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from "react";
interface WidgetRefMethods {
  updateWidget: (data: any) => void;
  reinitialize: () => void;
}
interface SmartUploadWidgetProps {
  urn?: string;
}
const SmartUploadWidget = forwardRef<WidgetRefMethods, SmartUploadWidgetProps>(({
  urn
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isWidgetLoaded, setIsWidgetLoaded] = useState<boolean>(false);
  const [containerKey, setContainerKey] = useState<number>(0);
  const [sessionId, setSessionId] = useState<string>("");
  const hasInitialized = useRef<boolean>(false);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  useImperativeHandle(ref, () => ({
    updateWidget: (data: any) => {
      // Widget will reinitialize automatically when URN changes
    },
    reinitialize: () => {
      setContainerKey(prev => prev + 1);
      hasInitialized.current = false;
      setIsWidgetLoaded(false);
      setTimeout(() => {
        initializeWidget();
      }, 100);
    }
  }));
  const loadCSS = (): Promise<void> => {
    return new Promise(resolve => {
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
    widgetDiv.setAttribute("wrapper", '{ "height": "350px", "width": "350px", "themeColor":"black", "fontFamily":"Montserrat", "fontSize":"12px" }');

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

    // Monitor network requests for updatesession API
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      
      // Check if this is an updatesession API call
      if (args[0] && typeof args[0] === 'string' && args[0].includes('updatesession')) {
        try {
          const clonedResponse = response.clone();
          const data = await clonedResponse.json();
          if (data?.sessionid) {
            setSessionId(data.sessionid);
          }
        } catch (error) {
          console.error('Error parsing updatesession response:', error);
        }
      }
      
      return response;
    };

    // Also monitor XMLHttpRequest for updatesession API
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;
    
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
      this._url = url;
      return originalXHROpen.call(this, method, url, ...args);
    };
    
    XMLHttpRequest.prototype.send = function(...args) {
      this.addEventListener('load', function() {
        if (this._url && this._url.includes('updatesession')) {
          try {
            const data = JSON.parse(this.responseText);
            if (data?.sessionid) {
              setSessionId(data.sessionid);
            }
          } catch (error) {
            console.error('Error parsing updatesession response:', error);
          }
        }
      });
      return originalXHRSend.call(this, ...args);
    };

    // Add custom CSS to center the widget content
    const customCSS = `
      .upload-widget-container #reactWidget {
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        text-align: center !important;
      }
      
      .upload-widget-container #reactWidget * {
        text-align: center !important;
      }
      
      .upload-widget-container .diro-upload-area,
      .upload-widget-container [class*="upload"],
      .upload-widget-container [class*="drop"] {
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        align-items: center !important;
        text-align: center !important;
      }
      
      .upload-widget-container .upload-icon,
      .upload-widget-container .cloud-icon,
      .upload-widget-container [class*="icon"],
      .upload-widget-container svg {
        margin: 0 auto !important;
        display: block !important;
      }
    `;

    const styleElement = document.createElement('style');
    styleElement.textContent = customCSS;
    styleElement.id = 'diro-widget-custom-styles';
    
    // Remove existing custom styles if any
    const existingStyles = document.getElementById('diro-widget-custom-styles');
    if (existingStyles) {
      existingStyles.remove();
    }
    
    document.head.appendChild(styleElement);

    // Cleanup function
    return () => {
      // Restore original fetch
      window.fetch = originalFetch;
      
      // Restore original XMLHttpRequest methods
      XMLHttpRequest.prototype.open = originalXHROpen;
      XMLHttpRequest.prototype.send = originalXHRSend;
      
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
      }
      // Remove custom styles
      const customStyles = document.getElementById('diro-widget-custom-styles');
      if (customStyles) {
        customStyles.remove();
      }
    };
  }, [containerKey, urn]);
  return <div className="w-full max-w-md p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
      <div className="smart-upload-widget">
        {!isWidgetLoaded && <div className="widget-loading p-4 text-center">Loading Diro widget...</div>}

        <div className="w-full flex justify-center">
          <div key={`smart-upload-widget-${containerKey}`} ref={containerRef} className="upload-widget-container" />
        </div>
      </div>
      
      {sessionId && (
        <div className="mt-4 p-3 bg-gray-50 border rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Session ID:</p>
          <p className="font-mono text-sm text-gray-800 break-all">{sessionId}</p>
        </div>
      )}
    </div>;
});
export default SmartUploadWidget;