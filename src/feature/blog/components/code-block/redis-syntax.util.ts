import refractor, { type RefractorSyntax } from "refractor";

// 명령 뒤에 붙는 대표적인 옵션 키워드
const REDIS_OPTIONS =
  /\b(?:NX|XX|GT|LT|CH|INCR|WITHSCORES|LIMIT|BYSCORE|BYLEX|REV|EX|PX|EXAT|PXAT|KEEPTTL|GET|COUNT|MATCH|TYPE|BLOCK|STREAMS|MAXLEN|MINID|NOMKSTREAM|AGGREGATE|WEIGHTS|SUM|MIN|MAX)\b/i;

/** Prism 에 없는 redis(redis-cli) 문법 정의 */
const redis: RefractorSyntax = (prism) => {
  prism.languages.redis = {
    comment: {
      pattern: /(^|\n)[ \t]*#.*/,
      lookbehind: true,
    },
    string: {
      pattern: /"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'/,
      greedy: true,
    },
    // 줄의 첫 단어 = 명령어 (ZADD, SET, ...)
    // greedy 로 전체 텍스트 기준 매칭해야 토큰 사이 조각의 시작을 줄 시작으로 오인하지 않는다
    keyword: {
      pattern: /(^|\n)[ \t]*[a-z][\w.]*/i,
      lookbehind: true,
      greedy: true,
    },
    builtin: REDIS_OPTIONS,
    number: {
      pattern: /(^|\s)[-+(]?(?:\d+(?:\.\d+)?|inf)(?=\s|$)/i,
      lookbehind: true,
    },
  };
};
redis.displayName = "redis";
redis.aliases = [];

export function registerRedisSyntax() {
  if (!refractor.registered("redis")) refractor.register(redis);
}
