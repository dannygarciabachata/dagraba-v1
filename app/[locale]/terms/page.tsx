import LegalLayout from '../legal-layout';

export default function TermsPage() {
    return (
        <LegalLayout>
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-2 text-white">Términos de Servicio</h1>
            <p className="text-[#FF6B00] font-mono text-sm tracking-widest uppercase mb-12">Y Acuerdo de Licencia de Da Graba Studio Cloud Engine</p>

            <p className="text-[#888] italic mb-8 border-l-4 border-[#222] pl-4">
                Última actualización: 16 de febrero de 2026<br />
                Operado por: DA GRABA STUDIO & ODGMUSIC LATIN WORLDWIDE PUBLISHING
            </p>

            <p className="mb-8 text-[#CCC] leading-relaxed">
                Al acceder o utilizar el servicio DA GRABA STUDIO Cloud Engine, usted (el "Usuario") acepta estar legalmente vinculado por los siguientes términos. Si no está de acuerdo, no utilice el Servicio.
            </p>

            <div className="space-y-12">
                <section>
                    <h2 className="text-xl font-bold tracking-widest uppercase text-cyan-400 mb-4 border-b border-[#222] pb-2">1. Modelo de Propiedad y Membresía (Regla 60/40)</h2>
                    <ul className="list-disc pl-5 space-y-4 text-[#CCC] leading-relaxed">
                        <li>
                            <strong className="text-white">Usuarios con Membresía Activa:</strong> Los usuarios que mantengan una suscripción paga tienen plenos derechos comerciales sobre el contenido generado. La música es "Libre de Regalías" (Royalty Free) para el usuario bajo este plan.
                        </li>
                        <li>
                            <strong className="text-white">Usuarios sin Membresía (Plan Free):</strong> Para compensar el uso de nuestra infraestructura y librerías de instrumentos exclusivos, el Usuario acepta que DA GRABA STUDIO / ODGMUSIC retendrá automáticamente el 60% de los derechos de autor y derechos conexos sobre cada obra generada.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold tracking-widest uppercase text-cyan-400 mb-4 border-b border-[#222] pb-2">2. Privacidad del ADN Vocal y Modelos RVC</h2>
                    <ul className="list-disc pl-5 space-y-4 text-[#CCC] leading-relaxed">
                        <li>
                            <strong className="text-white">Uso Privado:</strong> Los audios subidos para entrenar voces son procesados de forma encriptada. El modelo de voz resultante pertenece al Usuario y es estrictamente privado.
                        </li>
                        <li>
                            <strong className="text-white">Prohibición de Uso por Terceros:</strong> DA GRABA STUDIO no compartirá, regalará ni utilizará su ADN vocal para otros usuarios sin su consentimiento expreso a través de la sección "Discover".
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold tracking-widest uppercase text-cyan-400 mb-4 border-b border-[#222] pb-2">3. Instrumentación y ADN de Ejecución (Límite de Responsabilidad)</h2>
                    <ul className="list-disc pl-5 space-y-4 text-[#CCC] leading-relaxed">
                        <li>
                            <strong className="text-white">Instrumentos Originales DGB:</strong> El sistema utiliza modelos entrenados con instrumentos reales grabados por Danny Garcia y maestros dominicanos.
                        </li>
                        <li>
                            <strong className="text-white">Instrumentos de Terceros:</strong> DA GRABA STUDIO permite la integración de modelos externos. Sin embargo, el sistema no se responsabiliza si el audio generado infringe el "ADN de ejecución" de un músico real.
                        </li>
                        <li>
                            <strong className="text-white">Responsabilidad del Creador:</strong> Si un artista publica o distribuye una canción que genere reclamos de propiedad intelectual por su estilo de ejecución, la responsabilidad legal recae íntegramente sobre el Artista/Usuario, deslindando a DA GRABA STUDIO de cualquier litigio.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold tracking-widest uppercase text-cyan-400 mb-4 border-b border-[#222] pb-2">4. Acuerdo de Publishing y Distribución (ODGMUSIC)</h2>
                    <ul className="list-disc pl-5 space-y-4 text-[#CCC] leading-relaxed">
                        <li>
                            <strong className="text-white">Designación:</strong> Al seleccionar la opción de "Distribución con nosotros", el Usuario designa a ODGMUSIC LATIN WORLDWIDE PUBLISHING (afiliada a ASCAP) como su administrador editorial exclusivo a nivel mundial.
                        </li>
                        <li>
                            <strong className="text-white">Reparto de Regalías (Splits):</strong> Se aplicará un contrato de administración con un reparto de 50% para el Artista y 50% para la Editora sobre los ingresos netos recaudados por explotación mecánica, sincronización y ventas digitales.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold tracking-widest uppercase text-[#FF6B00] mb-4 border-b border-[#222] pb-2">5. Usos Prohibidos</h2>
                    <ul className="list-disc pl-5 space-y-4 text-[#CCC] leading-relaxed">
                        <li>Queda prohibido el uso de sistemas automatizados (bots) para generar contenido de forma masiva que sature la infraestructura del Cloud Engine.</li>
                        <li>No se permite la creación de contenido difamatorio, ilegal o que infrinja derechos de terceros utilizando voces sintéticas de figuras públicas sin autorización.</li>
                    </ul>
                </section>
            </div>
        </LegalLayout>
    );
}
