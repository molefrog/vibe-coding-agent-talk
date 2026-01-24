import { motion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

type HighlightProps = {
  active?: boolean;
  children: ReactNode;
  activeOpacity?: number;
  inactiveOpacity?: number;
} & Omit<HTMLMotionProps<"div">, "animate">;

/**
 * Highlight wrapper — animates opacity based on active state.
 * Grid-friendly: passes through className and all div props.
 *
 * @example
 * <Highlight active={step >= 1} className="h-full">
 *   <Card />
 * </Highlight>
 */
export const Highlight = ({
  active = true,
  children,
  activeOpacity = 1,
  inactiveOpacity = 0.25,
  ...props
}: HighlightProps) => (
  <motion.div
    initial={false}
    animate={{ opacity: active ? activeOpacity : inactiveOpacity }}
    transition={{
      type: "spring",
      stiffness: 500,
      damping: 30,
    }}
    {...props}
  >
    {children}
  </motion.div>
);
