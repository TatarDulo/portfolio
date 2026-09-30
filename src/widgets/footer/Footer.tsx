import { contactUrl } from "../../shared/config/portfolio";

export function Footer() {
  return (
    <footer id="contact">
      <p>Есть идея или проект?</p>
      <a href={contactUrl}>
        TELEGRAM <span>↗</span>
      </a>
      <div>
        <span>© 2026</span>
        <span>ZANGETSU / FRONTEND</span>
      </div>
    </footer>
  );
}
