import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import WoltersKluwerLogo from "../components/WoltersKluwerLogo";
import FaqAccordion from "../components/FaqAccordion";
import WidgetCapture from "./widgetCapture";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { format, parse } from "date-fns";
const Status = () => {
  const [searchParams] = useSearchParams();
  const [showWidget, setShowWidget] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState("");
  const [docId, setDocId] = useState("");
  const [error, setError] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docId.trim()) {
      setError("Please enter a valid Doc ID");
      return;
    }
    setError("");
    setIsPopupOpen(true);
    setIsLoading(true);
    setApiResponse(null);
    try {
      const response = await fetch('https://api.dirolabs.com/v3/extract-balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': '1bfd958aabcec0f6c3bd5dfa47fc3c88',
          'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkaHJ1ditkZW1vQGRpcm8uaW8iLCJhcGlrZXkiOiIxYmZkOTU4YWFiY2VjMGY2YzNiZDVkZmE0N2ZjM2M4OCJ9.K6J2BhY2g6rCdEDfgeF1KSbaoSKb7jwUFoOjkpM8oGRrLbFYvUTlBD2wpISjmBK_1-0EFAqwp5PjWPjI6x_HQw'
        },
        body: JSON.stringify({
          docid: docId,
          requestedDate: ""
        })
      });
      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }
      const data = await response.json();
      console.log('API Response:', data);
      setApiResponse(data);
    } catch (error) {
      console.error('Error calling API:', error);
      setError("Failed to fetch balance. Please try again.");
      setIsPopupOpen(false);
    } finally {
      setIsLoading(false);
    }
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
            <h1 className="font-semibold text-gray-800 mb-4 text-xl">Confirm your balance seamlessly in real time for audit compliance </h1>

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
                  <h2 className="font-medium text-gray-800 mb-4 text-lg">Enter Doc ID</h2>
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed">Please enter the Doc ID to fetch the balance.</p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Input type="text" value={docId} onChange={e => setDocId(e.target.value)} placeholder="Enter Doc ID" className={`h-12 ${error ? "border-red-500" : "border-gray-300"}`} />
                      {error && <p className="text-red-500 text-sm">{error}</p>}
                    </div>
                    
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 h-12 text-white font-medium">
                      Fetch balance
                    </Button>
                  </form>
                </> : <>
                  <h2 className="font-medium text-gray-800 mb-4 text-lg">Fetch your balance</h2>
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed">Please select your bank to proceed.</p>
                  <div className="flex flex-col align-center gap-4">
                    <WidgetCapture urn={selectedDocId} />
                  </div>
                </>}
            </div>
          </div>

          <div>
            <FaqAccordion />
          </div>
        </div>
      </main>

      {/* API Response Popup */}
      <Dialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Balance confirmation</DialogTitle>
          </DialogHeader>
          
          {isLoading ? <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-gray-600">Loading balance information...</span>
            </div> : apiResponse?.message === "Processing" || apiResponse?.status === "processing" ? <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="flex items-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-gray-600">Processing your request...</span>
              </div>
              <p className="text-sm text-gray-500 text-center">
                Your balance information is being processed. This may take a few moments.
              </p>
            </div> : apiResponse ? <div className="space-y-4">
              {/* Extract data from the nested response structure */}
              {(() => {
            // Handle nested response structure like { "data": [{ "transactionData": {...}, "message": "..." }] }
            const responseData = apiResponse.data?.[0] || apiResponse;
            const transactionData = responseData.transactionData || responseData;
            const message = responseData.message || apiResponse.message;

            // Format the requested date
            const formatRequestedDate = (dateStr: string) => {
              try {
                // Parse the date in YYYY/MM/DD format
                const parsedDate = parse(dateStr, 'yyyy/MM/dd', new Date());
                // Format it as "Month DDth, YYYY"
                return format(parsedDate, 'MMMM do, yyyy');
              } catch (error) {
                // If parsing fails, return the original string
                return dateStr;
              }
            };
            return <>
                    {/* Requested Date on top */}
                    {transactionData.requestedDate && <div className="text-center py-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Requested date</span>
                        <p className="text-lg font-semibold text-gray-800">{formatRequestedDate(transactionData.requestedDate)}</p>
                      </div>}
                    
                    {/* Balance details table */}
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <tbody className="divide-y divide-gray-200">
                          {transactionData.currency && <tr>
                              <td className="px-4 py-3 text-sm font-medium text-gray-600 bg-gray-50">Currency</td>
                              <td className="px-4 py-3 text-sm text-gray-800">{transactionData.currency}</td>
                            </tr>}
                          {transactionData.accountNumber && <tr>
                              <td className="px-4 py-3 text-sm font-medium text-gray-600 bg-gray-50">Account number</td>
                              <td className="px-4 py-3 text-sm text-gray-800">{transactionData.accountNumber}</td>
                            </tr>}
                          {transactionData.balanceOnDate !== undefined && <tr>
                              <td className="px-4 py-3 text-sm font-medium text-gray-600 bg-gray-50">Balance on date</td>
                              <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                                {transactionData.currency ? `${transactionData.currency} ` : ''}
                                {typeof transactionData.balanceOnDate === 'number' ? transactionData.balanceOnDate.toLocaleString() : transactionData.balanceOnDate}
                              </td>
                            </tr>}
                           {message && <tr>
                              <td className="px-4 py-3 text-sm font-medium text-gray-600 bg-gray-50">Message</td>
                              <td className="px-4 py-3 text-sm">
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${message === 'Success!' ? 'bg-green-100 text-green-800' : message.includes('not present') ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                                  Status
                                </span>
                              </td>
                            </tr>}
                          
                          {/* Handle Account Details specifically */}
                          {transactionData.accountDetails && Array.isArray(transactionData.accountDetails) && <tr>
                              <td className="px-4 py-3 text-sm font-medium text-gray-600 bg-gray-50">Account details</td>
                              <td className="px-4 py-3">
                                <div className="space-y-3">
                                  {transactionData.accountDetails.map((account: any, index: number) => (
                                    <div key={index} className="border rounded-lg overflow-hidden bg-white">
                                      <table className="w-full">
                                        <tbody className="divide-y divide-gray-100">
                                          {account.accountNumber && <tr>
                                              <td className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-25">Account number</td>
                                              <td className="px-3 py-2 text-xs text-gray-700">{account.accountNumber}</td>
                                            </tr>}
                                          {account.balanceOnDate !== undefined && <tr>
                                              <td className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-25">Balance on date</td>
                                              <td className="px-3 py-2 text-xs text-gray-700">
                                                {typeof account.balanceOnDate === 'number' ? account.balanceOnDate.toLocaleString() : account.balanceOnDate}
                                              </td>
                                            </tr>}
                                          {account.currency && <tr>
                                              <td className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-25">Currency</td>
                                              <td className="px-3 py-2 text-xs text-gray-700">{account.currency}</td>
                                            </tr>}
                                        </tbody>
                                      </table>
                                    </div>
                                  ))}
                                </div>
                              </td>
                            </tr>}

                          {/* Show any additional fields that might be in the response */}
                          {Object.entries(transactionData).map(([key, value]) => {
                      // Skip already displayed fields and error field
                      if (['requestedDate', 'currency', 'accountNumber', 'confidence', 'balanceOnDate', 'error', 'accountDetails', 'message'].includes(key)) {
                        return null;
                      }
                      if (value !== undefined && value !== null && value !== '') {
                        return <tr key={key}>
                                  <td className="px-4 py-3 text-sm font-medium text-gray-600 bg-gray-50 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-800">
                                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                  </td>
                                </tr>;
                      }
                      return null;
                    })}
                        </tbody>
                      </table>
                    </div>

                    {/* Debug section - show raw response */}
                    <details className="mt-4">
                      <summary className="text-xs text-gray-500 cursor-pointer">Show raw response</summary>
                      <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
                        {JSON.stringify(apiResponse, null, 2)}
                      </pre>
                    </details>
                  </>;
          })()}
            </div> : null}
        </DialogContent>
      </Dialog>
    </div>;
};
export default Status;