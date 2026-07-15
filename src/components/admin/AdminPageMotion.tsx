import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const pageVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut", when: "beforeChildren", staggerChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
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
              show: { transition: { staggerChildren: 0.04, delayChildren: 0.04 } },
            }
      }
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.div>
  );
}
