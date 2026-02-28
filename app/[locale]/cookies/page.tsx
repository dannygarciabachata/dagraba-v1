import LegalLayout from '../legal-layout';

export default function CookiesPage() {
    return (
        <LegalLayout>
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-2 text-white">Política de Cookies</h1>
            <p className="text-[#FF6B00] font-mono text-sm tracking-widest uppercase mb-12">Da Graba Studio Cloud Engine</p>

            <p className="text-[#888] italic mb-8 border-l-4 border-[#222] pl-4">
                Última actualización: 16 de febrero de 2026
            </p>

            <div className="space-y-12">
                <section>
                    <h2 className="text-xl font-bold tracking-widest uppercase text-cyan-400 mb-4 border-b border-[#222] pb-2">2.1. ¿Qué son las Cookies?</h2>
                    <p className="text-[#CCC] leading-relaxed">
                        Las cookies son pequeños archivos de texto que nos ayudan a que tu experiencia en el DA GRABA STUDIO Cloud Engine sea fluida y profesional.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold tracking-widest uppercase text-cyan-400 mb-4 border-b border-[#222] pb-2">2.2. Tipos de Cookies que Utilizamos</h2>
                    <ul className="list-disc pl-5 space-y-4 text-[#CCC] leading-relaxed">
                        <li>
                            <strong className="text-white">Esenciales:</strong> Necesarias para que mantengas tu sesión abierta mientras entrenas tus modelos o generas música. Sin estas, el sistema no funcionaría.
                        </li>
                        <li>
                            <strong className="text-white">De Rendimiento:</strong> Nos ayudan a saber si el servidor está lento o si hay errores en el proceso de "Process Data" o "Train".
                        </li>
                        <li>
                            <strong className="text-white">Funcionales:</strong> Recuerdan tus preferencias, como el idioma o la configuración de tus modelos de IA favoritos.
                        </li>
                        <li>
                            <strong className="text-white">Analíticas:</strong> Nos permiten entender qué funciones son las más usadas por los bachateros para seguir mejorando el sistema.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold tracking-widest uppercase text-cyan-400 mb-4 border-b border-[#222] pb-2">2.3. Control de Cookies</h2>
                    <p className="text-[#CCC] leading-relaxed">
                        Puedes desactivar las cookies desde la configuración de tu navegador. Sin embargo, ten en cuenta que funciones críticas como el entrenamiento de voces y el acceso a tu panel de ODGMUSIC podrían verse afectadas.
                    </p>
                </section>
            </div>
        </LegalLayout>
    );
}
