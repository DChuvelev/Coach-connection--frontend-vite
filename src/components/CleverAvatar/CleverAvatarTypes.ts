import { CSSProperties } from "react";

export interface Props {
  avatar: string;
  name: string;
  color: CSSProperties["color"];
  onClick: () => void;
  isHovered: boolean;
}
