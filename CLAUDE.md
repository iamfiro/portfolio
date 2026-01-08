개인 포트폴리오 서비스
    - **기술 스택**: React.js + Vite + TypeScript + SCSS Modules
    - **라우팅**: React Router v7
    - **아이콘**: Lucide React

## 파일 네이밍 컨벤션
| 유형 | 패턴 | 예시 |
|------|------|------|
| 컴포넌트 | `kebab-case/index.tsx` | `most-famous-product/index.tsx` |
| 타입 | `{name}.type.ts` | `party-card.type.ts` |
| 유틸리티 | `{name}.util.ts` | `party-card.util.ts` |
| 스타일 | `style.module.scss` | `style.module.scss` |
| 배럴 | `index.ts` | `index.ts` |

## 컴포넌트 작성 패턴

### 기본 컴포넌트 구조

```tsx
// 스타일 (항상 마지막, 's'로 import)
import s from "./style.module.scss";

// Props 인터페이스 정의
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary";
  size?: "large" | "medium";
}

// default export 함수형 컴포넌트
export default function ComponentName({
  children,
  variant = "primary",
  size = "medium",
  className,
  ...props
}: Props) {
  return (
    <button className={s.button} {...props}>
      {children}
    </button>
  );
}
```

### className 조합 패턴

```tsx
const buttonClassName = [
  s.button,
  s[size],
  s[variant],
  pending && s.pending,
  disabled && s.disabled,
  fullWidth && s.fullWidth,
  className,
]
  .filter(Boolean)
  .join(" ");
```

### Compound Component 패턴

```tsx
const Typo = ({ variant, children, ...props }: TypoProps) => {
  return <span className={styles[variant]}>{children}</span>;
};

// Sub-components
Typo.Display = (props: any) => <Typo variant="display" {...props} />;
Typo.Headline = (props: any) => <Typo variant="headline" {...props} />;
Typo.Body = (props: any) => <Typo variant="body" {...props} />;

export default Typo;
```

## 컴포넌트 개발 (중요!)
HTML 태그를 직접 사용하지 말고 component/ui의 추상화 구현체를 사용해 원하는 것이 없으면 개발을 멈추고 필요한 컴포넌트를 제안해

예) 텍스트는 모두 Typo, 버튼은 Button, 레이아웃은 Colum, Row

---

## TypeScript 패턴

### Props 정의

```tsx
// HTML 속성 확장
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "tertiary";
}

// Pick으로 부분 타입 추출
type CardProps = Pick<Product, "id" | "name" | "logo" | "party">;
```

### Discriminated Union 패턴

```tsx
interface ShoppingCardProps {
  context: "shopping";
  product: Product;
  party: Party;
}

interface SubscriptionCardProps {
  context: "subscription";
  subscription: Subscription;
}

export type PartyCardProps = ShoppingCardProps | SubscriptionCardProps;
```

### Generic 컴포넌트

```tsx
type TypoProps<T extends React.ElementType = "span"> = {
  as?: T;
  variant?: TypographyVariant;
  children: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "variant">;
```

### Enum 사용

```tsx
export enum Category {
  STREAMING = "스트리밍",
  AI = "AI",
  MUSIC = "뮤직",
}

export enum PartyType {
  INDIVIDUAL = "individual",
  PARTY = "party",
}
```

---

## SCSS 스타일 가이드

### 기본 규칙
### [중요] **토큰만 사용** - 하드코딩된 값(특히 색상) 금지
0. **variable.scss import 금지** - next.js scss 설정으로 자동으로 불러옴
1. **토큰만 사용** - 하드코딩된 값(특히 색상) 금지
2. **속성 그룹핑** - 빈 줄로 그룹 구분
3. **s로 import** - `import s from "./style.module.scss"`

### 속성 그룹 순서

```scss
.component {
  display: flex;
  position: relative;
  width: 100%;

  flex-direction: column;
  align-items: center;
  gap: $spacing-8;

  padding: $spacing-16;
  margin-bottom: $spacing-24;

  color: $text;
  background-color: $surface;
  
  border-radius: $radius-16;
  border: 1px solid $border;

  font-size: 16px;
  font-weight: 600;

  box-shadow: $shadow;
  transition: all 0.2s ease;
}
```

### 디자인 토큰

#### Spacing
```scss
$spacing-4, $spacing-6, $spacing-8, $spacing-10, $spacing-12,
$spacing-14, $spacing-16, $spacing-20, $spacing-24, $spacing-32,
$spacing-40, $spacing-48, $spacing-64, $spacing-100
```

#### Border Radius
```scss
$radius-4, $radius-8, $radius-10, $radius-12, $radius-14,
$radius-16, $radius-20, $radius-32, $radius-64, $radius-full
```

#### Colors
```scss
// Text
$text, $text-subtle, $text-white
$text-brand, $text-brand-heavy, $text-brand-subtle
$text-danger, $text-danger-heavy, $text-danger-subtle
$text-success, $text-success-heavy, $text-success-subtle
$text-warning, $text-warning-heavy, $text-warning-subtle

// Background & Surface
$surface, $surface-subtle
$surface-brand, $surface-brand-heavy, $surface-brand-subtle

// Border
$border, $border-subtle

// Shadow
$shadow
```

---

## 코드 품질 규칙
Lint 오류는 직접 코드를 수정하는 것이 아닌 `npx eslint --fix`를 사용

### 지양해야 할 패턴

```tsx
// ❌ forwardRef 사용 지양
const Input = forwardRef((props, ref) => { ... });

// ✅ ref를 props로 전달
function Input({ inputRef, ...props }: Props) { ... }

// ❌ useImperativeHandle 지양
useImperativeHandle(ref, () => ({ focus }));

// ✅ state나 context 사용
const [isFocused, setIsFocused] = useState(false);

// ❌ 인라인 렌더 함수
{items.map(item => <div>{item.name}</div>)}

// ✅ useCallback 또는 별도 컴포넌트
const renderItem = useCallback((item) => <Item {...item} />, []);
```

## 기타 컨벤션

### 주석

- 한국어 주석 사용 가능
- JSDoc은 public API에만 사용
- 코드로 설명 가능하면 주석 생략 (중요)

### React 패턴

- 함수형 컴포넌트만 사용
- 커스텀 훅으로 로직 분리
- Suspense와 함께 `use` 훅 사용 (React 19 준비)
- 비용이 큰 렌더링에 React.memo 사용

### 폴더 구조 원칙

- 기능별로 컴포넌트 그룹화
- 관련 파일은 같은 디렉토리에 배치 (co-location)