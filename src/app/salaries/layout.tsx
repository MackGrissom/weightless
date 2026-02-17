import { BreadcrumbStructuredData } from "@/components/shared/structured-data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://weightless.jobs";

export default function SalariesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbStructuredData
        siteUrl={siteUrl}
        items={[
          { name: "Home", url: "/" },
          { name: "Salaries", url: "/salaries" },
        ]}
      />
      {children}
    </>
  );
}
