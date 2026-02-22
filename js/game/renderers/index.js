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
import { renderCarAdditionPick } from "./car_addition_pick.js";
import { renderAppleSubtractionPick } from "./apple_subtraction_pick.js";
import { renderDonutDivisionDrag } from "./donut_division_drag.js";
import { renderChairMultiplicationRows } from "./chair_multiplication_rows.js";
import { renderPizzaFractionPick } from "./pizza_fraction_pick.js";
import { renderPizzaCompareDrag } from "./pizza_compare_drag.js";
import { renderBarDecimalPick } from "./bar_decimal_pick.js";
import { renderBottleDecimalPick } from "./bottle_decimal_pick.js";
import { renderPercentColor100 } from "./percent_color_100.js";
import { renderUkurCompareSignPick } from "./ukur_compare_sign_pick.js";
import { renderUkurSortHeightDrag } from "./ukur_sort_height_drag.js";

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
  "image_place_value_pick": renderImagePlaceValuePick,
  "car_addition_pick": renderCarAdditionPick,
  "apple_subtraction_pick": renderAppleSubtractionPick,
  "donut_division_drag": renderDonutDivisionDrag,
  "chair_multiplication_pick": renderChairMultiplicationRows,
  "pizza_fraction_pick": renderPizzaFractionPick,
  "pizza_compare_drag": renderPizzaCompareDrag,
  "bar_decimal_pick": renderBarDecimalPick,
  "bottle_decimal_pick": renderBottleDecimalPick,
  "percent_color_100": renderPercentColor100,
  "ukur_compare_sign_pick": renderUkurCompareSignPick,
  "ukur_sort_height_drag": renderUkurSortHeightDrag
};
