import React from "react";

interface SkillTagProps {
  name: string;
}

const SkillTag: React.FC<SkillTagProps> = ({ name }) => {
  return (
    <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm hover:bg-purple-500/10 hover:border-purple-500 hover:-translate-y-1 transition-all cursor-default">
      {name}
    </span>
  );
};

export default SkillTag;
