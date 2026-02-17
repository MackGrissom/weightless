interface StructuredDataProps {
  data: Record<string, unknown>;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebsiteStructuredData({ siteUrl }: { siteUrl: string }) {
  return (
    <StructuredData
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Weightless",
        url: siteUrl,
        description:
          "The job board built for digital nomads. Find remote work with cost-of-living context, visa sponsorship info, and timezone filtering.",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteUrl}/jobs?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}

export function OrganizationStructuredData({ siteUrl }: { siteUrl: string }) {
  return (
    <StructuredData
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Weightless",
        url: siteUrl,
        logo: `${siteUrl}/icon.svg`,
        description:
          "The job board built for digital nomads and location-independent workers.",
        sameAs: ["https://github.com/MackGrissom/weightless"],
      }}
    />
  );
}

export function BreadcrumbStructuredData({
  items,
  siteUrl,
}: {
  items: { name: string; url: string }[];
  siteUrl: string;
}) {
  return (
    <StructuredData
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url.startsWith("http")
            ? item.url
            : `${siteUrl}${item.url}`,
        })),
      }}
    />
  );
}

export function FAQStructuredData({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  return (
    <StructuredData
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      }}
    />
  );
}
