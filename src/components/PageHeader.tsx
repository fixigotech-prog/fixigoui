interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 md:py-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h1>
        {subtitle && (
          <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">{subtitle}</p>
        )}
      </div>
    </header>
  );
}