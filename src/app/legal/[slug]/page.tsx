import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { privacyPolicy } from "@/lib/legal/privacy";
import { termsOfService } from "@/lib/legal/terms";
import { amlPolicy } from "@/lib/legal/aml";

const legalContent: Record<string, { title: string; content: string }> = {
  privacy: { title: "Privacy Policy", content: privacyPolicy },
  terms: { title: "Terms of Service", content: termsOfService },
  aml: { title: "AML/KYC Policy", content: amlPolicy },
};

function renderMarkdown(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let currentParagraph: string[] = [];
  let listItems: string[] = [];
  let key = 0;

  function flushParagraph() {
    if (currentParagraph.length > 0) {
      const content = currentParagraph.join(" ");
      if (content.trim()) {
        elements.push(
          <p key={key++} className="text-white/70 leading-relaxed">
            {renderInlineMarkdown(content)}
          </p>
        );
      }
      currentParagraph = [];
    }
  }

  function flushList() {
    if (listItems.length > 0) {
      elements.push(
        <ul key={key++} className="list-disc space-y-2 pl-6 text-white/70 leading-relaxed">
          {listItems.map((item, i) => (
            <li key={i}>{renderInlineMarkdown(item)}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
  }

  function renderInlineMarkdown(text: string): React.ReactNode {
    const parts: React.ReactNode[] = [];
    const regex = /\*\*(.+?)\*\*/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      parts.push(
        <strong key={`b-${match.index}`} className="text-white font-semibold">
          {match[1]}
        </strong>
      );
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }
    return parts.length === 1 ? parts[0] : parts;
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("## ")) {
      flushList();
      flushParagraph();
      elements.push(
        <h2
          key={key++}
          className="mt-10 mb-4 text-xl font-bold text-white first:mt-0"
        >
          {trimmed.replace("## ", "")}
        </h2>
      );
    } else if (trimmed.startsWith("- ")) {
      flushParagraph();
      listItems.push(trimmed.replace(/^- /, ""));
    } else if (trimmed === "") {
      flushList();
      flushParagraph();
    } else {
      flushList();
      currentParagraph.push(trimmed);
    }
  }

  flushList();
  flushParagraph();

  return elements;
}

export function generateStaticParams() {
  return [{ slug: "privacy" }, { slug: "terms" }, { slug: "aml" }];
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = legalContent[slug];

  if (!page) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-surface-border bg-forest-900">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              {page.title}
            </h1>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="space-y-4">{renderMarkdown(page.content)}</div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
