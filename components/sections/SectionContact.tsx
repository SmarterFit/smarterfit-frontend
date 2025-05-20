"use client";

import { useForm } from "react-hook-form";
import { Mail, Send } from "lucide-react";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormDescription,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

type ContactFormValues = {
   name: string;
   email: string;
   subject: string;
   message: string;
};

export default function SectionContact() {
   const form = useForm<ContactFormValues>({
      defaultValues: {
         name: "",
         email: "",
         subject: "",
         message: "",
      },
   });

   function onSubmit(data: ContactFormValues) {
      toast("Mensagem enviada!", {
         description: data.name
            ? `Olá, ${data.name}! A gente te responderá em breve.`
            : "Em breve entraremos em contato com você.",
         closeButton: true,
      });

      form.reset();
   }

   return (
      <section
         className="w-full bg-cover bg-center py-20 min-h-screen pt-16"
         id="contato"
      >
         <div className="container mx-auto relative z-20 flex flex-col items-center justify-center text-center min-h-screen p-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center">
               Fale com a Gente
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-center text-lg md:text-xl">
               Quer tirar dúvidas, dar sugestões ou apenas bater um papo?
               Preencha o formulário abaixo e entraremos em contato o quanto
               antes!
            </p>

            <Card className="mt-12 w-full max-w-xl bg-white/10 border-transparent">
               <CardHeader>
                  <CardTitle className="flex items-center justify-center gap-2">
                     <Mail className="h-5 w-5 text-primary" />
                     Formulário de Contato
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <Form {...form}>
                     <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-2"
                     >
                        {/* Nome */}
                        <FormField
                           control={form.control}
                           name="name"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Nome</FormLabel>
                                 <FormControl>
                                    <Input placeholder="Seu nome" {...field} />
                                 </FormControl>
                                 <FormDescription>
                                    Informe seu nome completo.
                                 </FormDescription>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        {/* E‑mail */}
                        <FormField
                           control={form.control}
                           name="email"
                           rules={{
                              pattern: {
                                 value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                 message: "Formato de e‑mail inválido.",
                              },
                           }}
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>E‑mail</FormLabel>
                                 <FormControl>
                                    <Input
                                       type="email"
                                       placeholder="seu@exemplo.com"
                                       {...field}
                                    />
                                 </FormControl>
                                 <FormDescription>
                                    Vamos usar para contato e confirmação.
                                 </FormDescription>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        {/* Assunto (obrigatório) */}
                        <FormField
                           control={form.control}
                           name="subject"
                           rules={{ required: "Assunto é obrigatório." }}
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Assunto</FormLabel>
                                 <FormControl>
                                    <Input
                                       placeholder="Sobre o que é?"
                                       required
                                       {...field}
                                    />
                                 </FormControl>
                                 <FormDescription>
                                    Resuma em poucas palavras.
                                 </FormDescription>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        {/* Mensagem (obrigatório) */}
                        <FormField
                           control={form.control}
                           name="message"
                           rules={{ required: "Mensagem é obrigatória." }}
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Mensagem</FormLabel>
                                 <FormControl>
                                    <Textarea
                                       placeholder="Escreva sua mensagem..."
                                       rows={5}
                                       required
                                       {...field}
                                    />
                                 </FormControl>
                                 <FormDescription>
                                    Seja claro e objetivo.
                                 </FormDescription>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        <Button
                           type="submit"
                           className="mt-4 flex items-center gap-2 self-center px-10 cursor-pointer"
                        >
                           <Send className="h-4 w-4" />
                           Enviar Mensagem
                        </Button>
                     </form>
                  </Form>
               </CardContent>
            </Card>
         </div>
      </section>
   );
}
