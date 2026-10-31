export interface CaseStudyFeature {
  title: string;
  body: string;
}

export interface CaseStudySpec {
  title: string;
  items: string[];
}

export interface FlowStage {
  label: string;
  items: string[];
}

export interface CaseStudyShowcase {
  title: string;
  body: string;
  imageUrl?: string;
}

export type CaseStudyBlock =
  | { type: "features"; items: CaseStudyFeature[] }
  | { type: "specs"; items: CaseStudySpec[] }
  | { type: "flow"; stages: FlowStage[] }
  | { type: "showcase"; items: CaseStudyShowcase[] };

export interface CaseStudySection {
  id: string;
  title: string;
  paragraphs: string[];
  block?: CaseStudyBlock;
}

export interface CaseStudy {
  year: string;
  lead: string;
  tags: string[];
  sections: CaseStudySection[];
}
