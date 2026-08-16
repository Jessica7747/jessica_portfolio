import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { CaseStudyPage } from "../../components/CaseStudyPage";
import {
  getCaseStudy,
  getCaseStudySlugs,
} from "../../components/caseStudies";
import styles from "../../page.module.css";

type WorkCaseStudyPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getCaseStudySlugs().map((slug) => ({ slug }));
}

export default async function WorkCaseStudyPage({
  params,
}: WorkCaseStudyPageProps) {
  const { slug } = await params;
  const content = getCaseStudy(slug);
  if (!content) notFound();

  return (
    <SiteShell
      active="work"
      previousAt="Previously at Apple, Google Genkit & Amazon Web Services."
      contentClassName={styles.workContent}
    >
      <CaseStudyPage content={content} />
    </SiteShell>
  );
}
