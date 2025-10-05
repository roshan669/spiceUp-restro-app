export default function SkeletonGrid({ count = 8 }: { count?: number }) {
  const items = Array.from({ length: count });
  return (
    <div className="grid">
      {items.map((_, i) => (
        <div className="skel-card" key={i}>
          <div className="item-row">
            <div className="item-media skeleton skel-media" />
            <div className="item-body">
              <div className="item-head">
                <div className="item-title" style={{ width: "70%" }}>
                  <div
                    className="skeleton skel-line"
                    style={{ width: "100%" }}
                  />
                </div>
                <div className="skeleton skel-line" style={{ width: 48 }} />
              </div>
              <div className="item-desc">
                <div
                  className="skeleton skel-line"
                  style={{ width: "100%", marginBottom: 6 }}
                />
                <div className="skeleton skel-line" style={{ width: "80%" }} />
              </div>
              <div className="skeleton skel-btn" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
