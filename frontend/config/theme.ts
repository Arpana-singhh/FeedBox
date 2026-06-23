import type { ThemeConfig } from "antd";

const theme: ThemeConfig = {
  token: {
    colorPrimary      : "#C3110C",
    colorPrimaryHover : "#A50E09",
    colorPrimaryActive: "#8B0B07",
    borderRadius      : 8,
    fontFamily        : "Inter, sans-serif",
  },
  components: {
    Button: {
      colorPrimary      : "#C3110C",
      colorPrimaryHover : "#A50E09",
      borderRadius      : 8,
    },
    Input: {
      colorPrimary      : "#C3110C",
      colorPrimaryHover : "#A50E09",
      borderRadius      : 8,
    },
    Select: {
      colorPrimary      : "#C3110C",
      colorPrimaryHover : "#A50E09",
      optionSelectedBg  : "#EEF2FF",
      borderRadius      : 8,
    },
    Pagination: {
      colorPrimary      : "#C3110C",
      colorPrimaryHover : "#A50E09",
      borderRadius      : 8,
    },
    Modal: {
      colorPrimary      : "#C3110C",
      borderRadius      : 8,
    },
    Collapse: {
      colorPrimary      : "#C3110C",
      borderRadius      : 8,
    },
    Badge: {
      colorPrimary      : "#C3110C",
    },
    Table: {
      borderColor       : "#e5e7eb",
    },
  },
};

export default theme;
