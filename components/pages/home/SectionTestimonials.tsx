import Section from "@/components/base/containers/section/Section";
import TestimonialCard from "@/components/base/containers/card/TestimonialCard";
import Carousel from "@/components/base/containers/carousel/Carousel";
const testimonials = [
   {
      name: "John Doe",
      message:
         "A SmarterFit mudou minha vida! Eu sempre tive dificuldades em manter uma rotina de exercícios, mas com os treinos personalizados e o acompanhamento constante, finalmente encontrei uma forma de me manter motivado. Em poucos meses, ganhei mais disposição, perdi peso e recuperei minha autoestima.",
      rating: 4.5,
      avatar:
         "https://loremfaces.net/96/id/1.jpg",
   },
   {
      name: "Mariana Silva",
      message:
         "Nunca pensei que fosse gostar de academia até conhecer a SmarterFit. O ambiente é acolhedor, os profissionais são incríveis e o app me ajuda a acompanhar meu progresso de forma clara e objetiva. Depois de anos sedentária, voltei a me sentir viva, com energia e confiança para encarar os desafios do dia a dia.",
      rating: 5,
      avatar:
         "https://loremfaces.net/96/id/2.jpg",
   },
   {
      name: "Carlos Mendes",
      message:
         "Passei anos lidando com dores nas costas e falta de mobilidade. Quando comecei a treinar na SmarterFit, recebi todo o suporte necessário para adaptar os exercícios às minhas limitações. Hoje, consigo trabalhar e viver sem dor, e ainda me sinto mais forte e disposto. Sou eternamente grato por essa transformação.",
      rating: 4,
      avatar:
         "https://loremfaces.net/96/id/3.jpg",
   },
   {
      name: "Beatriz Rocha",
      message:
         "O que mais me impressiona na SmarterFit é o foco na saúde integral. Não é só sobre perder peso ou ganhar massa, mas sobre se sentir bem consigo mesma. Os treinos, o suporte psicológico e o senso de comunidade fizeram com que eu me sentisse acolhida e confiante. Nunca mais me senti sozinha nessa jornada.",
      rating: 5,
      avatar:
         "https://loremfaces.net/96/id/4.jpg",
   },
   {
      name: "Fernando Almeida",
      message:
         "Depois de uma lesão no joelho, achei que não conseguiria mais treinar como antes. A equipe da SmarterFit criou um plano de recuperação que respeitou meu ritmo e me deu forças para continuar. Hoje, além de recuperado, estou mais forte do que nunca. A atenção ao detalhe fez toda a diferença.",
      rating: 4.5,
      avatar:
         "https://loremfaces.net/96/id/5.jpg",
   },
];

export default function SectionTestimonials() {
   return (
      <Section id="section-testimonials" className="flex-col justify-baseline">
         <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-white my-16">
            Depoimentos
         </h2>
         <p className="text-lg sm:text-xl mb-8 text-white">
            Veja o que nossos clientes dizem sobre a SmarterFit
         </p>
         <Carousel
            itemsToShow={{
               base: 1,
               sm: 2,
               md: 3,
               lg: 4,
            }}
            showDots={true}
            showArrows={true}
            gap={16}
            className="mb-16"
         >
            {testimonials.map((testimonial, index) => (
               <TestimonialCard key={index} testimonial={testimonial} />
            ))}
         </Carousel>
      </Section>
   );
}
