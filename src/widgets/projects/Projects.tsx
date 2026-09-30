import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

import { projects } from "../../shared/config/portfolio";

export function Projects() {
  const [activeProject, setActiveProject] = useState(0);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const listRef = useRef<HTMLDivElement | null>(null);

  const loadProjects = () => {
    setStatus("loading");
    window.setTimeout(() => {
      setStatus(projects.length > 0 ? "ready" : "error");
    }, 700);
  };

  useEffect(() => {
    loadProjects();
    return () => undefined;
  }, []);

  useEffect(() => {
    if (status !== "ready") {
      return undefined;
    }

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".project-row");
      gsap.fromTo(
        items,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.12,
        },
      );
    }, listRef);

    return () => ctx.revert();
  }, [status]);

  return (
    <section className="projects" id="projects">
      <div className="section-head">
        <p>selected work</p>
        <span>01 — 03</span>
      </div>

      <div
        ref={listRef}
        className="project-list"
        aria-busy={status === "loading"}
      >
        {status === "loading" &&
          Array.from({ length: 2 }).map((_, index) => (
            <div key={`project-skeleton-${index}`} className="project-skeleton">
              <div className="project-skeleton-no" />
              <div className="project-skeleton-content">
                <div className="project-skeleton-line short" />
                <div className="project-skeleton-line title" />
                <div className="project-skeleton-line medium" />
              </div>
              <div className="project-skeleton-arrow" />
            </div>
          ))}

        {status === "error" && (
          <div className="project-state" role="status" aria-live="polite">
            <p>Не удалось загрузить проекты.</p>
            <button type="button" onClick={loadProjects}>
              Попробовать снова
            </button>
          </div>
        )}

        {status === "ready" &&
          projects.map((project, index) => (
            <a
              className={`project project-row ${activeProject === index ? "active" : ""}`}
              key={project.title}
              tabIndex={0}
              onMouseEnter={() => setActiveProject(index)}
              onFocus={() => setActiveProject(index)}
              href={project.link}
            >
              <div className="project-no">0{index + 1}</div>
              <div>
                <p>{project.stack}</p>
                <h2>{project.title}</h2>
                <span>{project.description}</span>
              </div>
              <b>↗</b>
            </a>
          ))}
      </div>
    </section>
  );
}
