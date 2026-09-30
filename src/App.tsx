import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

import { HomePage } from "./pages/home";

gsap.registerPlugin(ScrollToPlugin);

function Cursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const isDesktopPointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;

    setIsDesktop(isDesktopPointer);
  }, []);

  useEffect(() => {
    if (!isDesktop) {
      document.body.classList.remove("cursor-hover");
      return undefined;
    }

    const handlePointerMove = (event: PointerEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse") {
        setIsHovering(true);
      }
    };
    const handlePointerUp = (event: PointerEvent) => {
      if (event.pointerType === "mouse") {
        setIsHovering(false);
      }
    };

    const activateCursor = (event: Event) => {
      if ((event as PointerEvent).pointerType === "mouse") {
        setIsHovering(true);
      }
    };
    const deactivateCursor = (event: Event) => {
      if ((event as PointerEvent).pointerType === "mouse") {
        setIsHovering(false);
      }
    };

    const interactiveTargets = document.querySelectorAll(
      "a, button, .project, .cta, .sound, .tag",
    );

    interactiveTargets.forEach((element) => {
      element.addEventListener("pointerenter", activateCursor);
      element.addEventListener("pointerleave", deactivateCursor);
    });

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      interactiveTargets.forEach((element) => {
        element.removeEventListener("pointerenter", activateCursor);
        element.removeEventListener("pointerleave", deactivateCursor);
      });
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDesktop]);

  useEffect(() => {
    document.body.classList.toggle("cursor-hover", isDesktop && isHovering);
  }, [isDesktop, isHovering]);

  if (!isDesktop) {
    return null;
  }

  return (
    <div
      className="cursor"
      aria-hidden="true"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    />
  );
}

function SmoothScroll() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest("a[href^='#']");

      if (!link || reduceMotion.matches) {
        return;
      }

      const href = link.getAttribute("href");
      if (!href || href === "#") {
        return;
      }

      const section = document.querySelector(href);
      if (!section) {
        return;
      }

      event.preventDefault();
      const targetY = section.getBoundingClientRect().top + window.scrollY - 80;

      window.history.pushState(null, "", href);
      gsap.to(window, {
        duration: 1.15,
        scrollTo: { y: targetY },
        ease: "power3.inOut",
      });
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return null;
}

function App() {
  return (
    <>
      <Cursor />
      <SmoothScroll />
      <HomePage />
    </>
  );
}

export default App;
