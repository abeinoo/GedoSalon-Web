const ARABIC_PATTERN = /[؀-ۿ]/;

// Renders one line of admin-entered text with the correct dir/lang so
// Arabic character shaping and word order stay correct even inside an
// otherwise left-to-right layout (business name, address lines, etc).
export default function LocalizedLine({ text, className = "" }: { text: string; className?: string }) {
  const isArabic = ARABIC_PATTERN.test(text);
  return (
    <p dir={isArabic ? "rtl" : "ltr"} lang={isArabic ? "ar" : "en"} className={`text-left ${className}`}>
      {text}
    </p>
  );
}
