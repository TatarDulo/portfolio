import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  aboutApproach,
  aboutValues,
  contactUrl,
  skills,
} from "../../shared/config/portfolio";

gsap.registerPlugin(ScrollTrigger);

export function About() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setStatus(skills.length > 0 ? "ready" : "error");
    }, 650);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const revealItems = gsap.utils.toArray<HTMLElement>(".about-reveal");

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(revealItems, { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        revealItems,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 76%",
            once: true,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (status !== "ready") {
      return undefined;
    }

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".stack-item");
      gsap.fromTo(
        items,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power3.out",
          stagger: 0.07,
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [status]);

  const handleRetry = () => {
    setStatus("loading");
    window.setTimeout(() => {
      setStatus(skills.length > 0 ? "ready" : "error");
    }, 550);
  };

  return (
    <section className="about" id="about" ref={sectionRef}>
      <div className="about-intro">
        <p className="eyebrow about-reveal">profile.txt</p>
        <h2 className="about-reveal">
          Разработка, <br />
          которая решает задачи.
        </h2>
        <div className="about-intro-copy about-reveal">
          <p>
            Разрабатываю веб-продукты с нуля и помогаю развивать уже
            существующие проекты. 4+ года коммерческого опыта. От небольших
            доработок до полноценной разработки под ключ.
          </p>
        </div>
        <div className="about-index" aria-hidden="true">
          <strong>02</strong>
          <span>ABOUT.ME</span>
          <span>APPROACH / STACK / PROCESS</span>
        </div>
      </div>

      <div className="about-copy">
        <AboutInfoBlock index="01" label="VALUE" items={aboutValues} />
        <AboutInfoBlock index="02" label="APPROACH" items={aboutApproach} />

        <section className="about-block about-block-stack about-reveal">
          <AboutBlockHeader index="03" label="STACK" />
          <div className="stack" aria-busy={status === "loading"}>
            {status === "loading" &&
              Array.from({ length: 6 }).map((_, index) => (
                <span key={`skeleton-${index}`} className="stack-skeleton" />
              ))}

            {status === "error" && (
              <div className="stack-state" role="status" aria-live="polite">
                <span>Не удалось загрузить стек.</span>
                <button type="button" onClick={handleRetry}>
                  Повторить
                </button>
              </div>
            )}

            {status === "ready" &&
              skills.map((skill) => (
                <span key={skill} className="stack-item">
                  {skill}
                </span>
              ))}
          </div>
        </section>

        <section className="about-block about-contact about-reveal">
          <AboutBlockHeader index="04" label="CONTACT" />
          <div className="about-contact-content">
            <div>
              <h3>Есть задача или проект?</h3>
              <p>Давайте обсудим детали и подберём подходящий формат работы.</p>
            </div>
            <a className="about-contact-link" href={contactUrl}>
              НАПИСАТЬ В TELEGRAM <span>↗</span>
            </a>
          </div>
        </section>
      </div>
    </section>
  );
}

function AboutBlockHeader({ index, label }: { index: string; label: string }) {
  return (
    <div className="about-block-header">
      <span>[ {index} ]</span>
      <span>[ {label} ]</span>
    </div>
  );
}

function AboutInfoBlock({
  index,
  label,
  items,
}: {
  index: string;
  label: string;
  items: { title: string; description: string }[];
}) {
  return (
    <section className="about-block about-reveal">
      <AboutBlockHeader index={index} label={label} />
      <h3>
        {label === "VALUE"
          ? "Что вы получите, работая со мной:"
          : "Как я работаю:"}
      </h3>
      <div className="about-list">
        {items.map((item, itemIndex) => (
          <div className="about-list-row" key={item.title}>
            <span className="about-list-index">0{itemIndex + 1}</span>
            <span className="about-list-marker" aria-hidden="true" />
            <div>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
