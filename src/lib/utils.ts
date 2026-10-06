export { cn } from "cn";

export const isDepartmentFeatureEnable = () => {
  if (
    Boolean(import.meta.env.VITE_FEATURE_DEPARTMENT) &&
    import.meta.env.VITE_FEATURE_DEPARTMENT !== "false"
  ) {
    return true;
  }
  return false;
};
