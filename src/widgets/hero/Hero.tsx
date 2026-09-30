import { useEffect, useRef } from "react";
import heroImage from "../../assets/banner.jpg";

export function Hero() {
  const portraitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 10;
      const y = (event.clientY / window.innerHeight - 0.5) * 8;
      portraitRef.current?.style.setProperty(
        "transform",
        `translate(${x}px, ${y}px)`,
      );
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return (
    <section className="hero" id="hero">
      <div className="hero-copy">
        <p className="eyebrow">frontend developer / portfolio 2026</p>
        <h1>
          ДМИТРИЙ
          <br />
          <span>ЛЕОНОВ</span>
        </h1>
        <p className="lead">
          Создаю выразительные интерфейсы — от сложных продуктовых сценариев до
          сайтов, которые хочется рассматривать.
        </p>
        <a className="cta" href="#projects">
          Смотреть проекты <span>↘</span>
        </a>
      </div>
      <div className="portrait" ref={portraitRef} aria-hidden="true">
        <img
          style={{ boxShadow: "0 0 20px rgba(0, 0, 0, 0.5)" }}
          src={heroImage}
          alt=""
        />
        <div className="scan" />
        <span className="tag tag-a">react.tsx</span>
        <span className="tag tag-b">interface / soul</span>
        <div className="orbit">∞</div>
      </div>
      <div className="index-card">
        <span>現在</span>
        <strong>
          09:00
          <br />-<br />
          18:00
        </strong>
        <small>ДОСТУПЕН ДЛЯ РАБОТЫ</small>
      </div>
      <p className="vertical">DIGITAL EXPERIENCES / TAMBOV → WORLD</p>
    </section>
  );
}
