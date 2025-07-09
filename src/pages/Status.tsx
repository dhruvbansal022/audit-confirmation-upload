import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import WoltersKluwerLogo from "../components/WoltersKluwerLogo";
import FaqAccordion from "../components/FaqAccordion";
import WidgetCapture from "./widgetCapture";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Status = () => {
  const [searchParams] = useSearchParams();
  const [showWidget, setShowWidget] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState("");
  const [docId, setDocId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Check for URN parameter in URL (keeping for backward compatibility)
    const urlUrn = searchParams.get("URN");
    if (urlUrn && urlUrn.trim()) {
      console.log("URN from URL:", urlUrn);
      sessionStorage.setItem("userDate", urlUrn);
      setSelectedDocId(urlUrn);
      setShowWidget(true);
    }
  }, [searchParams]);

  const handleDocIdSubmit = (submittedDocId: string) => {
    console.log("Doc ID submitted:", submittedDocId);
    sessionStorage.setItem("userDate", submittedDocId);
    setSelectedDocId(submittedDocId);
    setShowWidget(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!docId.trim()) {
      setError("Please enter a valid Doc ID");
      return;
    }
    
    setError("");
    handleDocIdSubmit(docId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 py-4 bg-white">
        <div className="container mx-auto px-4">
          <WoltersKluwerLogo />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col">
            <h1 className="font-semibold text-gray-800 mb-4 text-xl">Confirm your balance in real time </h1>

            <p className="text-gray-600 mb-6 text-justify leading-relaxed">To streamline your audit workflow and eliminate financial discrepancies, auditors require verified balance confirmations. Our secure platform delivers instant, read-only access to the exact balance your auditor needs—no paperwork, no phone calls, no waiting from banks.</p>

            <p className="text-gray-600 mb-6 text-justify leading-relaxed">
              We partner with{" "}
              <a href="https://diro.io/" target="_blank" rel="noopener noreferrer" className="text-vfs-blue hover:underline font-medium">
                DIRO
              </a>
              —the global leader in real-time balance confirmations from any online banking source. Trusted by top CPA firms, F500, and 
              international financial institutions. Visit the{" "}
              <a href="https://trust.diro.io/" target="_blank" rel="noopener noreferrer" className="text-vfs-blue hover:underline font-medium">
                DIRO Trust Center
              </a>
              .
            </p>

            <div className="mt-auto">
              <p className="text-gray-600 mb-4">
                Learn more about DIRO's{" "}
                <a href="https://diro.io/products/balance-and-transaction-confirmation/" target="_blank" rel="noopener noreferrer" className="text-vfs-blue hover:underline font-medium">
                  balance confirmation
                </a>{" "}
                solution.
              </p>

              <div className="flex gap-4">
                <a href="https://diro.io/term-condition/" target="_blank" rel="noopener noreferrer" className="text-vfs-blue hover:underline font-medium">
                  Terms of Use
                </a>
                <a href="https://diro.io/privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-vfs-blue hover:underline font-medium">
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-full max-w-md p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
              {!showWidget ? (
                <>
                  <h2 className="font-medium text-gray-800 mb-4 text-lg">Enter Doc ID</h2>
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                    Please enter your Doc ID to fetch your balance.
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Input 
                        type="text"
                        value={docId}
                        onChange={(e) => setDocId(e.target.value)}
                        placeholder="Enter Doc ID"
                        className={`h-12 ${error ? "border-red-500" : "border-gray-300"}`}
                      />
                      {error && <p className="text-red-500 text-sm">{error}</p>}
                    </div>
                    
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 h-12 text-white font-medium">
                      Fetch balance
                    </Button>
                  </form>
                </>
              ) : (
                <>
                  <h2 className="font-medium text-gray-800 mb-4 text-lg">Fetch your balance</h2>
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed">Please select your bank to proceed.</p>
                  <div className="flex flex-col align-center gap-4">
                    <WidgetCapture urn={selectedDocId} />
                  </div>
                </>
              )}
            </div>
          </div>

          <div>
            <FaqAccordion />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Status;
