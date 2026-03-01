import LegalLayout from '../legal-layout';

export default function PrivacyPage() {
    return (
        <LegalLayout>
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-2 text-white">Política de Privacidad</h1>
            <p className="text-[#FF6B00] font-mono text-sm tracking-widest uppercase mb-12">Da Graba Studio Cloud Engine & ODGMUSIC</p>

            <p className="text-[#888] italic mb-8 border-l-4 border-[#222] pl-4">
                Última actualización: 16 de febrero de 2026
            </p>

            <div className="space-y-12">
                <section>
                    <h2 className="text-xl font-bold tracking-widest uppercase text-cyan-400 mb-4 border-b border-[#222] pb-2">1.1. Información que Recopilamos</h2>
                    <ul className="list-disc pl-5 space-y-4 text-[#CCC] leading-relaxed">
                        <li><strong className="text-white">Datos de Cuenta:</strong> Correo electrónico, nombre artístico y datos de inicio de sesión (Google, Discord, etc.).</li>
                        <li><strong className="text-white">ADN Vocal (Audios de Entrenamiento):</strong> Archivos .wav o .mp3 que subes para entrenar modelos RVC.</li>
                        <li><strong className="text-white">Datos de Uso:</strong> Prompts de texto, registros de generación y archivos de audio creados.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold tracking-widest uppercase text-cyan-400 mb-4 border-b border-[#222] pb-2">1.2. Uso de los Datos y "ADN Vocal"</h2>
                    <ul className="list-disc pl-5 space-y-4 text-[#CCC] leading-relaxed">
                        <li><strong className="text-white">Privacidad por Diseño:</strong> Tus audios de entrenamiento se utilizan exclusivamente para procesar tu modelo personal. DA GRABA STUDIO no vende, regala ni utiliza tus voces para entrenar modelos públicos sin tu permiso expreso.</li>
                        <li><strong className="text-white">Seguridad:</strong> Utilizamos cifrado de alto nivel para asegurar que tu modelo de voz solo sea accesible desde tu cuenta.</li>
                        <li><strong className="text-white">Mejora del Servicio:</strong> Los datos de uso (no las voces) se analizan de forma anónima para optimizar nuestros servidores y algoritmos de bachata y bolero.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold tracking-widest uppercase text-cyan-400 mb-4 border-b border-[#222] pb-2">1.3. Compartición de Datos</h2>
                    <p className="text-[#CCC] mb-4">No compartimos tus datos con terceros, excepto:</p>
                    <ul className="list-disc pl-5 space-y-2 text-[#CCC] leading-relaxed">
                        <li>Para procesar pagos (Stripe/PayPal).</li>
                        <li>Para registros oficiales de Copyright y Publishing con ODGMUSIC / ASCAP (solo si eliges distribuir con nosotros).</li>
                        <li>Por requerimiento legal de autoridades competentes.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold tracking-widest uppercase text-cyan-400 mb-4 border-b border-[#222] pb-2">1.4. Tus Derechos</h2>
                    <p className="text-[#CCC] mb-4">Como artista, tienes derecho a:</p>
                    <ul className="list-disc pl-5 space-y-2 text-[#CCC] leading-relaxed">
                        <li><strong className="text-white">Eliminar tus datos:</strong> Puedes borrar tus modelos de voz y archivos en cualquier momento.</li>
                        <li><strong className="text-white">Portabilidad:</strong> Solicitar una copia de tus creaciones.</li>
                        <li><strong className="text-white">Acceso:</strong> Saber exactamente qué información tenemos almacenada.</li>
                    </ul>
                </section>
            </div>
        </LegalLayout>
    );
}
