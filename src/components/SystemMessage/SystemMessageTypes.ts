import Color from "color";
import { CSSProperties } from "react";
import {
  AppDoneMessages,
  AppErrorMessages,
} from "../redux/slices/App/appTypes";

export interface Props {
  message: string | undefined;
  color: CSSProperties["color"];
}
