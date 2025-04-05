export default function DesktopMenu() {
   return (
      <ul className="flex gap-6 text-foreground">
         <li>
            <a href="/" className="desktop-link-menu">
               Início
            </a>
         </li>
         <li>
            <a href="/planos" className="desktop-link-menu">
               Planos
            </a>
         </li>
         <li>
            <a href="/aulas" className="desktop-link-menu">
               Aulas
            </a>
         </li>
         <li>
            <a href="/treinos" className="desktop-link-menu">
               Treinos
            </a>
         </li>
         <li>
            <a href="/login" className="desktop-link-menu">
               Log In
            </a>
         </li>
      </ul>
   );
}
