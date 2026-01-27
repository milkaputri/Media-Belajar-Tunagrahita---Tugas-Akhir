import { renderDragDropNumberToBox } from "./dragdrop_number_to_box.js";
import { renderMatchLineCountToNumber } from "../../js/game/renderers/match_line_count_to_number.js";
import { renderCountObjectsPickNumber } from "./count_objects_pick_number.js";
import { renderCatchBalloonNumber } from "./catch_balloon_number.js";
import { renderCatchNumberRain } from "./catch_number_rain.js";
import { renderStackNumberTower } from "./stack_number_tower.js";
import { renderFingerAdditionPick } from "./finger_addition_pick.js";
import { renderObjectsAdditionPick } from "./objects_addition_pick.js";
import { renderPlaceValueBoxes } from "./place_value_boxes.js";
import { renderImagePlaceValuePick } from "./image_place_value_pick.js";

// nanti tambah renderer lain di sini

export const RENDERERS = {
  "dragdrop_number_to_box": renderDragDropNumberToBox,
  "match_line_count_to_number": renderMatchLineCountToNumber,
  "count_objects_pick_number": renderCountObjectsPickNumber,
  "catch_balloon_number": renderCatchBalloonNumber,
  "catch_number_rain": renderCatchNumberRain,
  "stack_number_tower": renderStackNumberTower,
  "finger_addition_pick": renderFingerAdditionPick,
  "objects_addition_pick": renderObjectsAdditionPick,
  "place_value_boxes": renderPlaceValueBoxes,
  "image_place_value_pick": renderImagePlaceValuePick
};
