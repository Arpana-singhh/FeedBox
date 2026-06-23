import type { ThemeConfig } from "antd";

const theme: ThemeConfig = {
  token: {
    colorPrimary      : "#4F46E5",
    colorPrimaryHover : "#4338CA",
    colorPrimaryActive: "#3730A3",
    borderRadius      : 8,
    fontFamily        : "Inter, sans-serif",
  },
  components: {
    Button: {
      colorPrimary      : "#4F46E5",
      colorPrimaryHover : "#4338CA",
      borderRadius      : 8,
    },
    Input: {
      colorPrimary      : "#4F46E5",
      colorPrimaryHover : "#4338CA",
      borderRadius      : 8,
    },
    Select: {
      colorPrimary      : "#4F46E5",
      colorPrimaryHover : "#4338CA",
      optionSelectedBg  : "#EEF2FF",
      borderRadius      : 8,
    },
    Pagination: {
      colorPrimary      : "#4F46E5",
      colorPrimaryHover : "#4338CA",
      borderRadius      : 8,
    },
    Modal: {
      colorPrimary      : "#4F46E5",
      borderRadius      : 8,
    },
    Collapse: {
      colorPrimary      : "#4F46E5",
      borderRadius      : 8,
    },
    Badge: {
      colorPrimary      : "#4F46E5",
    },
    Table: {
      borderColor       : "#e5e7eb",
    },
  },
};

export default theme;
