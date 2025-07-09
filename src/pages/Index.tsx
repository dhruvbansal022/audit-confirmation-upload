import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import WoltersKluwerLogo from "../components/WoltersKluwerLogo";
import DateForm from "../components/DateForm";
import FaqAccordion from "../components/FaqAccordion";
import WidgetCapture from "./widgetCapture";
const Index = () => {
  const [searchParams] = useSearchParams();
  const [showWidget, setShowWidget] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  useEffect(() => {
    // Check for URN parameter in URL (keeping for backward compatibility)
    const urlUrn = searchParams.get("URN");
    if (urlUrn && urlUrn.trim()) {
      console.log("URN from URL:", urlUrn);
      sessionStorage.setItem("userDate", urlUrn);
      setSelectedDate(urlUrn);
      setShowWidget(true);
    }
  }, [searchParams]);
  const handleDateSubmit = (submittedDate: string) => {
    console.log("Date submitted:", submittedDate);
    sessionStorage.setItem("userDate", submittedDate);
    setSelectedDate(submittedDate);
    setShowWidget(true);
  };
  return <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 py-4 bg-white">
        <div className="container mx-auto px-4">
          <WoltersKluwerLogo />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col">
            <h1 className="font-semibold text-gray-800 mb-4 text-xl">Confirm your balance in real time for audit compliance</h1>

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
              {!showWidget ? <>
                  <h2 className="font-medium text-gray-800 mb-4 text-lg">Select balance date</h2>
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                    Please select the date for which you want to verify your bank balance.
                  </p>
                  <DateForm onSubmit={handleDateSubmit} />
                </> : <>
                  <h2 className="font-medium text-gray-800 mb-4 text-lg">Fetch your balance</h2>
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed">Please select your bank to proceed.</p>
                  <div className="flex flex-col align-center gap-4">
                    <WidgetCapture urn={selectedDate} />
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