export default function Footer() {
   return (
      <footer className="bg-zinc-900 text-white px-6 py-10 snap-start">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8">
            {/* Logo e nome */}
            <div className="flex items-center gap-4">
               <img
                  src="imgs/logo.png"
                  alt="Logo da SmarterFit"
                  className="w-12"
               />
               <span className="text-xl font-semibold">SmarterFit</span>
            </div>

            {/* Links */}
            <ul className="flex flex-col md:flex-row gap-2 md:gap-6 text-sm">
               <li>
                  <a href="#section-hero" className="hover:underline">
                     Início
                  </a>
               </li>
               <li>
                  <a href="#section-about" className="hover:underline">
                     Sobre
                  </a>
               </li>
               <li>
                  <a href="#section-plans" className="hover:underline">
                     Planos
                  </a>
               </li>
               <li>
                  <a href="#section-classes" className="hover:underline">
                     Aulas
                  </a>
               </li>
               <li>
                  <a href="#section-testimonials" className="hover:underline">
                     Comentários
                  </a>
               </li>
            </ul>

            {/* Contato */}
            <div className="text-sm">
               <p>Email: contato@smarterfit.com</p>
               <p>Telefone: (11) 98765-4321</p>
            </div>
         </div>

         <div className="mt-8 text-center text-xs text-white/60">
            &copy; {new Date().getFullYear()} SmarterFit. Todos os direitos
            reservados.
         </div>
      </footer>
   );
}
