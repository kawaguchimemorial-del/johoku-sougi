// コラム用のインラインSVGイラスト。外部画像に依存しないためビルドエラーが出ない。
// 紺・金・生成りの落ち着いたトーン。category または illust キーで出し分ける。

type IllustProps = {
  name: string;
  className?: string;
};

const navy = "#1b2a4a";
const gold = "#b08d4f";
const cream = "#f7f4ee";
const goldLight = "#c9a96a";

// 各イラストは 320x200 のビューボックスで統一。
function Frame({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <svg
      viewBox="0 0 320 200"
      role="img"
      aria-label={label}
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
    >
      <rect width="320" height="200" fill={cream} />
      <rect
        x="0"
        y="0"
        width="320"
        height="6"
        fill={gold}
        opacity="0.9"
      />
      {children}
    </svg>
  );
}

const illustrations: Record<string, (label: string) => React.ReactNode> = {
  // 流れ・スケジュール
  flow: (label) => (
    <Frame label={label}>
      <g fill="none" stroke={navy} strokeWidth="2.5" strokeLinecap="round">
        <line x1="60" y1="100" x2="260" y2="100" strokeDasharray="2 10" />
      </g>
      {[60, 127, 193, 260].map((cx, i) => (
        <g key={cx}>
          <circle cx={cx} cy="100" r="14" fill="#fff" stroke={navy} strokeWidth="2.5" />
          <circle cx={cx} cy="100" r="5" fill={i === 3 ? gold : navy} />
        </g>
      ))}
      <text x="160" y="40" textAnchor="middle" fontSize="15" fill={navy} fontWeight="bold">
        ご逝去 → お見送り
      </text>
    </Frame>
  ),
  // 費用・お金
  cost: (label) => (
    <Frame label={label}>
      <circle cx="160" cy="105" r="55" fill="#fff" stroke={navy} strokeWidth="2.5" />
      <circle cx="160" cy="105" r="55" fill="none" stroke={gold} strokeWidth="6" strokeDasharray="170 350" />
      <text x="160" y="100" textAnchor="middle" fontSize="26" fill={navy} fontWeight="bold">¥</text>
      <text x="160" y="122" textAnchor="middle" fontSize="11" fill={navy}>目安・税込</text>
    </Frame>
  ),
  // 葬儀の種類
  types: (label) => (
    <Frame label={label}>
      {[70, 160, 250].map((cx, i) => (
        <g key={cx}>
          <rect x={cx - 28} y={70 - i * 6} width="56" height={70 + i * 6} rx="6" fill="#fff" stroke={navy} strokeWidth="2.5" />
          <path d={`M ${cx - 32} ${70 - i * 6} L ${cx} ${50 - i * 6} L ${cx + 32} ${70 - i * 6} Z`} fill={i === 1 ? gold : navy} opacity="0.85" />
        </g>
      ))}
    </Frame>
  ),
  // 斎場・火葬場
  venue: (label) => (
    <Frame label={label}>
      <rect x="70" y="80" width="180" height="75" rx="4" fill="#fff" stroke={navy} strokeWidth="2.5" />
      <path d="M 60 80 L 160 40 L 260 80 Z" fill={navy} />
      <rect x="148" y="115" width="24" height="40" fill={gold} opacity="0.85" />
      {[95, 215].map((x) => (
        <rect key={x} x={x} y="100" width="20" height="20" fill={cream} stroke={navy} strokeWidth="2" />
      ))}
    </Frame>
  ),
  // 手続き・書類
  procedure: (label) => (
    <Frame label={label}>
      <rect x="105" y="50" width="110" height="105" rx="6" fill="#fff" stroke={navy} strokeWidth="2.5" />
      {[72, 90, 108, 126].map((y) => (
        <line key={y} x1="122" y1={y} x2="198" y2={y} stroke={navy} strokeWidth="2" opacity="0.5" strokeLinecap="round" />
      ))}
      <circle cx="205" cy="140" r="20" fill={gold} opacity="0.9" />
      <path d="M 196 140 l 7 7 l 12 -14" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Frame>
  ),
  // マナー・宗教
  manner: (label) => (
    <Frame label={label}>
      <circle cx="160" cy="95" r="40" fill="#fff" stroke={navy} strokeWidth="2.5" />
      <path d="M 160 70 q 22 25 0 50 q -22 -25 0 -50" fill={gold} opacity="0.85" />
      <path d="M 120 150 q 40 -20 80 0" fill="none" stroke={navy} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="160" cy="60" r="6" fill={goldLight} />
    </Frame>
  ),
  // 事前準備・終活
  prepare: (label) => (
    <Frame label={label}>
      <rect x="110" y="55" width="100" height="100" rx="8" fill="#fff" stroke={navy} strokeWidth="2.5" />
      <path d="M 132 100 l 16 16 l 30 -38" stroke={gold} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="110" y1="80" x2="210" y2="80" stroke={navy} strokeWidth="2.5" />
      <circle cx="135" cy="68" r="4" fill={navy} />
      <circle cx="185" cy="68" r="4" fill={navy} />
    </Frame>
  ),
  // 葬儀後・供養
  after: (label) => (
    <Frame label={label}>
      <rect x="135" y="70" width="50" height="85" rx="6" fill="#fff" stroke={navy} strokeWidth="2.5" />
      <rect x="148" y="60" width="24" height="20" rx="4" fill={navy} />
      <path d="M 160 95 q 10 12 0 26 q -10 -14 0 -26" fill={gold} />
      <ellipse cx="160" cy="160" rx="55" ry="8" fill={navy} opacity="0.12" />
    </Frame>
  ),
};

export function ColumnIllust({ name, className = "" }: IllustProps) {
  const render = illustrations[name] ?? illustrations.flow;
  return (
    <div className={`overflow-hidden ${className}`}>
      {render("コラムのイメージイラスト")}
    </div>
  );
}
