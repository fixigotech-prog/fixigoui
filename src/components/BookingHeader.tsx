interface BookingHeaderProps {
  currentStep: number;
  totalSteps: number;
}

export default function BookingHeader({ currentStep, totalSteps }: BookingHeaderProps) {
  const steps = [
    { number: 1, title: 'Services', description: 'Select your services' },
    { number: 2, title: 'Location', description: 'Set your location' },
    { number: 3, title: 'Schedule', description: 'Pick date & time' },
    { number: 4, title: 'Payment', description: 'Complete booking' }
  ];

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Book Your Service</h1>
          <div className="text-sm text-gray-500">
            Step {currentStep} of {totalSteps}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.number <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.number}
                </div>
                <div className="mt-2 text-center">
                  <div className="text-sm font-medium text-gray-900">{step.title}</div>
                  <div className="text-xs text-gray-500">{step.description}</div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${
                  step.number < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}