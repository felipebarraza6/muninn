import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const pageVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.32,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.04,
      when: "beforeChildren",
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
  },
};

const instant: Variants = {
  hidden: { opacity: 1, y: 0 },
  show: { opacity: 1, y: 0 },
};

export function AdminPageMotion({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={cn("px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto space-y-6", className)}
      variants={reduce ? instant : pageVariants}
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.div>
  );
}

export function AdminMotionItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} variants={reduce ? instant : itemVariants}>
      {children}
    </motion.div>
  );
}

export function AdminMotionList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={
        reduce
          ? instant
          : {
              hidden: {},
              show: { transition: { staggerChildren: 0.055, delayChildren: 0.06 } },
            }
      }
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.div>
  );
}
