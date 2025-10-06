interface BookingFooterProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  isNextDisabled?: boolean;
  nextLabel?: string;
  isLoading?: boolean;
}

export default function BookingFooter({ 
  currentStep, 
  totalSteps, 
  onNext, 
  onPrevious, 
  isNextDisabled = false,
  nextLabel,
  isLoading = false
}: BookingFooterProps) {
  const getNextLabel = () => {
    if (nextLabel) return nextLabel;
    if (currentStep === totalSteps) return 'Complete Booking';
    return 'Continue';
  };

  return (
    <footer className="bg-white border-t shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <button
            onClick={onPrevious}
            disabled={currentStep === 1}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="text-sm text-gray-500">
            {currentStep} of {totalSteps} steps completed
          </div>
          
          <button
            onClick={onNext}
            disabled={isNextDisabled || isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : getNextLabel()}
          </button>
        </div>
      </div>
    </footer>
  );
}