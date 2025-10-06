export default function PageFooter() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">FixiGo</h3>
            <p className="text-gray-400 text-sm">
              Professional home services at your doorstep. Quality, reliability, and convenience.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Home Cleaning</li>
              <li>Repairs & Maintenance</li>
              <li>Installation Services</li>
              <li>Professional Care</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>support@fixigo.com</li>
              <li>+1 (555) 123-4567</li>
              <li>Available 24/7</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 FixiGo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}