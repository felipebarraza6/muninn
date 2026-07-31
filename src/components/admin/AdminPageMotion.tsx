import { motion, useReducedMotion, type Variants } from "framer-motion";
import { motionTokens } from "@/lib/motion";
import { cn } from "@/lib/utils";

const pageVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: motionTokens.base,
      ease: motionTokens.easePage,
      when: "beforeChildren",
      staggerChildren: motionTokens.stagger,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: motionTokens.fast, ease: motionTokens.easePage },
  },
};

const instant: Variants = {
  hidden: { opacity: 1 },
  show: { opacity: 1 },
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

/** Item de página: hereda stagger del padre; variants locales solo si reduce motion. */
export function AdminMotionItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}

/** Lista con stagger suave (evitar en tablas largas). */
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
              show: { transition: { staggerChildren: motionTokens.stagger } },
            }
      }
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.div>
  );
}
