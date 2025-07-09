import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import VfsLogo from "../components/VfsLogo";
import UrnForm from "../components/UrnForm";
import FaqAccordion from "../components/FaqAccordion";
import WidgetCapture from "./widgetCapture";
const Index = () => {
  const [searchParams] = useSearchParams();
  const [showWidget, setShowWidget] = useState(false);
  const [urn, setUrn] = useState("");
  useEffect(() => {
    // Check for URN parameter in URL
    const urlUrn = searchParams.get("URN");
    if (urlUrn && urlUrn.trim()) {
      console.log("URN from URL:", urlUrn);
      sessionStorage.setItem("userUrn", urlUrn);
      setUrn(urlUrn);
      setShowWidget(true);
    }
  }, [searchParams]);
  const handleUrnSubmit = (submittedUrn: string) => {
    console.log("URN submitted:", submittedUrn);
    sessionStorage.setItem("userUrn", submittedUrn);
    setUrn(submittedUrn);
    setShowWidget(true);
  };
  return <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 py-4 bg-white">
        <div className="container mx-auto px-4">
          <VfsLogo />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col">
            <h1 className="font-semibold text-gray-800 mb-4 text-xl">Confirm your balance in real time </h1>

            <p className="text-gray-600 mb-6 text-justify leading-relaxed">Streamline your audit process and eliminate delays by fetching your verified bank balance in real time. Our secure platform delivers instant, read-only access to the exact balance your auditor needs—no paperwork, no phone calls, no waiting.</p>

            <p className="text-gray-600 mb-6 text-justify leading-relaxed">
              VFS Global partners with{" "}
              <a href="#" className="text-vfs-blue hover:underline font-medium">
                DIRO
              </a>{" "}
              for this process, the leading provider of fetching original document from any online source. Trusted by various governments, F500 and 
              Tier 1 global banks. Visit DIRO{" "}
              <a href="#" className="text-vfs-blue hover:underline font-medium">
                Trust Center
              </a>
              .
            </p>

            <div className="mt-auto">
              <p className="text-gray-600 mb-4">
                Learn more about DIRO's{" "}
                <a href="#" className="text-vfs-blue hover:underline font-medium">
                  bank
                </a>{" "}
                verification solutions.
              </p>

              <div className="flex gap-4">
                <a href="#" className="text-vfs-blue hover:underline font-medium">
                  Terms of Use
                </a>
                <a href="#" className="text-vfs-blue hover:underline font-medium">
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-full max-w-md p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
              {!showWidget ? <>
                  <h2 className="font-medium text-gray-800 mb-4 text-lg">Enter your URN</h2>
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                    Please enter your Unique Reference Number (URN) to proceed with the verification process.
                  </p>
                  <UrnForm onSubmit={handleUrnSubmit} />
                </> : <>
                  <h2 className="font-medium text-gray-800 mb-4 text-lg">Fetch your original bank statement</h2>
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed">Please select your bank to proceed.</p>
                  <div className="flex flex-col align-center gap-4">
                    <WidgetCapture urn={urn} />
                  </div>
                </>}
            </div>
          </div>

          <div>
            <FaqAccordion />
          </div>
        </div>
      </main>
    </div>;
};
export default Index;