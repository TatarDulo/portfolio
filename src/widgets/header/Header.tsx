import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type SectionKey = "hero" | "work" | "profile" | "contact";

type SectionMeta = {
  key: SectionKey;
  id: string;
  index: string;
  label: string;
};

const sections: SectionMeta[] = [
  { key: "hero", id: "hero", index: "01 / 04", label: "HERO" },
  { key: "work", id: "projects", index: "02 / 04", label: "WORK" },
  { key: "profile", id: "about", index: "03 / 04", label: "PROFILE" },
  { key: "contact", id: "contact", index: "04 / 04", label: "CONTACT" },
];

function SectionIndicator() {
  const [activeSection, setActiveSection] = useState<SectionKey>("hero");
  const [isOpen, setIsOpen] = useState(false);
  const previousSectionRef = useRef<SectionKey>("hero");
  const numberPreviousRef = useRef<HTMLSpanElement | null>(null);
  const numberCurrentRef = useRef<HTMLSpanElement | null>(null);
  const labelPreviousRef = useRef<HTMLSpanElement | null>(null);
  const labelCurrentRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const sectionElements = sections
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    if (!sectionElements.length) {
      return undefined;
    }

    const triggers = sectionElements.map((section) => {
      const meta = sections.find((item) => item.id === section.id)!;

      return ScrollTrigger.create({
        trigger: section,
        start: "top 60%",
        end: "bottom 40%",
        onToggle: (self) => {
          if (self.isActive) {
            setActiveSection(meta.key);
          }
        },
      });
    });

    return () => {
      triggers.forEach((trigger) => trigger.kill());
    };
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const current = sections.find((item) => item.key === activeSection)!;
    const previous = sections.find(
      (item) => item.key === previousSectionRef.current,
    )!;

    if (
      !numberCurrentRef.current ||
      !numberPreviousRef.current ||
      !labelCurrentRef.current ||
      !labelPreviousRef.current
    ) {
      previousSectionRef.current = activeSection;
      return;
    }

    if (reduceMotion.matches) {
      numberPreviousRef.current.textContent = current.index;
      numberCurrentRef.current.textContent = current.index;
      labelPreviousRef.current.textContent = current.label;
      labelCurrentRef.current.textContent = current.label;
      previousSectionRef.current = activeSection;
      return;
    }

    numberPreviousRef.current.textContent = previous.index;
    numberCurrentRef.current.textContent = current.index;
    labelPreviousRef.current.textContent = previous.label;
    labelCurrentRef.current.textContent = current.label;

    gsap.set([numberPreviousRef.current, numberCurrentRef.current], {
      position: "absolute",
      left: 0,
      top: 0,
      y: 0,
      opacity: 1,
    });

    gsap.set([labelPreviousRef.current, labelCurrentRef.current], {
      position: "absolute",
      left: 0,
      top: 0,
      y: 0,
      opacity: 1,
    });

    gsap.fromTo(
      numberPreviousRef.current,
      { y: 0, opacity: 1 },
      { y: -18, opacity: 0, duration: 0.32, ease: "power3.out" },
    );
    gsap.fromTo(
      numberCurrentRef.current,
      { y: 18, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.32, ease: "power3.out" },
    );

    gsap.fromTo(
      labelPreviousRef.current,
      { y: 0, opacity: 1 },
      { y: -18, opacity: 0, duration: 0.32, ease: "power3.out" },
    );
    gsap.fromTo(
      labelCurrentRef.current,
      { y: 18, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.32, ease: "power3.out" },
    );

    previousSectionRef.current = activeSection;
  }, [activeSection]);

  const current = sections.find((item) => item.key === activeSection)!;

  return (
    <div
      className="section-indicator-wrapper"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={(event) => {
        const nextFocusTarget = event.relatedTarget as Node | null;
        if (!event.currentTarget.contains(nextFocusTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <button
        type="button"
        className="section-indicator"
        aria-label="Выбрать раздел страницы"
        aria-expanded={isOpen}
        aria-controls="section-indicator-menu"
        onClick={() => setIsOpen((value) => !value)}
      >
        <span className="indicator-number-stack" aria-live="polite">
          <span ref={numberPreviousRef} className="indicator-slot previous">
            {current.index}
          </span>
          <span ref={numberCurrentRef} className="indicator-slot current">
            {current.index}
          </span>
        </span>
        <span className="indicator-label-stack" aria-live="polite">
          <span ref={labelPreviousRef} className="indicator-slot previous">
            {current.label}
          </span>
          <span ref={labelCurrentRef} className="indicator-slot current">
            {current.label}
          </span>
        </span>
      </button>

      <div
        id="section-indicator-menu"
        className={`section-indicator-menu ${isOpen ? "open" : ""}`}
        role="menu"
        aria-label="Навигация по секциям"
      >
        {sections.map((item) => (
          <a
            key={item.key}
            href={`#${item.id}`}
            className={activeSection === item.key ? "active" : ""}
            onClick={() => setIsOpen(false)}
            role="menuitem"
          >
            <span>{item.index}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

export function Header() {
  return (
    <header className="topbar">
      <a className="brand" href="#top" aria-label="В начало">
        Zangetsu / Dev
      </a>
      <nav aria-label="Основная навигация">
        <a href="#projects">проекты</a>
        <a href="#about">обо мне</a>
        <a href="#contact">контакты</a>
      </nav>

      <div className="header-actions">
        <SectionIndicator />
      </div>
    </header>
  );
}
