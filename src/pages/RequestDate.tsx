import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import WoltersKluwerLogo from "../components/WoltersKluwerLogo";
import SmartUploadWidget from "../components/SmartUploadWidget";
import WidgetCapture from "./widgetCapture";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, CalendarIcon } from "lucide-react";
import { format, parse } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
const RequestDate = () => {
  const [searchParams] = useSearchParams();
  const [showWidget, setShowWidget] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState("");
  const [docId, setDocId] = useState("");
  const [date, setDate] = useState<Date>();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [dateOpen, setDateOpen] = useState(false);
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
  const handleSessionId = (sessionId: string) => {
    setDocId(sessionId);
  };
  const handleMonthChange = (monthIndex: string) => {
    const newMonth = new Date(currentMonth.getFullYear(), parseInt(monthIndex), 1);
    setCurrentMonth(newMonth);
  };
  const handleYearChange = (year: string) => {
    const newMonth = new Date(parseInt(year), currentMonth.getMonth(), 1);
    setCurrentMonth(newMonth);
  };
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentYear = new Date().getFullYear();
  const years = Array.from({
    length: 100
  }, (_, i) => currentYear - 50 + i);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docId.trim()) {
      setError("Please enter a valid Doc ID");
      return;
    }
    if (!date) {
      setError("Please select a date");
      return;
    }
    setError("");
    setIsPopupOpen(true);
    setIsLoading(true);
    setApiResponse(null);

    // Format date as YYYY/MM/DD
    const formattedDate = format(date, 'yyyy/MM/dd');
    try {
      const response = await fetch('https://api.dirolabs.com/v3/extract-balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': '7c78fb55194729ad81da94097e9add32',
          'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkaHJ1dkBkaXJvLmlvIiwiYXBpa2V5IjoiN2M3OGZiNTUxOTQ3MjlhZDgxZGE5NDA5N2U5YWRkMzIifQ.SmdG9VZX1m5Ejk8Rn9H0cdb3IQznnmRZEisuG779kqi_y7kV0ERG83LtmSQkDvHAw-2oM9z5bpmA6bojz4W7BQ'
        },
        body: JSON.stringify({
          docid: docId,
          requestedDate: formattedDate
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
          
          <div>
            <SmartUploadWidget onSessionId={handleSessionId} />
          </div>

          <div className="flex flex-col items-center">
            <div className="w-full max-w-md p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
              {!showWidget ? <>
                  <h2 className="font-medium text-gray-800 mb-4 text-lg">Enter doc ID &amp; select date</h2>
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed">Please enter the Doc ID and select the date to fetch the balance.</p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Input type="text" value={docId} onChange={e => setDocId(e.target.value)} placeholder="Enter Doc ID" className={`h-12 ${error && !date ? "border-red-500" : "border-gray-300"}`} />
                    </div>
                    
                    <div className="space-y-2">
                      <Popover open={dateOpen} onOpenChange={setDateOpen}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full h-12 justify-start text-left font-normal border-gray-300 hover:border-gray-300 hover:bg-white", !date && "text-muted-foreground", error && !docId.trim() && "border-red-500")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Select a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <div className="p-3 border-b">
                            <div className="flex items-center justify-between gap-2">
                              <Select value={currentMonth.getMonth().toString()} onValueChange={handleMonthChange}>
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {months.map((month, index) => <SelectItem key={index} value={index.toString()}>
                                      {month}
                                    </SelectItem>)}
                                </SelectContent>
                              </Select>
                              
                              <Select value={currentMonth.getFullYear().toString()} onValueChange={handleYearChange}>
                                <SelectTrigger className="w-20">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {years.map(year => <SelectItem key={year} value={year.toString()}>
                                      {year}
                                    </SelectItem>)}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <Calendar mode="single" selected={date} onSelect={selectedDate => {
                        setDate(selectedDate);
                        if (selectedDate) {
                          setDateOpen(false);
                        }
                      }} month={currentMonth} onMonthChange={setCurrentMonth} initialFocus className="p-3 pointer-events-auto" />
                        </PopoverContent>
                      </Popover>
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
                              <td className="px-4 py-3 text-sm font-medium text-gray-600 bg-gray-50">Status</td>
                              <td className="px-4 py-3 text-sm">
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${message === 'Success!' ? 'bg-green-100 text-green-800' : message.includes('not present') ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                                  {message}
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
                      <div className="mt-2 border rounded bg-gray-100">
                        <ScrollArea className="h-48">
                          <pre className="p-3 text-xs whitespace-pre-wrap break-words">
                            {JSON.stringify(apiResponse, null, 2)}
                          </pre>
                        </ScrollArea>
                      </div>
                    </details>
                  </>;
          })()}
            </div> : null}
        </DialogContent>
      </Dialog>
    </div>;
};
export default RequestDate;