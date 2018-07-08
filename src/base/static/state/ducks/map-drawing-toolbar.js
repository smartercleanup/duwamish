// Selectors:
export const visibleDrawingToolsSelector = state => {
  return state.mapDrawingToolbar.visibleDrawingTools;
};
export const markerPanelVisibilitySelector = state => {
  return state.mapDrawingToolbar.isMarkerPanelVisible;
};
export const activeDrawingToolSelector = state => {
  return state.mapDrawingToolbar.activeDrawingTool;
};
export const activeMarkerSelector = state => {
  return state.mapDrawingToolbar.activeMarker;
};

// Actions:
const SET_VISIBLE_DRAWING_TOOLS =
  "map-drawing-toolbar/SET_VISIBLE_DRAWING_TOOLS";
const SET_MARKER_PANEL_VISIBILIY =
  "map-drawing-toolbar/SET_MARKER_PANEL_VISIBILITY";
const SET_ACTIVE_DRAWING_TOOL = "map-drawing-toolbar/SET_ACTIVE_DRAWING_TOOL";
const SET_ACTIVE_MARKER = "map-drawing-toolbar/SET_ACTIVE_MARKER";

// Action creators:
export function setVisibleDrawingTools(visibleDrawingTools) {
  return { type: SET_VISIBLE_DRAWING_TOOLS, payload: visibleDrawingTools };
}
export function setMarkerPanelVisibility(isVisible) {
  return { type: SET_MARKER_PANEL_VISIBILIY, payload: isVisible };
}
export function setActiveDrawingTool(activeDawingTool) {
  return { type: SET_ACTIVE_DRAWING_TOOL, payload: activeDawingTool };
}
export function setActiveMarker(activeMarker) {
  return { type: SET_ACTIVE_MARKER, payload: activeMarker };
}

// Reducers:
const INITIAL_STATE = {
  visibleDrawingTools: [],
  activeDrawingTool: null,
  activeMarker: null,
  isMarkerPanelVisible: false,
};

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_VISIBLE_DRAWING_TOOLS:
      return {
        ...state,
        visibleDrawingTools: action.payload,
      };
    case SET_MARKER_PANEL_VISIBILIY:
      return {
        ...state,
        isMarkerPanelVisible: action.payload,
      };
    case SET_ACTIVE_DRAWING_TOOL:
      return {
        ...state,
        activeDrawingTool: action.payload,
      };
    case SET_ACTIVE_MARKER:
      return {
        ...state,
        activeMarker: action.payload,
      };
    default:
      return state;
  }
}
