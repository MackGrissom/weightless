import { Shield, CreditCard, Wifi, Globe, Users, Briefcase } from "lucide-react";
import { Card } from "@/components/ui/card";

interface AffiliateLink {
  name: string;
  description: string;
  url: string;
  icon: React.ReactNode;
  tag: string;
}

const affiliateLinks: AffiliateLink[] = [
  {
    name: "SafetyWing",
    description: "Nomad health insurance from $45/mo",
    url: "https://safetywing.com/nomad-insurance?referenceID=weightless",
    icon: <Shield className="h-4 w-4" />,
    tag: "Insurance",
  },
  {
    name: "Wise",
    description: "Send money abroad with no hidden fees",
    url: "https://wise.com/invite/weightless",
    icon: <CreditCard className="h-4 w-4" />,
    tag: "Banking",
  },
  {
    name: "NordVPN",
    description: "Secure your connection on public WiFi",
    url: "https://nordvpn.com/weightless",
    icon: <Wifi className="h-4 w-4" />,
    tag: "VPN",
  },
  {
    name: "Deel",
    description: "Get paid compliantly from anywhere",
    url: "https://deel.com/partners/weightless",
    icon: <Globe className="h-4 w-4" />,
    tag: "Payments",
  },
  {
    name: "Remote.com",
    description: "Global employment made simple",
    url: "https://remote.com/?ref=weightless",
    icon: <Users className="h-4 w-4" />,
    tag: "HR",
  },
  {
    name: "Flexjobs",
    description: "Vetted remote & flexible job listings",
    url: "https://flexjobs.com/?ref=weightless",
    icon: <Briefcase className="h-4 w-4" />,
    tag: "Jobs",
  },
];

export function NomadToolkit() {
  return (
    <Card className="p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        Nomad Toolkit
      </h3>
      <div className="space-y-3">
        {affiliateLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 rounded-lg p-2 -mx-2 hover:bg-muted/50 transition-colors group"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent group-hover:bg-accent/20 transition-colors">
              {link.icon}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium group-hover:text-accent transition-colors">
                  {link.name}
                </span>
                <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  {link.tag}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {link.description}
              </p>
            </div>
          </a>
        ))}
      </div>
      <p className="mt-4 text-[10px] text-muted-foreground/60">
        Some links are affiliate partnerships that help keep Weightless free.
      </p>
    </Card>
  );
}
