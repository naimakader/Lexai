export function Skeleton({
  width,
  height,
  borderRadius = 8,
}: {
  width?: string | number;
  height?: string | number;
  borderRadius?: number;
}) {
  return (
    <div
      style={{
        width: width || "100%",
        height: height || 16,
        borderRadius,
        background: "rgba(255,255,255,0.06)",
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)",
          animation: "shimmer 1.5s infinite",
        }}
      />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div
      style={{
        padding: "1.5rem 2rem",
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 16,
        display: "flex",
        alignItems: "center",
        gap: "1.5rem",
      }}
    >
      <Skeleton width={52} height={52} borderRadius={14} />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <Skeleton width={70} height={20} borderRadius={100} />
          <Skeleton width={80} height={20} borderRadius={100} />
        </div>
        <Skeleton width="60%" height={18} borderRadius={6} />
        <Skeleton width="90%" height={14} borderRadius={6} />
      </div>
      <Skeleton width={36} height={36} borderRadius={10} />
    </div>
  );
}

export function SkeletonSessionCard() {
  return (
    <div
      style={{
        padding: "1.5rem 2rem",
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 16,
        display: "flex",
        alignItems: "center",
        gap: "1.5rem",
      }}
    >
      <Skeleton width={56} height={56} borderRadius={50} />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <Skeleton width="50%" height={18} borderRadius={6} />
        <div style={{ display: "flex", gap: 10 }}>
          <Skeleton width={80} height={14} borderRadius={6} />
          <Skeleton width={60} height={14} borderRadius={6} />
        </div>
      </div>
      <Skeleton width={36} height={36} borderRadius={10} />
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div
      style={{
        padding: "1.25rem 1.5rem",
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 14,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <Skeleton width="40%" height={32} borderRadius={6} />
      <Skeleton width="70%" height={14} borderRadius={6} />
    </div>
  );
}

export const skeletonStyles = `
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;
