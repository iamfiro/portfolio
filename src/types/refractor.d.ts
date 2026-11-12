// react-syntax-highlighter(Prism) 가 내부에서 쓰는 refractor v3 의 최소 타입
declare module "refractor" {
  interface RefractorSyntax {
    (prism: { languages: Record<string, unknown> }): void;
    displayName: string;
    aliases: string[];
  }

  const refractor: {
    register: (syntax: RefractorSyntax) => void;
    registered: (language: string) => boolean;
  };

  export type { RefractorSyntax };
  export default refractor;
}
