import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const easeOut = [0.22, 1, 0.36, 1] as const;

const pageVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: easeOut,
      when: "beforeChildren",
      staggerChildren: 0.03,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.18, ease: easeOut },
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
              show: { transition: { staggerChildren: 0.025 } },
            }
      }
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.div>
  );
}
