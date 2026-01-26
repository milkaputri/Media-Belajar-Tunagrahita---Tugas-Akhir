import { renderDragDropNumberToBox } from "./dragdrop_number_to_box.js";
import { renderMatchLineCountToNumber } from "../../js/game/renderers/match_line_count_to_number.js";

// nanti tambah renderer lain di sini

export const RENDERERS = {
  "dragdrop_number_to_box": renderDragDropNumberToBox,
  "match_line_count_to_number": renderMatchLineCountToNumber,
};
