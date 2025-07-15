import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from "react";
interface WidgetRefMethods {
  updateWidget: (data: any) => void;
  reinitialize: () => void;
}
interface SmartUploadWidgetProps {
  urn?: string;
  onSessionId?: (sessionId: string) => void;
}
const SmartUploadWidget = forwardRef<WidgetRefMethods, SmartUploadWidgetProps>(({
  urn,
  onSessionId
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isWidgetLoaded, setIsWidgetLoaded] = useState<boolean>(false);
  const [containerKey, setContainerKey] = useState<number>(0);
  const [capturedSessionId, setCapturedSessionId] = useState<string>('');
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
    widgetDiv.setAttribute("wrapper", '{ "height": "350px", "width": "350px", "themeColor":"black", "fontFamily":"sans-serif", "fontSize":"12px", "fontWeight":"300" }');

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
  const handleSessionIdCapture = (sessionId: string) => {
    console.log('🎯 Session ID captured:', sessionId);
    setCapturedSessionId(sessionId);
    onSessionId?.(sessionId);
  };

  useEffect(() => {
    initializeWidget();

    // Monitor network requests for the specific updatesession API
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      // Log all requests to see what's happening
      console.log('📡 Fetch request:', args[0]);
      
      // Check if this is the specific updatesession API call
      if (args[0] && typeof args[0] === 'string' && 
          (args[0].includes('prod.dirolabs.com/Zuul-1.0/User-2.0/updatesession') || 
           args[0].includes('updatesession'))) {
        try {
          // Extract request body/payload
          const requestOptions = args[1];
          console.log('📦 Request options:', requestOptions);
          if (requestOptions?.body) {
            let requestData;
            if (typeof requestOptions.body === 'string') {
              try {
                requestData = JSON.parse(requestOptions.body);
              } catch {
                requestData = requestOptions.body;
              }
            } else if (requestOptions.body instanceof FormData) {
              requestData = Object.fromEntries(requestOptions.body.entries());
            } else {
              requestData = requestOptions.body;
            }
            console.log('🔍 Fetch API request payload for updatesession:', requestData);
            if (requestData?.sessionid) {
              console.log('🎯 Found sessionid in fetch request payload:', requestData.sessionid);
              handleSessionIdCapture(requestData.sessionid);
            }
          }
        } catch (error) {
          console.error('❌ Error parsing updatesession request payload:', error);
        }
      }
      
      const response = await originalFetch(...args);
      return response;
    };

    // Also monitor XMLHttpRequest for updatesession API
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;
    
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
      this._url = url;
      this._method = method;
      return originalXHROpen.call(this, method, url, ...args);
    };
    
    XMLHttpRequest.prototype.send = function(body) {
      // Log all XHR requests
      console.log('📡 XHR request:', this._method, this._url);
      
      // Capture request payload for updatesession API
      if (this._url && (this._url.includes('prod.dirolabs.com/Zuul-1.0/User-2.0/updatesession') || 
                       this._url.includes('updatesession'))) {
        try {
          if (body) {
            let requestData;
            console.log('📦 XHR request body type:', typeof body, body);
            if (typeof body === 'string') {
              try {
                requestData = JSON.parse(body);
              } catch {
                requestData = body;
              }
            } else if (body instanceof FormData) {
              requestData = Object.fromEntries(body.entries());
            } else if (body instanceof URLSearchParams) {
              requestData = Object.fromEntries(body.entries());
            } else {
              requestData = body;
            }
            console.log('🔍 XHR request payload for updatesession:', requestData);
            if (requestData?.sessionid) {
              console.log('🎯 Found sessionid in XHR request payload:', requestData.sessionid);
              handleSessionIdCapture(requestData.sessionid);
            }
          }
        } catch (error) {
          console.error('❌ Error parsing updatesession request payload:', error);
        }
      }
      return originalXHRSend.call(this, body);
    };

    // Additional monitoring using Performance Observer for network requests
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name.includes('updatesession') || entry.name.includes('prod.dirolabs.com/Zuul-1.0/User-2.0/updatesession')) {
            console.log('Performance observer detected updatesession call:', entry.name);
          }
        }
      });
      observer.observe({ entryTypes: ['resource'] });
    }

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
    </div>;
});
export default SmartUploadWidget;