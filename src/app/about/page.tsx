import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Globe, DollarSign, Users, Coins, Shield, ShieldCheck, UserCheck } from "lucide-react";

const stats = [
  { label: "Countries", value: "50+", icon: Globe },
  { label: "Processed", value: "$7M+", icon: DollarSign },
  { label: "Users", value: "25K+", icon: Users },
  { label: "Currencies", value: "19+", icon: Coins },
];

const licenses = [
  {
    title: "Licensed by Central Bank",
    description:
      "Fully licensed and regulated by the Central Bank for foreign exchange and remittance services.",
    icon: Shield,
  },
  {
    title: "AML Compliant",
    description:
      "Comprehensive Anti-Money Laundering program with real-time transaction monitoring and reporting.",
    icon: ShieldCheck,
  },
  {
    title: "KYC Verified Platform",
    description:
      "Multi-tier Know Your Customer verification ensuring secure and compliant user onboarding.",
    icon: UserCheck,
  },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-surface-border bg-forest-900">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              About Ugarit Exchange
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-white/60 leading-relaxed">
              A digital financial platform built to serve communities across the
              Middle East and Africa with fast, affordable, and reliable money
              transfer and currency exchange services.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Our Story
              </h2>
              <div className="mt-6 space-y-4 text-white/60 leading-relaxed">
                <p>
                  Started from a passion for making financial services accessible
                  across the Middle East and Africa. We saw communities
                  underserved by traditional banking, paying excessive fees and
                  waiting days for transfers that should take minutes.
                </p>
                <p>
                  Built to serve communities that need fast, affordable, and
                  reliable money transfer services. Every feature we develop,
                  every partnership we forge, and every market we enter is driven
                  by this fundamental mission.
                </p>
                <p>
                  From humble beginnings in currency exchange to a full-fledged
                  digital financial platform. Today, we process millions in
                  transactions across 50+ countries, connecting families,
                  businesses, and communities with the financial tools they
                  deserve.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="absolute -inset-4 rounded-2xl bg-gold-500/10 blur-2xl" />
                <Card className="relative">
                  <div className="flex flex-col items-center gap-3 px-8 py-6 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-500/15">
                      <Globe className="text-gold-400" size={24} />
                    </div>
                    <p className="text-lg font-semibold text-white">
                      Our Mission
                    </p>
                    <p className="text-white/60 leading-relaxed">
                      Making financial services accessible across Middle East
                      &amp; Africa
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Key Stats */}
        <section className="border-y border-surface-border bg-forest-900/50">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
              {stats.map((stat) => (
                <Card key={stat.label}>
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-500/15">
                      <stat.icon className="text-gold-400" size={20} />
                    </div>
                    <p className="text-2xl font-bold text-white sm:text-3xl">
                      {stat.value}
                    </p>
                    <p className="text-sm text-white/50">{stat.label}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-white sm:text-3xl">
            Leadership
          </h2>
          <div className="mt-10 flex justify-center">
            <Card className="max-w-md">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gold-500/30 to-forest-700">
                  <span className="text-2xl font-bold text-gold-400">AR</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Ahmad Rifai
                  </h3>
                  <p className="text-sm text-gold-400">Founder &amp; CEO</p>
                </div>
                <p className="text-sm text-white/50 leading-relaxed">
                  Driven by a vision to bridge financial gaps across borders
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* Licenses */}
        <section className="border-y border-surface-border bg-forest-900/50">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="text-center text-2xl font-bold text-white sm:text-3xl">
              Compliance &amp; Licensing
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {licenses.map((license) => (
                <Card key={license.title}>
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/15">
                      <license.icon className="text-success" size={22} />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Badge variant="success">{license.title}</Badge>
                      <p className="text-sm text-white/50 leading-relaxed">
                        {license.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Built by Arzisoft */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-sm text-white/30">Built by</p>
            <p className="text-lg font-semibold text-white">Arzisoft</p>
            <p className="text-sm text-white/50">Mahmoud Baassiri</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
