import { Variants } from "framer-motion";

// Fade animations
export const fadeInOut: Variants = {
  initial: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
  animate: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

// Slide animations
export const slideUpDown: Variants = {
  initial: {
    y: 20,
    opacity: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  exit: {
    y: 20,
    opacity: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
};

export const slideInOut: Variants = {
  initial: {
    x: -20,
    opacity: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  exit: {
    x: 20,
    opacity: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
};

// Scale animations
export const scaleInOut: Variants = {
  initial: {
    scale: 0.9,
    opacity: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  exit: {
    scale: 0.9,
    opacity: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
};

// Card hover animation
export const cardHover: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

// List item stagger animation
export const listContainer: Variants = {
  animate: {
    transition: { staggerChildren: 0.1 },
  },
};

export const listItem: Variants = {
  initial: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.2 },
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: { duration: 0.2 },
  },
};

// Page transition
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.3 },
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 },
  },
};
