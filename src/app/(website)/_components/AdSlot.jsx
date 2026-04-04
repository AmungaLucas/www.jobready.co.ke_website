const positionStyles = {
  leaderboard: "w-full py-6",
  inline: "w-full py-6 my-10",
  sidebar: "w-full py-8 mb-7",
};

const positionLabels = {
  leaderboard: "Advertisement — Leaderboard",
  inline: "Advertisement — Inline",
  sidebar: "Advertisement — Sidebar",
};

export default function AdSlot({ position = "sidebar" }) {
  const style = positionStyles[position] || positionStyles.sidebar;
  const label = positionLabels[position] || "Advertisement";

  return (
    <div
      className={`bg-gray-100 border border-dashed border-gray-300 text-center text-xs text-gray-400 tracking-wider uppercase rounded-lg ${style}`}
    >
      {label}
    </div>
  );
}
