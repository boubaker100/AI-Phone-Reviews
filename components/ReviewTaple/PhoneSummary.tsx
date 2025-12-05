"use client";

interface Props {
  summary?: string;
}

export default function PhoneSummary({ summary }: Props) {
  if (!summary) return null;

  return (
    <div className="mb-6 p-4 rounded-xl bg-[#f9f9f9] dark:bg-[#1a1a1a] shadow-sm border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-2">Sammary 📌</h2>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        {summary}
      </p>
    </div>
  );
}
