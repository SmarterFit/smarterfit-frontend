export default function DesktopMenu() {
   return (
      <ul className="flex gap-6 text-foreground">
         <li>
            <a href="#section-hero" className="desktop-link-menu">
               Início
            </a>
         </li>
         <li>
            <a href="#section-about" className="desktop-link-menu">
               Sobre
            </a>
         </li>
         <li>
            <a href="#section-plans" className="desktop-link-menu">
               Planos
            </a>
         </li>
         <li>
            <a href="#section-classes" className="desktop-link-menu">
               Aulas
            </a>
         </li>
         <li>
            <a href="#section-testimonials" className="desktop-link-menu">
               Comentários
            </a>
         </li>
      </ul>
   );
}
